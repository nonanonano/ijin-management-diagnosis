export type Role = "manager" | "member";
export type Mode = "solo" | "pair";
export type Likert = 1 | 2 | 3 | 4 | 5;
export type Level = 1 | 2 | 3 | 4 | 5;

export type AxisId =
  | "dialogue"
  | "autonomy"
  | "change"
  | "feedback"
  | "stress"
  | "fairness";

export type AxisDefinition = {
  id: AxisId;
  name: string;
  shortName: string;
  sourceModel: string;
  description: string;
  lowLabel: string;
  highLabel: string;
};

export type Question = {
  id: string;
  axis: AxisId;
  text: string;
  reverse?: boolean;
};

export type AnswerMap = Record<string, Likert>;
export type AxisScores = Record<AxisId, number>;
export type AxisLevels = Record<AxisId, Level>;

export type FeedbackTemplate = {
  headline: string;
  message: string;
  managerTip: string;
  memberTip: string;
};

export type HistoricalCharacter = {
  id: string;
  name: string;
  region: "日本" | "世界";
  era: string;
  archetype: string;
  catchphrase: string;
  description: string;
  profile: AxisLevels;
  imageSrc?: string;
  imagePromptSeed: string;
};

export type DiagnosisResult = {
  scores: AxisScores;
  levels: AxisLevels;
  character: HistoricalCharacter;
  affinity: number;
  topAxes: AxisId[];
  caution: string;
};

export type PairInsight = {
  axis: AxisId;
  severity: "smooth" | "watch" | "friction";
  title: string;
  message: string;
  talkScript: string;
};

export const AXES: AxisDefinition[] = [
  {
    id: "dialogue",
    name: "対話密度",
    shortName: "対話",
    sourceModel: "Big Five: Extraversion",
    description: "相談・雑談・確認をどれくらい頻繁に行いたいか。",
    lowLabel: "静かに集中",
    highLabel: "こまめに対話",
  },
  {
    id: "autonomy",
    name: "裁量設計",
    shortName: "裁量",
    sourceModel: "Big Five: Conscientiousness / Openness",
    description: "細かい手順と自由な任せ方のどちらを好むか。",
    lowLabel: "手順重視",
    highLabel: "任せて伸ばす",
  },
  {
    id: "change",
    name: "変化志向",
    shortName: "変化",
    sourceModel: "Big Five: Openness",
    description: "新しいやり方や実験をどれくらい受け入れるか。",
    lowLabel: "安定運用",
    highLabel: "実験歓迎",
  },
  {
    id: "feedback",
    name: "フィードバック直球度",
    shortName: "FB",
    sourceModel: "Big Five: Agreeableness / communication style",
    description: "率直な指摘とクッションのある伝え方のバランス。",
    lowLabel: "配慮優先",
    highLabel: "率直優先",
  },
  {
    id: "stress",
    name: "ストレス可視化",
    shortName: "感情",
    sourceModel: "Big Five: Neuroticism reversed / Emotional Stability",
    description: "プレッシャー下で状態を言語化し、落ち着いて調整できるか。",
    lowLabel: "抱え込みやすい",
    highLabel: "早めに共有",
  },
  {
    id: "fairness",
    name: "公平・謙虚さ",
    shortName: "公平",
    sourceModel: "HEXACO: Honesty-Humility",
    description: "功績・責任・情報をフェアに扱うことへのこだわり。",
    lowLabel: "成果優先",
    highLabel: "信頼優先",
  },
];

