export type FunctionCategory = 'polynomial' | 'rationalIrrational' | 'expLog' | 'trig'

export type FunctionKind =
  | 'linear'
  | 'quadratic'
  | 'cubic'
  | 'quartic'
  | 'rational'
  | 'irrational'
  | 'exponential'
  | 'logarithmic'
  | 'sine'
  | 'cosine'
  | 'tangent'

export type CoefficientKey = 'a' | 'b' | 'p' | 'q'

export const CATEGORY_LABELS: Record<FunctionCategory, string> = {
  polynomial: '다항함수',
  rationalIrrational: '유리함수 · 무리함수',
  expLog: '지수함수 · 로그함수',
  trig: '삼각함수',
}

export const CATEGORY_KINDS: Record<FunctionCategory, FunctionKind[]> = {
  polynomial: ['linear', 'quadratic', 'cubic', 'quartic'],
  rationalIrrational: ['rational', 'irrational'],
  expLog: ['exponential', 'logarithmic'],
  trig: ['sine', 'cosine', 'tangent'],
}

export const KIND_LABELS: Record<FunctionKind, string> = {
  linear: '일차함수',
  quadratic: '이차함수',
  cubic: '삼차함수',
  quartic: '사차함수',
  rational: '유리함수',
  irrational: '무리함수',
  exponential: '지수함수',
  logarithmic: '로그함수',
  sine: '사인함수',
  cosine: '코사인함수',
  tangent: '탄젠트함수',
}

export interface Point {
  x: number
  y: number
}

/** One coefficient's slider config, shared by every function kind that has an a/b/p/q
 *  in its equation — driving a single generic CoefficientEditor instead of one
 *  hand-built editor per kind (11 of them). */
export interface CoefficientSpec {
  key: CoefficientKey
  /** Plain-language caption shown above the slider, e.g. "기울기 a". */
  label: string
  min: number
  max: number
  step: number
  default: number
  /** Snap away from 0 (e.g. a leading coefficient can't be 0 or the function
   *  degenerates into a lower-degree one). */
  disallowZero?: boolean
  /** Snap away from 1 (exponential/logarithmic bases). */
  disallowOne?: boolean
}

export type CoefficientValues = Partial<Record<CoefficientKey, number>>

export interface FunctionKindConfig {
  kind: FunctionKind
  category: FunctionCategory
  coefficients: CoefficientSpec[]
  /** y = f(x), or null where the function is undefined at x (asymptote, domain
   *  restriction) — the curve renderer breaks the drawn path there. */
  evaluate: (values: CoefficientValues, x: number) => number | null
  /** The equation in textbook notation, as LaTeX source for KaTeX — e.g.
   *  "y = 2(x - 1)^2 + 3". */
  equationText: (values: CoefficientValues) => string
  /** Domain/range/asymptote notes for the current coefficients — the "무엇을
   *  관찰해야 하는지" hint that ties the slider back to the textbook definition. */
  featuresText: (values: CoefficientValues) => string
}
