export interface BinomialPoint {
  k: number
  probability: number
}

/** log(n!) for every n from 0..max, built once with a running sum — n! itself
 *  overflows double precision well before n = 170, but its logarithm stays small and
 *  well-behaved even for n in the thousands, so every combinatorial count below is
 *  computed in log-space and only exponentiated at the very end. */
function logFactorialTable(max: number): number[] {
  const table = Array.from<number>({ length: max + 1 })
  table[0] = 0
  for (let i = 1; i <= max; i++) table[i] = table[i - 1] + Math.log(i)
  return table
}

/**
 * The exact probability mass function of X ~ Binomial(n, p) — "in n independent
 * repeats of a Bernoulli(p) trial, the probability that exactly k succeed" — for
 * every k from 0 to n. This is precisely what repeating the current experiment n
 * times and counting how often event A occurs amounts to, since each trial is drawn
 * independently with P(A) = p.
 */
export function binomialPmf(n: number, p: number): BinomialPoint[] {
  if (n <= 0) return []
  const clampedP = Math.min(Math.max(p, 0), 1)
  if (clampedP === 0) return [{ k: 0, probability: 1 }]
  if (clampedP === 1) return [{ k: n, probability: 1 }]

  const logFact = logFactorialTable(n)
  const logP = Math.log(clampedP)
  const logQ = Math.log(1 - clampedP)
  const points: BinomialPoint[] = []
  for (let k = 0; k <= n; k++) {
    const logProbability = logFact[n] - logFact[k] - logFact[n - k] + k * logP + (n - k) * logQ
    points.push({ k, probability: Math.exp(logProbability) })
  }
  return points
}

export function binomialMeanSd(n: number, p: number): { mean: number; sd: number } {
  return { mean: n * p, sd: Math.sqrt(n * p * (1 - p)) }
}

/** The normal density with the same mean/sd as the binomial above — the
 *  De Moivre–Laplace / central limit theorem approximation that the binomial's
 *  shape converges to as n grows. Evaluated at integer k, this lines up directly
 *  against binomialPmf(n, p)'s points since a PMF spaced 1 apart is already on the
 *  same vertical scale as a density. */
export function normalPdf(x: number, mean: number, sd: number): number {
  if (sd <= 0) return x === mean ? Infinity : 0
  const z = (x - mean) / sd
  return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI))
}
