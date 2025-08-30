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

export function pickPrize(level) {
  const available = PRIZES.filter((p) => level >= p.minLevel);
  const total = available.reduce((sum, p) => sum + p.probability, 0);
  let r = Math.random() * total;
  for (const p of available) {
    if (r < p.probability) {
      return p;
    }
    r -= p.probability;
  }
  return available[0];
}
