import test from "node:test";
import assert from "node:assert/strict";
import { PRIZES, pickPrize } from "./prize.js";

function expected(level) {
  const fallback = PRIZES.find((p) => level >= p.minLevel);
  const result = {};
  for (const p of PRIZES) {
    result[p.tier] = 0;
  }
  for (const p of PRIZES) {
    if (level >= p.minLevel) {
      result[p.tier] += p.probability;
    } else {
      result[fallback.tier] += p.probability;
    }
  }
  return result;
}

function simulate(level, iterations) {
  const counts = {};
  for (const p of PRIZES) {
    counts[p.tier] = 0;
  }
  for (let i = 0; i < iterations; i++) {
    const prize = pickPrize(level);
    counts[prize.tier]++;
  }
  return counts;
}

test("pickPrize returns only allowed prizes", () => {
  for (let level = 1; level <= 3; level++) {
    for (let i = 0; i < 100; i++) {
      const prize = pickPrize(level);
      assert.ok(level >= prize.minLevel);
    }
  }
});

test("pickPrize distribution is fair", () => {
  const ITER = 100000;
  const tolerance = 0.01; // 1%
  for (const level of [1, 2, 3]) {
    const counts = simulate(level, ITER);
    const exp = expected(level);
    for (const [tier, prob] of Object.entries(exp)) {
      const observed = counts[tier] / ITER;
      assert.ok(
        Math.abs(observed - prob) < tolerance,
        `Level ${level} ${tier}`,
      );
    }
  }
});