export const QUESTIONS: Question[] = [
  { id: "q1", axis: "dialogue", text: "仕事の進め方は、途中で何度か相談しながら調整したい。" },
  { id: "q2", axis: "dialogue", text: "雑談や近況共有があるほうが、仕事の相談もしやすくなる。" },
  { id: "q3", axis: "dialogue", text: "会議や1on1では、自分から話題を出すことが多い。" },
  { id: "q4", axis: "dialogue", text: "必要なことだけ短く共有できれば十分だ。", reverse: true },

  { id: "q5", axis: "autonomy", text: "目的と期限が明確なら、やり方は任せたほうが成果が出やすい。" },
  { id: "q6", axis: "autonomy", text: "細かい手順よりも、現場で判断できる余白がほしい。" },
  { id: "q7", axis: "autonomy", text: "相手に任せるときは、途中のやり方まで細かく決めすぎない。" },
  { id: "q8", axis: "autonomy", text: "作業手順が曖昧なまま始めるのは不安だ。", reverse: true },

  { id: "q9", axis: "change", text: "今のやり方に問題がなくても、より良いやり方を試したくなる。" },
  { id: "q10", axis: "change", text: "新しいツールや仕組みを試すことに抵抗が少ない。" },
  { id: "q11", axis: "change", text: "前例がないテーマでも、まず小さく検証してみたい。" },
  { id: "q12", axis: "change", text: "やり方を変えるより、安定して同じ品質を出すことを優先したい。", reverse: true },

  { id: "q13", axis: "feedback", text: "改善点は、遠回しよりも早く率直に言ってもらうほうが助かる。" },
  { id: "q14", axis: "feedback", text: "相手の成長のためなら、言いにくいことも具体的に伝える。" },
  { id: "q15", axis: "feedback", text: "フィードバックでは、結論を先に出してから理由を話すことが多い。" },
  { id: "q16", axis: "feedback", text: "厳しい指摘は、かなり慎重に言葉を選ばないと関係が悪くなると思う。", reverse: true },

  { id: "q17", axis: "stress", text: "忙しいときほど、状況・懸念・助けてほしい点を早めに共有する。" },
  { id: "q18", axis: "stress", text: "プレッシャーが高い場面でも、感情と事実を分けて話せる。" },
  { id: "q19", axis: "stress", text: "困っていることを隠すより、早めに言ったほうがチームのためだと思う。" },
  { id: "q20", axis: "stress", text: "余裕がないときは、相談よりも一人で抱えてしまう。", reverse: true },

  { id: "q21", axis: "fairness", text: "成果が出たときは、関わった人の貢献を明確にしたい。" },
  { id: "q22", axis: "fairness", text: "情報や判断理由は、可能な範囲で透明に共有すべきだと思う。" },
  { id: "q23", axis: "fairness", text: "相手の立場が弱いときほど、不利益が偏らないように気を配る。" },
  { id: "q24", axis: "fairness", text: "結果が出るなら、多少の根回しや情報差は仕方ない。", reverse: true },
];

export const LEVEL_LABELS: Record<Level, string> = {
  1: "かなり低め",
  2: "やや低め",
  3: "中間",
  4: "やや高め",
  5: "かなり高め",
};

