import type { Mode } from './types'

/** n! — safe for the small n this app allows (n ≤ 20 or so). */
export function factorial(n: number): number {
  if (n < 0) return 0
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

/** nPr = n! / (n-r)! — permutations of r out of n distinct items. */
export function nPr(n: number, r: number): number {
  if (r < 0 || r > n) return 0
  let result = 1
  for (let i = 0; i < r; i++) result *= n - i
  return result
}

/** nCr = n! / (r!(n-r)!) — combinations of r out of n distinct items. */
export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0
  const rr = Math.min(r, n - r)
  let result = 1
  for (let i = 0; i < rr; i++) {
    result = (result * (n - i)) / (i + 1)
  }
  return Math.round(result)
}

/** n^r — permutations with repetition allowed. */
export function nPrRepetition(n: number, r: number): number {
  if (n <= 0) return r === 0 ? 1 : 0
  return Math.pow(n, r)
}

/** (n+r-1)Cr — combinations with repetition allowed. */
export function nCrRepetition(n: number, r: number): number {
  if (n <= 0) return r === 0 ? 1 : 0
  return nCr(n + r - 1, r)
}

/** Total case count for the given mode, ignoring any include/exclude/group options. */
export function countForMode(mode: Mode, n: number, r: number): number {
  switch (mode) {
    case 'permutation':
      return nPr(n, r)
    case 'combination':
      return nCr(n, r)
    case 'permutationWithRepetition':
      return nPrRepetition(n, r)
    case 'combinationWithRepetition':
      return nCrRepetition(n, r)
  }
}

export interface FormulaBreakdown {
  /** The textbook symbol used between the sub/superscript n and r, e.g. "P", "C", "Π", "H". */
  symbol: string
  n: number
  r: number
  /** The arithmetic behind the notation, e.g. "5 × 4 × 3" or "(7 × 6 × 5) ÷ (3 × 2 × 1)". */
  expression: string
  value: number
}

/** Textbook notation + the step-by-step arithmetic for the given mode, for classroom display. */
export function formulaBreakdown(mode: Mode, n: number, r: number): FormulaBreakdown {
  const descendingProduct = (from: number, count: number) =>
    Array.from({ length: Math.max(count, 0) }, (_, i) => from - i).join(' × ')

  switch (mode) {
    case 'permutation':
      return { symbol: 'P', n, r, expression: r === 0 ? '1' : descendingProduct(n, r), value: nPr(n, r) }
    case 'permutationWithRepetition':
      return {
        symbol: 'Π',
        n,
        r,
        expression: r === 0 ? '1' : Array.from({ length: r }, () => n).join(' × '),
        value: nPrRepetition(n, r),
      }
    case 'combination': {
      if (r === 0) return { symbol: 'C', n, r, expression: '1', value: 1 }
      const numerator = descendingProduct(n, r)
      const denominator = descendingProduct(r, r)
      return { symbol: 'C', n, r, expression: `(${numerator}) ÷ (${denominator})`, value: nCr(n, r) }
    }
    case 'combinationWithRepetition': {
      if (r === 0) return { symbol: 'H', n, r, expression: '1', value: 1 }
      const nn = n + r - 1
      const numerator = descendingProduct(nn, r)
      const denominator = descendingProduct(r, r)
      return { symbol: 'H', n, r, expression: `(${numerator}) ÷ (${denominator})`, value: nCrRepetition(n, r) }
    }
  }
}
