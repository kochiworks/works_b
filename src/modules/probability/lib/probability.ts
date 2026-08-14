import type { EventOption, Outcome } from './types'

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

export interface ProbabilityBreakdown {
  favorable: number
  total: number
  /** favorable/total reduced to lowest terms, for the textbook-style fraction display. */
  simplified: { num: number; den: number }
  decimal: number
  percent: string
}

/** The classical (이론적) probability of an event: favorable outcomes over the whole
 *  sample space, assuming every outcome is equally likely — which is true by
 *  construction here (every coin sequence, dice pair, or individual ball is its own
 *  sample-space element). */
export function computeProbability(sampleSpace: Outcome[], event: EventOption): ProbabilityBreakdown {
  const favorable = sampleSpace.filter(event.matches).length
  const total = sampleSpace.length
  const divisor = gcd(favorable, total) || 1
  const decimal = total > 0 ? favorable / total : 0
  return {
    favorable,
    total,
    simplified: { num: favorable / divisor, den: total / divisor },
    decimal,
    percent: (decimal * 100).toFixed(1),
  }
}

/** One simulated trial: pick uniformly at random from the sample space — equivalent
 *  to actually tossing the coins / rolling the dice / drawing a ball. */
export function randomOutcome(sampleSpace: Outcome[]): Outcome | null {
  if (sampleSpace.length === 0) return null
  const index = Math.floor(Math.random() * sampleSpace.length)
  return sampleSpace[index]
}

/** Empty sample space (e.g. every ball group set to 0) simply yields no trials rather
 *  than throwing — the UI shows a "nothing to draw from" hint in that case instead. */
export function runTrials(sampleSpace: Outcome[], count: number): Outcome[] {
  if (sampleSpace.length === 0) return []
  return Array.from({ length: count }, () => randomOutcome(sampleSpace)).filter((o): o is Outcome => o !== null)
}

/** The running relative frequency of `event` after each trial — trials[i] is trial
 *  i+1, and series[i] is (successes among trials 1..i+1) / (i+1). This is the curve
 *  that's expected to settle near the theoretical probability as trials pile up
 *  (큰 수의 법칙 / the law of large numbers). */
export function relativeFrequencySeries(trials: Outcome[], event: EventOption): number[] {
  let hits = 0
  return trials.map((trial, i) => {
    if (event.matches(trial)) hits++
    return hits / (i + 1)
  })
}
