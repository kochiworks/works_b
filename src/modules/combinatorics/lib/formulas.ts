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

function descendingSequence(from: number, count: number): number[] {
  return Array.from({ length: Math.max(count, 0) }, (_, i) => from - i)
}

/** Joins numbers with a LaTeX "\times" — the descending-product expansion behind
 *  ₙPᵣ / ₙΠᵣ, e.g. [5, 4, 3] → "5 \times 4 \times 3". */
function texTimes(values: number[]): string {
  return values.join(' \\times ')
}

export interface FormulaBreakdown {
  /** The textbook symbol's LaTeX source, e.g. "P", "C", "\Pi", "H". */
  symbolTex: string
  n: number
  r: number
  /** The derivation behind the notation, as LaTeX source, e.g. "5 \times 4 \times 3"
   *  or "{}_{4}P_{2} \div 2! = (4 \times 3) \div (2 \times 1)". */
  expressionTex: string
  value: number
}

/** Textbook notation + the step-by-step arithmetic for the given mode, for classroom
 *  display via KaTeX. */
export function formulaBreakdown(mode: Mode, n: number, r: number): FormulaBreakdown {
  switch (mode) {
    case 'permutation':
      return { symbolTex: 'P', n, r, expressionTex: r === 0 ? '1' : texTimes(descendingSequence(n, r)), value: nPr(n, r) }
    case 'permutationWithRepetition':
      return {
        symbolTex: '\\Pi',
        n,
        r,
        expressionTex: r === 0 ? '1' : texTimes(Array.from({ length: r }, () => n)),
        value: nPrRepetition(n, r),
      }
    case 'combination': {
      if (r === 0) return { symbolTex: 'C', n, r, expressionTex: '1', value: 1 }
      const numerator = texTimes(descendingSequence(n, r))
      const denominator = texTimes(descendingSequence(r, r))
      // Textbook derivation: nCr = nPr ÷ r!
      const expressionTex = `{}_{${n}}P_{${r}} \\div ${r}! = (${numerator}) \\div (${denominator})`
      return { symbolTex: 'C', n, r, expressionTex, value: nCr(n, r) }
    }
    case 'combinationWithRepetition': {
      if (r === 0) return { symbolTex: 'H', n, r, expressionTex: '1', value: 1 }
      const nn = n + r - 1
      const numerator = texTimes(descendingSequence(nn, r))
      const denominator = texTimes(descendingSequence(r, r))
      // Textbook derivation: nHr = (n+r-1)Cr
      const expressionTex = `{}_{${nn}}C_{${r}} = (${numerator}) \\div (${denominator})`
      return { symbolTex: 'H', n, r, expressionTex, value: nCrRepetition(n, r) }
    }
  }
}
