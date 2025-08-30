import test from "node:test";
import assert from "node:assert/strict";
import { PRIZES, pickPrize } from "./prize.js";

function expected(level) {
  const available = PRIZES.filter((p) => level >= p.minLevel);
  const total = available.reduce((sum, p) => sum + p.probability, 0);
  const result = {};
  for (const p of available) {
    result[p.tier] = p.probability / total;
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
  const tolerance = 0.02; // 2%
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
