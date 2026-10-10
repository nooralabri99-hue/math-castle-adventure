import test from "node:test";
import assert from "node:assert/strict";
import { challenges, isCorrect, arabic, doors } from "../src/math.js";
test("خمسة أبواب ولكل تحدٍ إجابة صحيحة واحدة", () => {
  assert.equal(doors.length, 5);
  assert.equal(challenges.length, 5);
  for (const challenge of challenges) {
    assert.ok(challenge.number >= 10 && challenge.number <= 999);
    assert.ok([10, 100].includes(challenge.multiplier));
    assert.equal(new Set(challenge.choices).size, 3);
    assert.equal(
      challenge.choices.filter((answer) => isCorrect(challenge, answer)).length,
      1,
    );
  }
});
test("الضرب والمحاولات الخاطئة والأرقام العربية", () => {
  assert.equal(isCorrect(challenges[0], 240), true);
  assert.equal(isCorrect(challenges[0], 2400), false);
  assert.equal(arabic(50), "٥٠");
  assert.equal(challenges.filter((c) => c.multiplier === 100).length, 2);
});
