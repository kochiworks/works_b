export function round(n: number): number {
  return Math.round(n * 100) / 100
}

/** "+ 3" / "- 3" / "" for 0 — the trailing "± q" term in shifted-form equations. */
export function signedTerm(value: number): string {
  const r = round(value)
  if (r === 0) return ''
  return r > 0 ? ` + ${r}` : ` - ${Math.abs(r)}`
}

/** "- p" / "+ |p|" — the "(x - p)" part of shifted-form notation, legible even when
 *  p itself is negative (avoids a confusing "x - -2"). */
export function shiftedAxisTerm(value: number): string {
  const r = round(value)
  return r >= 0 ? `- ${r}` : `+ ${Math.abs(r)}`
}

/** "x" when there's no horizontal shift, "(x - p)" otherwise — avoids the textbook
 *  writing "(x - 0)" where a plain "x" is what a student would actually write. */
export function shiftedX(p: number): string {
  return round(p) === 0 ? 'x' : `(x ${shiftedAxisTerm(p)})`
}

/** Same as shiftedX, but without the wrapping parentheses — for use inside a
 *  fraction's denominator, under a radical, or in a superscript, where the visual
 *  grouping (the fraction bar, the radical's vinculum, the raised baseline) already
 *  does the job parentheses would otherwise do in plain running text. */
export function shiftedXPlain(p: number): string {
  const r = round(p)
  if (r === 0) return 'x'
  return r > 0 ? `x - ${r}` : `x + ${Math.abs(r)}`
}

/** "2" / "" (for a=1) / "-" (for a=-1) — a leading coefficient shown only when it's
 *  not the visually-implied ±1. */
export function leadingCoefficient(value: number): string {
  const r = round(value)
  if (r === 1) return ''
  if (r === -1) return '-'
  return String(r)
}

const SUBSCRIPT_CHARS: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  '-': '₋',
}

/** Renders a number using Unicode subscript digits, e.g. for "log₂" — the base of a
 *  logarithm read as a subscript rather than a same-size trailing number. */
export function subscriptNumber(value: number): string {
  return String(round(value))
    .split('')
    .map((ch) => SUBSCRIPT_CHARS[ch] ?? ch)
    .join('')
}

/** The "b(x - p)" argument inside sin/cos/tan — drops the b-multiplier when b = 1
 *  and the parentheses around x when p = 0, same "don't write what a student
 *  wouldn't" spirit as shiftedX. */
export function angleArgument(b: number, p: number): string {
  const inner = shiftedX(p)
  const coefficient = leadingCoefficient(b)
  if (coefficient === '') return inner
  return round(p) === 0 ? `${coefficient}x` : `${coefficient}${inner}`
}