export const FEEDBACK: Record<AxisId, Record<Level, FeedbackTemplate>> = {
  dialogue: {
    1: {
      headline: "静かな集中を好む",
      message: "頻繁な確認より、まとまった作業時間を確保したい傾向です。連絡が少なくても無関心とは限りません。",
      managerTip: "部下には、確認タイミングを事前に決めてから任せると負荷が下がります。",
      memberTip: "上司には、毎日ではなくても進捗・詰まり・次の予定を定期的に見せると安心されます。",
    },
    2: {
      headline: "必要最小限の対話が合う",
      message: "相談は必要な場面に絞りたいタイプです。会話の量より、要点の明確さが関係改善に効きます。",
      managerTip: "1on1は短くてもよいので、論点を3つ程度に絞ると機能します。",
      memberTip: "相談前に「確認したいこと」を一文で出すと、会話がスムーズになります。",
    },
    3: {
      headline: "状況に応じて対話量を変える",
      message: "集中と対話のバランス型です。相手の好みに合わせて、報連相の密度を調整できます。",
      managerTip: "案件の不確実性が高いときだけ、確認頻度を上げる運用が向いています。",
      memberTip: "通常時と緊急時で、連絡頻度を切り替えるルールを合意すると安定します。",
    },
    4: {
      headline: "こまめな確認で前に進む",
      message: "短い対話を重ねることで、ズレを早めに直せるタイプです。沈黙が続くと不安や不信に見えやすいです。",
      managerTip: "部下には、短いチェックインを設けると心理的安全性が上がります。",
      memberTip: "上司には、進捗だけでなく迷っている選択肢も共有すると判断が速くなります。",
    },
    5: {
      headline: "対話で場を動かす",
      message: "会話を通じて状況を整理し、周囲を巻き込む力があります。一方で、静かに考えたい相手には圧が出る場合があります。",
      managerTip: "話す場と考える時間を分けると、内省型の部下も参加しやすくなります。",
      memberTip: "上司への相談は、結論・背景・選択肢の順で話すと会話量が価値に変わります。",
    },
  },
  autonomy: {
    1: {
      headline: "手順と基準があると力を出す",
      message: "自由度が高すぎる環境より、期待値・手順・完了条件が明確なほうが安定します。",
      managerTip: "任せる前に、完成イメージ・期限・判断基準を明文化してください。",
      memberTip: "曖昧な依頼には、着手前に成果物の例と優先順位を確認してください。",
    },
    2: {
      headline: "枠組みがあれば自走できる",
      message: "全面的な自由より、最低限の枠があると安心して進められます。",
      managerTip: "最初に道筋を示し、途中から裁量を広げると育成しやすいです。",
      memberTip: "最初の30分で疑問点を洗い出し、確認してから進むと手戻りが減ります。",
    },
    3: {
      headline: "任せ方を相手と案件で調整できる",
      message: "裁量と管理の中間型です。相手の経験値に合わせて、任せる範囲を調整できます。",
      managerTip: "重要度と経験値で、細かく見る案件と任せる案件を分けてください。",
      memberTip: "どこまで自分で判断してよいか、境界線を確認すると動きやすくなります。",
    },
    4: {
      headline: "目的を渡して任せるのが得意",
      message: "細かな指示より、目的と制約を共有して任せるほうが力を発揮します。",
      managerTip: "部下には、手順ではなく判断基準を渡すと成長機会になります。",
      memberTip: "上司には、自己判断した点とその理由をセットで共有すると信頼が増えます。",
    },
    5: {
      headline: "高い裁量で突破する",
      message: "自分で組み立てる余白が大きいほど動きやすいタイプです。一方で、細かい確認を求める相手には不安を与えやすいです。",
      managerTip: "任せる場合でも、リスクが高い節目だけレビューを置いてください。",
      memberTip: "自由に進めるほど、途中の判断ログを残すと上司の不安が下がります。",
    },
  },
  change: {
    1: {
      headline: "安定運用を守る",
      message: "新しさよりも、再現性と品質を重視します。変化が必要なときは理由と移行手順が重要です。",
      managerTip: "変更を求めるときは、背景・影響・移行期間を説明してください。",
      memberTip: "変化に抵抗があるときは、懸念をリスク一覧として出すと建設的です。",
    },
    2: {
      headline: "慎重に改善する",
      message: "一気に変えるより、小さく確かめながら改善するほうが合います。",
      managerTip: "新施策は試験運用から始めると、納得感が出やすくなります。",
      memberTip: "反対ではなく、条件付き賛成の形で代替案を出すと通りやすいです。",
    },
    3: {
      headline: "安定と実験のバランス型",
      message: "既存のやり方を尊重しつつ、必要な変化は受け入れられます。",
      managerTip: "変える部分と変えない部分を切り分けると、チームの安心感が保てます。",
      memberTip: "提案時は、現状維持案と改善案を並べると判断されやすくなります。",
    },
    4: {
      headline: "新しい打ち手を試す",
      message: "改善案や新ツールへの感度が高いタイプです。周囲には変化の理由を丁寧に伝える必要があります。",
      managerTip: "実験の目的・期限・撤退条件を決めると、保守型の部下も乗りやすいです。",
      memberTip: "上司には、試す価値と失敗時のリスクをセットで出してください。",
    },
    5: {
      headline: "変革で場を動かす",
      message: "前例がない状況で強みが出ます。一方で、安定を求める相手には急ぎすぎに見える場合があります。",
      managerTip: "変化を推すほど、チームには休ませる領域と守る基準を明示してください。",
      memberTip: "大きな提案は、小さな検証結果を添えると受け入れられやすくなります。",
    },
  },
  feedback: {
    1: {
      headline: "関係配慮を最優先する",
      message: "厳しい指摘より、相手の受け止めやすさを重視します。改善点が曖昧になりすぎない注意が必要です。",
      managerTip: "優しい表現でも、期待値・差分・次の行動は明確に伝えてください。",
      memberTip: "指摘がほしいときは、「率直に言ってください」と依頼すると情報量が増えます。",
    },
    2: {
      headline: "やわらかく伝える",
      message: "クッションのある伝え方が得意です。相手の防衛反応を下げやすい一方、緊急時は遅く見えることがあります。",
      managerTip: "ポジティブな意図と改善点を分けて話すと伝わります。",
      memberTip: "上司の遠回しな表現に対しては、具体的な期待値を聞き返してください。",
    },
    3: {
      headline: "率直さと配慮の中間型",
      message: "相手や場面に合わせて、ストレートさを調整できます。",
      managerTip: "相手ごとに、直接言うか事前に文面で渡すかを使い分けてください。",
      memberTip: "受け取りたいフィードバックの形式を上司に伝えると精度が上がります。",
    },
    4: {
      headline: "具体的に率直に伝える",
      message: "改善点を早く明確にしたいタイプです。相手によってはきつく聞こえる可能性があります。",
      managerTip: "指摘の前に目的を一言置くと、攻撃ではなく支援として受け取られやすいです。",
      memberTip: "上司に率直に言うときは、事実・影響・提案の順で話してください。",
    },
    5: {
      headline: "直球で成長を促す",
      message: "曖昧さを嫌い、課題をすぐ言語化できます。一方で、相手の心理的準備を飛ばしやすいです。",
      managerTip: "厳しい指摘ほど、次に期待している行動を具体化してください。",
      memberTip: "強い違和感を伝えるときは、相手の意図を確認してから提案に入ると摩擦が減ります。",
    },
  },
  stress: {
    1: {
      headline: "抱え込みやすい",
      message: "負荷が高いほど一人で処理しようとしやすいタイプです。周囲が気づく前に限界が近づく場合があります。",
      managerTip: "詰まりを責めず、早めの相談を評価するルールを作ってください。",
      memberTip: "困りごとは完成前に、事実・困っている点・必要な支援だけ先に共有してください。",
    },
    2: {
      headline: "不調の共有が遅れがち",
      message: "問題を自分で整理してから共有したい傾向です。早期共有の型があると楽になります。",
      managerTip: "1on1では、進捗だけでなく負荷と不安も定例項目にしてください。",
      memberTip: "相談が未整理でも、「まだ整理中ですが」と前置きして共有して構いません。",
    },
    3: {
      headline: "必要に応じて共有できる",
      message: "通常は落ち着いて対応できます。負荷が高い案件では、共有タイミングを先に決めると安定します。",
      managerTip: "山場の前に、相談先とエスカレーション基準を合意してください。",
      memberTip: "負荷が上がる前に、いつ相談するかを自分で決めておくと安全です。",
    },
    4: {
      headline: "早めに状態を言語化できる",
      message: "不安やリスクを早期に共有できるタイプです。問題の発見が早い一方、相手には心配が多く見える場合があります。",
      managerTip: "共有された不安を、優先順位と対応策に変換してください。",
      memberTip: "不安を出すときは、影響度と希望する支援をセットにすると前向きに受け取られます。",
    },
    5: {
      headline: "危機時にチームを落ち着かせる",
      message: "プレッシャー下でも状態を共有し、周囲を巻き込めます。余裕があるように見えて負荷が積まれる点には注意です。",
      managerTip: "頼れる人ほど過負荷になりやすいので、役割と休息を明確にしてください。",
      memberTip: "問題を整理できる強みを活かしつつ、自分の負荷も数値で共有してください。",
    },
  },
  fairness: {
    1: {
      headline: "成果を強く優先する",
      message: "結果への集中力があります。一方で、情報差や負担の偏りが関係不信につながる場合があります。",
      managerTip: "成果を求めるほど、判断理由と評価基準を明文化してください。",
      memberTip: "納得しにくい判断には、感情ではなく基準と情報の確認から入ってください。",
    },
    2: {
      headline: "合理性を優先しやすい",
      message: "スピードや成果を重視します。相手の貢献承認を後回しにしないことが重要です。",
      managerTip: "忙しいときほど、貢献者の名前と理由を一言で認めてください。",
      memberTip: "不公平感があるときは、どの情報が不足しているかを具体的に聞いてください。",
    },
    3: {
      headline: "成果と納得感のバランス型",
      message: "結果と公平性の両方を見られます。重要な判断では、透明性を少し増やすと信頼が高まります。",
      managerTip: "判断基準を先に共有すると、後からの説明コストが下がります。",
      memberTip: "自分の貢献を、事実ベースで見える化しておくと評価の会話がしやすくなります。",
    },
    4: {
      headline: "信頼と透明性を重視する",
      message: "判断理由や貢献の扱いに敏感です。フェアな運用があると関係が安定します。",
      managerTip: "誰が何を担い、どう評価するかを早めに共有してください。",
      memberTip: "透明性を求めるときは、相手を疑う言い方ではなく運用改善として提案してください。",
    },
    5: {
      headline: "公平性でチームを守る",
      message: "弱い立場の人や見えにくい貢献に目を向けられます。一方で、成果優先の相手とはスピード感で衝突することがあります。",
      managerTip: "公平性を守りつつ、意思決定が遅れない期限も設定してください。",
      memberTip: "不公平を指摘するときは、事実・影響・代替案をセットにしてください。",
    },
  },
};

