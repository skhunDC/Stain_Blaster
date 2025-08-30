export const PRIZES = [
  { tier: "Common", probability: 0.6, reward: null, minLevel: 1 },
  {
    tier: "Uncommon",
    probability: 0.25,
    reward: "$5 cleaning credit",
    minLevel: 1,
  },
  {
    tier: "Rare",
    probability: 0.12,
    reward: "$10 cleaning credit",
    minLevel: 2,
  },
  {
    tier: "Epic",
    probability: 0.03,
    reward: "$50 premium garment credit",
    minLevel: 3,
  },
];

// Picks a prize based on the configured probabilities while ensuring
// players never receive locked tiers. Probability mass from locked
// tiers falls back to the first available tier ("Common"), keeping the
// advertised odds for the remaining prizes consistent across levels.
export function pickPrize(level) {
  const fallback = PRIZES.find((p) => level >= p.minLevel);
  if (!fallback) return PRIZES[0];
  const r = Math.random();
  let cumulative = 0;
  for (const p of PRIZES) {
    cumulative += p.probability;
    if (r < cumulative) {
      return level >= p.minLevel ? p : fallback;
    }
  }
  return fallback;
}
