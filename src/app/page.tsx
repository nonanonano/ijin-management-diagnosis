"use client";

import { useMemo, useState } from "react";
import {
  AXES,
  QUESTIONS,
  type AnswerMap,
  type Likert,
  type Mode,
  type Role,
  analyzePair,
  buildPairPromises,
  buildShareText,
  completionRate,
  getAxis,
  getFeedback,
  isComplete,
  scoreAnswers,
} from "@/lib/diagnosis";

const LIKERT_OPTIONS: { value: Likert; label: string }[] = [
  { value: 1, label: "そう思わない" },
  { value: 2, label: "やや違う" },
  { value: 3, label: "どちらでも" },
  { value: 4, label: "ややそう" },
  { value: 5, label: "そう思う" },
];

const emptyAnswers: AnswerMap = {};

function roleLabel(role: Role) {
  return role === "manager" ? "上司" : "部下";
}

function severityClass(severity: "smooth" | "watch" | "friction") {
  if (severity === "friction") return "border-red-200 bg-red-50 text-red-950";
  if (severity === "watch") return "border-amber-200 bg-amber-50 text-amber-950";
  return "border-emerald-200 bg-emerald-50 text-emerald-950";
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("solo");
  const [soloRole, setSoloRole] = useState<Role>("manager");
  const [activePairRole, setActivePairRole] = useState<Role>("manager");
  const [soloAnswers, setSoloAnswers] = useState<AnswerMap>(emptyAnswers);
  const [pairAnswers, setPairAnswers] = useState<Record<Role, AnswerMap>>({
    manager: {},
    member: {},
  });
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeRole = mode === "solo" ? soloRole : activePairRole;
  const answers = mode === "solo" ? soloAnswers : pairAnswers[activePairRole];
  const progress = completionRate(answers);
  const complete = isComplete(answers);

  const soloResult = useMemo(() => {
    if (!isComplete(soloAnswers)) return null;
    return scoreAnswers(soloAnswers);
  }, [soloAnswers]);

  const managerResult = useMemo(() => {
    if (!isComplete(pairAnswers.manager)) return null;
    return scoreAnswers(pairAnswers.manager);
  }, [pairAnswers.manager]);

  const memberResult = useMemo(() => {
    if (!isComplete(pairAnswers.member)) return null;
    return scoreAnswers(pairAnswers.member);
  }, [pairAnswers.member]);

  const pairInsights = useMemo(() => {
    if (!managerResult || !memberResult) return [];
    return analyzePair(managerResult, memberResult);
  }, [managerResult, memberResult]);

  const shareUrl = useMemo(() => {
    if (!showResult) return "";
    const params = new URLSearchParams();
    if (mode === "solo" && soloResult) {
      params.set("mode", "solo");
      params.set("role", soloRole);
      params.set("character", soloResult.character.id);
    }
    if (mode === "pair" && managerResult && memberResult) {
      params.set("mode", "pair");
      params.set("manager", managerResult.character.id);
      params.set("member", memberResult.character.id);
      params.set("themes", pairInsights.slice(0, 3).map((item) => item.axis).join(","));
    }
    if (!params.toString()) return "";
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [managerResult, memberResult, mode, pairInsights, showResult, soloResult, soloRole]);

  const setAnswer = (questionId: string, value: Likert) => {
    setCopied(false);
    if (mode === "solo") {
      setSoloAnswers((current) => ({ ...current, [questionId]: value }));
      return;
    }
    setPairAnswers((current) => ({
      ...current,
      [activePairRole]: {
        ...current[activePairRole],
        [questionId]: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (!complete) return;
    if (mode === "pair" && activePairRole === "manager" && !isComplete(pairAnswers.member)) {
      setActivePairRole("member");
      setShowResult(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setSoloAnswers({});
    setPairAnswers({ manager: {}, member: {} });
    setActivePairRole("manager");
    setShowResult(false);
    setCopied(false);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white/80 shadow-xl shadow-stone-900/5 backdrop-blur">
        <div className="grid gap-8 p-6 md:grid-cols-[1.15fr_0.85fr] md:p-10">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm font-medium text-stone-700">
              上司・部下の関係を整える偉人タイプ診断
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
                偉人マネジメント
                <span className="block text-amber-700">相性診断</span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-stone-700">
                歴史上の人物をモチーフに、上司と部下の「対話量」「任せ方」「変化への姿勢」「フィードバックの温度差」を見える化します。
                採用判定ではなく、1on1やチーム改善の会話に使うためのMVPです。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="質問数" value={`${QUESTIONS.length}問`} />
              <Stat label="診断軸" value={`${AXES.length}軸`} />
              <Stat label="結果" value="偉人型" />
            </div>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
            <h2 className="text-lg font-bold">使い方</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6">
              <li>1. ひとり診断なら、自分が上司・部下どちらの視点かを選ぶ。</li>
              <li>2. ペア診断なら、上司と部下が順番に同じ質問へ回答する。</li>
              <li>3. 結果を見ながら、「何を変えると働きやすいか」を話す。</li>
            </ol>
            <p className="mt-5 rounded-2xl bg-white/70 p-4 text-xs leading-6 text-amber-900">
              注意: 結果はコミュニケーション補助です。採用、評価、昇進、処遇、臨床診断の判断には使わないでください。
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-stone-200 bg-white/80 p-4 shadow-lg shadow-stone-900/5 md:grid-cols-2">
        <ToggleButton
          active={mode === "solo"}
          title="ひとり診断"
          description="自分の上司/部下としての扱われ方を知る"
          onClick={() => {
            setMode("solo");
            setShowResult(false);
          }}
        />
        <ToggleButton
          active={mode === "pair"}
          title="ペア診断"
          description="上司と部下のズレを比較する"
          onClick={() => {
            setMode("pair");
            setShowResult(false);
          }}
        />
      </section>

      {!showResult ? (
        <section className="rounded-[2rem] border border-stone-200 bg-white/90 p-5 shadow-xl shadow-stone-900/5 md:p-8">
          <div className="flex flex-col gap-4 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
                {mode === "pair" ? `ペア診断: ${roleLabel(activePairRole)}の回答` : "ひとり診断"}
              </p>
              <h2 className="text-2xl font-black text-stone-950">
                {roleLabel(activeRole)}視点で回答してください
              </h2>
              <p className="text-sm text-stone-600">
                1は「そう思わない」、5は「そう思う」。正解はありません。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {mode === "solo" ? (
                <RoleSwitch role={soloRole} setRole={setSoloRole} />
              ) : (
                <RoleSwitch role={activePairRole} setRole={setActivePairRole} disabled />
              )}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm font-medium text-stone-600">
              <span>回答進捗</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-stone-100">
              <div className="h-full rounded-full bg-stone-950 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            {QUESTIONS.map((question, index) => (
              <div key={question.id} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-stone-500">
                        Q{index + 1}
                      </span>
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                        {getAxis(question.axis).name}
                      </span>
                    </div>
                    <p className="text-base font-semibold leading-7 text-stone-950">{question.text}</p>
                  </div>
                  <div className="grid grid-cols-5 gap-1 sm:min-w-[28rem]">
                    {LIKERT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setAnswer(question.id, option.value)}
                        className={`rounded-xl border px-2 py-3 text-xs font-bold transition hover:-translate-y-0.5 hover:shadow-sm ${
                          answers[question.id] === option.value
                            ? "border-stone-950 bg-stone-950 text-white"
                            : "border-stone-200 bg-white text-stone-700"
                        }`}
                        aria-pressed={answers[question.id] === option.value}
                      >
                        <span className="block text-lg">{option.value}</span>
                        <span className="hidden sm:block">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={reset}
              className="rounded-2xl border border-stone-300 bg-white px-5 py-3 font-bold text-stone-700"
            >
              リセット
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!complete}
              className="rounded-2xl bg-stone-950 px-6 py-3 font-bold text-white shadow-lg shadow-stone-950/20 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
            >
              {mode === "pair" && activePairRole === "manager" ? "部下の回答へ進む" : "結果を見る"}
            </button>
          </div>
        </section>
      ) : mode === "solo" && soloResult ? (
        <ResultView
          result={soloResult}
          role={soloRole}
          copied={copied}
          onCopy={async () => {
            const text = `${buildShareText(soloResult, soloRole)}\n${shareUrl}`;
            await navigator.clipboard.writeText(text);
            setCopied(true);
          }}
          onReset={reset}
        />
      ) : managerResult && memberResult ? (
        <PairResultView
          managerResult={managerResult}
          memberResult={memberResult}
          insights={pairInsights}
          copied={copied}
          onCopy={async () => {
            const text = `上司は${managerResult.character.name}型、部下は${memberResult.character.name}型。関係改善テーマは${pairInsights
              .slice(0, 2)
              .map((insight) => getAxis(insight.axis).shortName)
              .join("・")} #偉人マネジメント診断\n${shareUrl}`;
            await navigator.clipboard.writeText(text);
            setCopied(true);
          }}
          onReset={reset}
          shareUrl={shareUrl}
        />
      ) : null}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <p className="text-xs font-bold text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-stone-950">{value}</p>
    </div>
  );
}

function ToggleButton({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        active ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 bg-white text-stone-950"
      }`}
    >
      <span className="text-lg font-black">{title}</span>
      <span className={`mt-1 block text-sm ${active ? "text-stone-200" : "text-stone-600"}`}>{description}</span>
    </button>
  );
}

function RoleSwitch({
  role,
  setRole,
  disabled = false,
}: {
  role: Role;
  setRole: (role: Role) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex rounded-2xl border border-stone-200 bg-stone-50 p-1">
      {(["manager", "member"] as Role[]).map((item) => (
        <button
          key={item}
          type="button"
          disabled={disabled}
          onClick={() => setRole(item)}
          className={`rounded-xl px-4 py-2 text-sm font-bold ${role === item ? "bg-white text-stone-950 shadow" : "text-stone-500"} ${
            disabled ? "cursor-not-allowed" : ""
          }`}
        >
          {roleLabel(item)}
        </button>
      ))}
    </div>
  );
}

function ResultView({
  result,
  role,
  copied,
  onCopy,
  onReset,
  shareUrl,
}: {
  result: ReturnType<typeof scoreAnswers>;
  role: Role;
  copied: boolean;
  onCopy: () => void;
  onReset: () => void;
  shareUrl: string;
}) {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5 md:p-8">
        <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr]">
          <CharacterCard result={result} role={role} />
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">診断結果</p>
            <h2 className="text-3xl font-black text-stone-950">
              {roleLabel(role)}としてのあなたは、{result.character.name}型
            </h2>
            <p className="text-base leading-8 text-stone-700">{result.character.description}</p>
            <div className="rounded-2xl bg-stone-50 p-4 text-sm leading-7 text-stone-700">{result.caution}</div>
            {shareUrl && <p className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-900">共有URL: {shareUrl}</p>}
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={onCopy} className="rounded-2xl bg-stone-950 px-5 py-3 font-bold text-white">
                {copied ? "コピー済み" : "シェア文をコピー"}
              </button>
              <button type="button" onClick={onReset} className="rounded-2xl border border-stone-300 bg-white px-5 py-3 font-bold text-stone-700">
                もう一度診断
              </button>
            </div>
          </div>
        </div>
      </div>
      <AxisScoreGrid result={result} role={role} />
    </section>
  );
}

function PairResultView({
  managerResult,
  memberResult,
  insights,
  copied,
  onCopy,
  onReset,
}: {
  managerResult: ReturnType<typeof scoreAnswers>;
  memberResult: ReturnType<typeof scoreAnswers>;
  insights: ReturnType<typeof analyzePair>;
  copied: boolean;
  onCopy: () => void;
  onReset: () => void;
}) {
  const promises = buildPairPromises(insights);
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">ペア診断結果</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">上司と部下のズレを会話に変える</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-700">
              結果は良し悪しではなく、期待値の差分です。摩擦が強い軸から、連絡頻度・任せ方・指摘の伝え方を合意してください。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onCopy} className="rounded-2xl bg-stone-950 px-5 py-3 font-bold text-white">
              {copied ? "コピー済み" : "ペア結果をコピー"}
            </button>
            <button type="button" onClick={onReset} className="rounded-2xl border border-stone-300 bg-white px-5 py-3 font-bold text-stone-700">
              もう一度診断
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CharacterCard result={managerResult} role="manager" />
        <CharacterCard result={memberResult} role="member" />
      </div>

      <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 shadow-xl shadow-amber-900/10 md:p-8">
        <h3 className="text-2xl font-black text-amber-950">今日から変える3つの約束</h3>
        <ul className="mt-4 space-y-3">
          {promises.map((promise) => (
            <li key={promise} className="rounded-2xl bg-white/80 p-4 text-sm font-bold leading-7 text-amber-900">
              {promise}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5 md:p-8">
        <h3 className="text-2xl font-black text-stone-950">関係改善の優先テーマ</h3>
        <div className="mt-5 grid gap-4">
          {insights.slice(0, 6).map((insight) => (
            <div key={insight.axis} className={`rounded-2xl border p-5 ${severityClass(insight.severity)}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black">{getAxis(insight.axis).name}</span>
                <span className="text-sm font-black">{insight.title}</span>
              </div>
              <p className="mt-3 text-sm leading-7">{insight.message}</p>
              <p className="mt-3 rounded-xl bg-white/70 p-3 text-sm font-bold leading-7">会話例: {insight.talkScript}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-2xl bg-stone-50 p-4 text-sm leading-7 text-stone-700">
          {managerResult.caution}
        </p>
      </div>
    </section>
  );
}

function CharacterCard({ result, role }: { result: ReturnType<typeof scoreAnswers>; role: Role }) {
  return (
    <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-lg shadow-stone-900/5">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">{roleLabel(role)}タイプ</span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-stone-700">一致度 {result.affinity}%</span>
      </div>
      {result.character.imageSrc ? (
        <img src={result.character.imageSrc} alt={`${result.character.name}イメージ`} className="mt-6 h-48 w-full rounded-3xl object-cover" />
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-amber-300 bg-white/70 p-6 text-center">
          <p className="text-xs font-bold text-stone-500">画像プレースホルダー</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">後からキャラクター絵を追加</p>
        </div>
      )}
      <h3 className="mt-5 text-3xl font-black text-stone-950">{result.character.name}</h3>
      <p className="mt-1 text-sm font-bold text-amber-800">
        {result.character.region}・{result.character.era}
      </p>
      <p className="mt-3 text-xl font-black text-stone-800">{result.character.archetype}</p>
      <p className="mt-3 text-sm leading-7 text-stone-700">「{result.character.catchphrase}」</p>
    </div>
  );
}

function AxisScoreGrid({ result, role }: { result: ReturnType<typeof scoreAnswers>; role: Role }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {AXES.map((axis) => {
        const level = result.levels[axis.id];
        const feedback = getFeedback(axis.id, level);
        return (
          <div key={axis.id} className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-lg shadow-stone-900/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-stone-950">{axis.name}</p>
                <p className="mt-1 text-xs text-stone-500">{axis.sourceModel}</p>
              </div>
              <span className="rounded-full bg-stone-950 px-3 py-1 text-sm font-black text-white">Lv.{level}</span>
            </div>
            <div className="mt-4 h-3 rounded-full bg-stone-100">
              <div className="h-full rounded-full bg-amber-600" style={{ width: `${(result.scores[axis.id] / 5) * 100}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-stone-500">
              <span>{axis.lowLabel}</span>
              <span>{axis.highLabel}</span>
            </div>
            <h4 className="mt-5 text-lg font-black text-stone-950">{feedback.headline}</h4>
            <p className="mt-2 text-sm leading-7 text-stone-700">{feedback.message}</p>
            <div className="mt-4 rounded-2xl bg-stone-50 p-4 text-sm leading-7 text-stone-700">
              <span className="font-black text-stone-950">{roleLabel(role)}向け: </span>
              {role === "manager" ? feedback.managerTip : feedback.memberTip}
            </div>
          </div>
        );
      })}
    </div>
  );
}