export const CHARACTERS: HistoricalCharacter[] = [
  {
    id: "tokugawa-ieyasu",
    name: "徳川家康",
    region: "日本",
    era: "戦国〜江戸",
    archetype: "長期安定の統治者",
    catchphrase: "急がず、崩さず、勝ち筋を残す。",
    description: "安定運用、忍耐、仕組みづくりで関係を整えるタイプ。短期の派手さより、長期の信頼を重視します。",
    profile: { dialogue: 3, autonomy: 3, change: 2, feedback: 3, stress: 5, fairness: 4 },
    imagePromptSeed: "calm strategist, Edo period, warm parchment background",
  },
  {
    id: "oda-nobunaga",
    name: "織田信長",
    region: "日本",
    era: "戦国",
    archetype: "変革突破の指揮官",
    catchphrase: "前例がないなら、前例を作る。",
    description: "変化とスピードで局面を動かすタイプ。曖昧さを嫌い、強い意思決定でチームを前進させます。",
    profile: { dialogue: 4, autonomy: 5, change: 5, feedback: 5, stress: 4, fairness: 2 },
    imagePromptSeed: "bold reformer, Sengoku armor, dramatic lighting",
  },
  {
    id: "toyotomi-hideyoshi",
    name: "豊臣秀吉",
    region: "日本",
    era: "戦国〜安土桃山",
    archetype: "巻き込み上手な実行家",
    catchphrase: "人を動かし、場を温め、突破口を作る。",
    description: "対話と巻き込みで人を前に進めるタイプ。空気を読みながら実行に変える力があります。",
    profile: { dialogue: 5, autonomy: 4, change: 4, feedback: 4, stress: 4, fairness: 3 },
    imagePromptSeed: "charismatic facilitator, golden folding screen",
  },
  {
    id: "murasaki-shikibu",
    name: "紫式部",
    region: "日本",
    era: "平安",
    archetype: "観察洞察の編集者",
    catchphrase: "言葉の奥にある関係を読む。",
    description: "相手の感情や文脈を観察し、言葉の精度で関係を整えるタイプ。静かな分析に強みがあります。",
    profile: { dialogue: 2, autonomy: 4, change: 4, feedback: 2, stress: 3, fairness: 4 },
    imagePromptSeed: "Heian writer, ink, refined quiet atmosphere",
  },
  {
    id: "shibusawa-eiichi",
    name: "渋沢栄一",
    region: "日本",
    era: "幕末〜近代",
    archetype: "信頼を設計する調整者",
    catchphrase: "成果と倫理を同じ卓上に置く。",
    description: "公平性と実行の両立を重視するタイプ。複数の利害を束ね、納得感のある合意形成を目指します。",
    profile: { dialogue: 4, autonomy: 4, change: 4, feedback: 3, stress: 4, fairness: 5 },
    imagePromptSeed: "modern Japanese industrialist, ethical leadership",
  },
  {
    id: "himiko",
    name: "卑弥呼",
    region: "日本",
    era: "弥生〜古墳期",
    archetype: "象徴でまとめる媒介者",
    catchphrase: "見えない不安を、場の秩序に変える。",
    description: "言葉以外の空気や信頼形成に敏感なタイプ。対立を直接押さえ込むより、場の納得感を作ります。",
    profile: { dialogue: 4, autonomy: 2, change: 3, feedback: 2, stress: 4, fairness: 4 },
    imagePromptSeed: "ancient Japanese queen, ceremonial, mysterious calm",
  },
  {
    id: "julius-caesar",
    name: "ユリウス・カエサル",
    region: "世界",
    era: "古代ローマ",
    archetype: "戦略突破のリーダー",
    catchphrase: "局面を読み、先に橋を架ける。",
    description: "判断、発信、突破力で複雑な状況を動かすタイプ。高い裁量とスピードがある環境で強みが出ます。",
    profile: { dialogue: 5, autonomy: 5, change: 5, feedback: 4, stress: 4, fairness: 2 },
    imagePromptSeed: "Roman strategist, laurel, marble, decisive expression",
  },
  {
    id: "cleopatra",
    name: "クレオパトラ",
    region: "世界",
    era: "古代エジプト",
    archetype: "交渉と演出の外交家",
    catchphrase: "相手の欲しい未来を読み、言葉で場を動かす。",
    description: "対話、演出、交渉で関係を動かすタイプ。相手に合わせた伝え方を設計できます。",
    profile: { dialogue: 5, autonomy: 4, change: 4, feedback: 3, stress: 4, fairness: 3 },
    imagePromptSeed: "Egyptian queen, diplomatic, elegant, gold and lapis",
  },
  {
    id: "leonardo-da-vinci",
    name: "レオナルド・ダ・ヴィンチ",
    region: "世界",
    era: "ルネサンス",
    archetype: "発想を広げる探究者",
    catchphrase: "なぜ、を重ねて可能性を描く。",
    description: "好奇心と観察から新しい見方を出すタイプ。自由度が高いテーマで独自の価値を出します。",
    profile: { dialogue: 3, autonomy: 5, change: 5, feedback: 3, stress: 3, fairness: 3 },
    imagePromptSeed: "Renaissance polymath, sketches, inventions, warm studio",
  },
  {
    id: "marie-curie",
    name: "マリー・キュリー",
    region: "世界",
    era: "近代",
    archetype: "静かな実証の研究者",
    catchphrase: "熱量は静かに、精度は高く。",
    description: "集中、検証、粘り強さで成果を積み上げるタイプ。派手な対話よりも、事実と努力で信頼を作ります。",
    profile: { dialogue: 2, autonomy: 4, change: 4, feedback: 3, stress: 4, fairness: 4 },
    imagePromptSeed: "scientist, laboratory, quiet determination, early modern",
  },
  {
    id: "confucius",
    name: "孔子",
    region: "世界",
    era: "春秋時代",
    archetype: "原則で育てる師",
    catchphrase: "人を責めず、型を整える。",
    description: "秩序、学び、礼節を通じて関係を育てるタイプ。安定した基準を置くことでチームを整えます。",
    profile: { dialogue: 4, autonomy: 2, change: 2, feedback: 2, stress: 4, fairness: 5 },
    imagePromptSeed: "ancient Chinese teacher, scrolls, serene, moral guidance",
  },
  {
    id: "nelson-mandela",
    name: "ネルソン・マンデラ",
    region: "世界",
    era: "20世紀",
    archetype: "包容と和解の調停者",
    catchphrase: "対立を、次に進む合意へ変える。",
    description: "公平性、忍耐、対話で難しい関係をほどくタイプ。短期勝利より、長期の信頼回復を重視します。",
    profile: { dialogue: 4, autonomy: 3, change: 3, feedback: 2, stress: 5, fairness: 5 },
    imagePromptSeed: "reconciliatory leader, dignified, warm light, modern history",
  },
];

