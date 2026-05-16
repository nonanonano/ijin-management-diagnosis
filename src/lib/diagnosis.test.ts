import assert from "node:assert/strict";
import test from "node:test";
import { analyzePair, buildPairPromises, isComplete, QUESTIONS, scoreAnswers, type AnswerMap } from "@/lib/diagnosis";

function answered(value: 1 | 2 | 3 | 4 | 5): AnswerMap {
  return QUESTIONS.reduce((acc, question) => {
    acc[question.id] = value;
    return acc;
  }, {} as AnswerMap);
}

test("全回答で診断結果を返す", () => {
  const result = scoreAnswers(answered(5));
  assert.equal(result.topAxes.length, 2);
  assert.ok(result.affinity >= 0);
  assert.ok(result.affinity <= 100);
});

test("未回答があるとcomplete false", () => {
  assert.equal(isComplete({}), false);
  assert.equal(isComplete(answered(3)), true);
});

test("ペア約束を3件作る", () => {
  const manager = scoreAnswers(answered(5));
  const member = scoreAnswers(answered(1));
  const insights = analyzePair(manager, member);
  assert.equal(buildPairPromises(insights).length, 3);
});
