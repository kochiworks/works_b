/** The three angles a 중3 student is asked to know exact trig ratios for. The
 *  simulator only ever shows these — an arbitrary acute angle would need a
 *  calculator or a table, which is 고등학교 territory. */
export type AngleDeg = 30 | 45 | 60

export type RatioKind = 'sin' | 'cos' | 'tan'

/** Which two sides of the right triangle a ratio is built from. `numer` is the
 *  side on top of the fraction, `denom` the side underneath. */
export interface RatioParts {
  numer: SideId
  denom: SideId
}

/** opp = 각과 마주 보는 변(대변), adj = 각을 낀 변(밑변), hyp = 빗변 */
export type SideId = 'opp' | 'adj' | 'hyp'

export interface RatioValue {
  /** exact value, as a KaTeX string */
  tex: string
  /** decimal approximation, rounded for display */
  approx: number
  parts: RatioParts
}

export interface AngleData {
  deg: AngleDeg
  /** Side lengths in "unit" coordinates, drawn exactly to scale so that e.g.
   *  the 30° 대변 is visibly half the 빗변. A = 예각, C = 직각, B = 나머지 꼭짓점. */
  opp: number
  adj: number
  hyp: number
  /** exact side lengths as KaTeX, keyed by side */
  sideTex: Record<SideId, string>
  ratios: Record<RatioKind, RatioValue>
  /** The whole-figure shape this half-triangle came from — drawn faintly behind
   *  the triangle so the exact values have a visible geometric reason. */
  companion: CompanionKind
  /** One sentence naming that reason. */
  reason: string
}

export type CompanionKind = 'equilateral-down' | 'square' | 'equilateral-right'

export const SIDE_LABEL: Record<SideId, string> = {
  opp: '높이',
  adj: '밑변',
  hyp: '빗변',
}

/** 대변 / 밑변 wording used in the ratio readout (relative to 각 A). */
export const SIDE_ROLE: Record<SideId, string> = {
  opp: '대변',
  adj: '밑변',
  hyp: '빗변',
}

export const RATIO_LABEL: Record<RatioKind, string> = {
  sin: 'sin',
  cos: 'cos',
  tan: 'tan',
}