export const CAUTION = "この結果は、上司・部下の会話を円滑にするための自己理解ツールです。採用、評価、昇進、処遇、臨床診断の判断には使用しないでください。";

const AXIS_IDS = AXES.map((axis) => axis.id);

function toLevel(score: number): Level {
  if (score < 1.8) return 1;
  if (score < 2.6) return 2;
  if (score < 3.4) return 3;
  if (score < 4.2) return 4;
  return 5;
}

function normalizeAnswer(question: Question, value: Likert): number {
  return question.reverse ? 6 - value : value;
}

function emptyScores(): Record<AxisId, number[]> {
  return {
    dialogue: [],
    autonomy: [],
    change: [],
    feedback: [],
    stress: [],
    fairness: [],
  };
}

function average(values: number[]): number {
  if (values.length === 0) return 3;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function distance(a: AxisLevels, b: AxisLevels): number {
  return Math.sqrt(
    AXIS_IDS.reduce((sum, axis) => {
      const diff = a[axis] - b[axis];
      return sum + diff * diff;
    }, 0),
  );
}

export function scoreAnswers(answers: AnswerMap): DiagnosisResult {
  const grouped = emptyScores();

  for (const question of QUESTIONS) {
    const rawValue = answers[question.id];
    if (!rawValue) continue;
    grouped[question.axis].push(normalizeAnswer(question, rawValue));
  }

  const scores = AXIS_IDS.reduce((acc, axis) => {
    acc[axis] = Number(average(grouped[axis]).toFixed(2));
    return acc;
  }, {} as AxisScores);

  const levels = AXIS_IDS.reduce((acc, axis) => {
    acc[axis] = toLevel(scores[axis]);
    return acc;
  }, {} as AxisLevels);

  const rankedCharacters = CHARACTERS.map((character) => {
    const d = distance(levels, character.profile);
    const maxDistance = Math.sqrt(AXIS_IDS.length * 16);
    return {
      character,
      distance: d,
      affinity: Math.max(0, Math.round(100 - (d / maxDistance) * 100)),
    };
  }).sort((a, b) => a.distance - b.distance);

  const topAxes = [...AXIS_IDS].sort((a, b) => scores[b] - scores[a]).slice(0, 2);

  return {
    scores,
    levels,
    character: rankedCharacters[0].character,
    affinity: rankedCharacters[0].affinity,
    topAxes,
    caution: CAUTION,
  };
}

export function getAxis(axisId: AxisId): AxisDefinition {
  return AXES.find((axis) => axis.id === axisId)!;
}

export function getFeedback(axisId: AxisId, level: Level): FeedbackTemplate {
  return FEEDBACK[axisId][level];
}

export function isComplete(answers: AnswerMap): boolean {
  return QUESTIONS.every((question) => Boolean(answers[question.id]));
}

export function completionRate(answers: AnswerMap): number {
  const answered = QUESTIONS.filter((question) => Boolean(answers[question.id])).length;
  return Math.round((answered / QUESTIONS.length) * 100);
}

export function buildShareText(result: DiagnosisResult, role: Role): string {
  const roleLabel = role === "manager" ? "上司" : "部下";
  return `私は${result.character.name}型の${roleLabel}でした。${result.character.archetype}｜相性キーワード: ${result.topAxes.map((axis) => getAxis(axis).shortName).join("・")} #偉人マネジメント診断`;
}

function pairMessage(axis: AxisId, managerLevel: Level, memberLevel: Level): PairInsight {
  const diff = Math.abs(managerLevel - memberLevel);
  const axisName = getAxis(axis).name;

  if (diff <= 1) {
    return {
      axis,
      severity: "smooth",
      title: `${axisName}は近い`,
      message: "大きなズレは出にくい領域です。暗黙のまま進めず、今のやり方が合っているかだけ確認してください。",
      talkScript: "「この進め方は今のところやりやすいですか？変えるならどこですか？」",
    };
  }

  const managerHigher = managerLevel > memberLevel;
  const severity: PairInsight["severity"] = diff >= 3 ? "friction" : "watch";

  const messages: Record<AxisId, { highManager: string; highMember: string; script: string }> = {
    dialogue: {
      highManager: "上司はこまめな対話を求め、部下は集中時間を重視しやすい組み合わせです。上司の確認が、部下には監視に見える可能性があります。",
      highMember: "部下は相談量を求め、上司は要点共有を好みやすい組み合わせです。部下の不安が、上司には過剰確認に見える可能性があります。",
      script: "「通常時は週何回、緊急時はどの条件で相談するかを決めましょう。」",
    },
    autonomy: {
      highManager: "上司は大きく任せたい一方、部下は手順や基準を求めやすい組み合わせです。放任と受け取られる可能性があります。",
      highMember: "部下は裁量を求め、上司は手順管理を重視しやすい組み合わせです。細かい確認がマイクロマネジメントに見える可能性があります。",
      script: "「どこまで自分で判断してよいか、レビューする節目だけ決めましょう。」",
    },
    change: {
      highManager: "上司は変化を推し、部下は安定運用を守りたい組み合わせです。変更理由と撤退条件がないと不安が増えます。",
      highMember: "部下は改善提案を出したい一方、上司は安定を重視しやすい組み合わせです。提案は小さな検証として出すと通りやすいです。",
      script: "「今回変える部分、変えない部分、失敗したら戻す条件を決めましょう。」",
    },
    feedback: {
      highManager: "上司は率直な指摘をしやすく、部下は配慮ある伝え方を求めやすい組み合わせです。指摘の目的を先に置く必要があります。",
      highMember: "部下は率直な指摘や意見を出しやすく、上司は関係配慮を重視しやすい組み合わせです。言い方の温度差に注意してください。",
      script: "「指摘は結論からでよいか、背景からのほうがよいかを先に決めましょう。」",
    },
    stress: {
      highManager: "上司は早期共有を求め、部下は抱え込みやすい組み合わせです。相談の遅れが信頼低下に見える可能性があります。",
      highMember: "部下は早めに不安を共有し、上司は整理後の報告を求めやすい組み合わせです。不安共有を問題発生と誤解しない工夫が必要です。",
      script: "「まだ未整理の相談をしてよいタイミングと、必要な情報量を決めましょう。」",
    },
    fairness: {
      highManager: "上司は透明性を重視し、部下は成果スピードを重視しやすい組み合わせです。説明過多と感じられる場合があります。",
      highMember: "部下は公平性や納得感に敏感で、上司は成果スピードを重視しやすい組み合わせです。判断理由の不足が不信につながります。",
      script: "「判断基準、貢献の扱い、共有できない情報の範囲を確認しましょう。」",
    },
  };

  return {
    axis,
    severity,
    title: `${axisName}にズレがある`,
    message: managerHigher ? messages[axis].highManager : messages[axis].highMember,
    talkScript: messages[axis].script,
  };
}

export function analyzePair(manager: DiagnosisResult, member: DiagnosisResult): PairInsight[] {
  return AXIS_IDS.map((axis) => pairMessage(axis, manager.levels[axis], member.levels[axis])).sort((a, b) => {
    const order = { friction: 0, watch: 1, smooth: 2 } as const;
    return order[a.severity] - order[b.severity];
  });
}

export function buildPairPromises(insights: PairInsight[]): string[] {
  const top = insights.filter((insight) => insight.severity !== "smooth").slice(0, 3);
  const seeds = top.length > 0 ? top : insights.slice(0, 3);
  return seeds.map((insight) => {
    const axis = getAxis(insight.axis);
    return `「${axis.shortName}」で${insight.talkScript.replace(/^「|」$/g, "")}`;
  });
}
