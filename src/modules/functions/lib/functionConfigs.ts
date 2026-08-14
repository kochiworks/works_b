import { angleArgument, leadingCoefficient, round, shiftedX, shiftedXPlain, signedTerm } from './format'
import type { CoefficientSpec, CoefficientValues, FunctionKind, FunctionKindConfig } from './types'

const linear: FunctionKindConfig = {
  kind: 'linear',
  category: 'polynomial',
  coefficients: [
    { key: 'a', label: '기울기 a', min: -4, max: 4, step: 0.5, default: 1, disallowZero: true },
    { key: 'b', label: 'y절편 b', min: -8, max: 8, step: 1, default: 0 },
  ],
  evaluate: (v, x) => (v.a ?? 1) * x + (v.b ?? 0),
  equationText: (v) => `y = ${leadingCoefficient(v.a ?? 1)}x${signedTerm(v.b ?? 0)}`,
  standardFormTex: 'y = ax + b',
  featuresText: (v) => {
    const a = v.a ?? 1
    const b = v.b ?? 0
    return `${a > 0 ? '오른쪽 위로 향하는 증가함수' : '오른쪽 아래로 향하는 감소함수'}입니다. x절편: ${round(-b / a)}, y절편: ${round(b)}`
  },
}

const quadratic: FunctionKindConfig = {
  kind: 'quadratic',
  category: 'polynomial',
  coefficients: [
    { key: 'a', label: '계수 a', min: -2, max: 2, step: 0.5, default: 1, disallowZero: true },
    { key: 'p', label: '꼭짓점 x좌표 p', min: -6, max: 6, step: 1, default: 0 },
    { key: 'q', label: '꼭짓점 y좌표 q', min: -6, max: 6, step: 1, default: 0 },
  ],
  evaluate: (v, x) => (v.a ?? 1) * (x - (v.p ?? 0)) ** 2 + (v.q ?? 0),
  equationText: (v) => `y = ${leadingCoefficient(v.a ?? 1)}${shiftedX(v.p ?? 0)}^2${signedTerm(v.q ?? 0)}`,
  standardFormTex: 'y = a(x - p)^2 + q',
  featuresText: (v) => {
    const a = v.a ?? 1
    return `${a > 0 ? '아래로 볼록' : '위로 볼록'}한 포물선, 꼭짓점 (${round(v.p ?? 0)}, ${round(v.q ?? 0)}), 축의 방정식 x = ${round(v.p ?? 0)}, 치역: y ${a > 0 ? '≥' : '≤'} ${round(v.q ?? 0)}`
  },
}

const cubic: FunctionKindConfig = {
  kind: 'cubic',
  category: 'polynomial',
  coefficients: [
    { key: 'a', label: '계수 a', min: -1, max: 1, step: 0.1, default: 0.3, disallowZero: true },
    { key: 'p', label: '변곡점 x좌표 p', min: -6, max: 6, step: 1, default: 0 },
    { key: 'q', label: '변곡점 y좌표 q', min: -6, max: 6, step: 1, default: 0 },
  ],
  evaluate: (v, x) => (v.a ?? 0.3) * (x - (v.p ?? 0)) ** 3 + (v.q ?? 0),
  equationText: (v) => `y = ${leadingCoefficient(v.a ?? 0.3)}${shiftedX(v.p ?? 0)}^3${signedTerm(v.q ?? 0)}`,
  standardFormTex: 'y = a(x - p)^3 + q',
  featuresText: (v) => {
    const a = v.a ?? 0.3
    return `변곡점 (${round(v.p ?? 0)}, ${round(v.q ?? 0)})을 지나며 전체 구간에서 ${a > 0 ? '증가' : '감소'}합니다. 정의역과 치역 모두 실수 전체입니다.`
  },
}

const quartic: FunctionKindConfig = {
  kind: 'quartic',
  category: 'polynomial',
  coefficients: [
    { key: 'a', label: '계수 a', min: -0.5, max: 0.5, step: 0.05, default: 0.15, disallowZero: true },
    { key: 'p', label: '꼭짓점 x좌표 p', min: -6, max: 6, step: 1, default: 0 },
    { key: 'q', label: '꼭짓점 y좌표 q', min: -6, max: 6, step: 1, default: 0 },
  ],
  evaluate: (v, x) => (v.a ?? 0.15) * (x - (v.p ?? 0)) ** 4 + (v.q ?? 0),
  equationText: (v) => `y = ${leadingCoefficient(v.a ?? 0.15)}${shiftedX(v.p ?? 0)}^4${signedTerm(v.q ?? 0)}`,
  standardFormTex: 'y = a(x - p)^4 + q',
  featuresText: (v) => {
    const a = v.a ?? 0.15
    return `${a > 0 ? '아래로 볼록' : '위로 볼록'}, 꼭짓점 (${round(v.p ?? 0)}, ${round(v.q ?? 0)}), 양 끝이 같은 방향으로 향합니다. 치역: y ${a > 0 ? '≥' : '≤'} ${round(v.q ?? 0)}`
  },
}

const rational: FunctionKindConfig = {
  kind: 'rational',
  category: 'rationalIrrational',
  coefficients: [
    { key: 'a', label: '계수 a', min: -6, max: 6, step: 0.5, default: 2, disallowZero: true },
    { key: 'p', label: '점근선 x좌표 p', min: -6, max: 6, step: 1, default: 1 },
    { key: 'q', label: '점근선 y좌표 q', min: -6, max: 6, step: 1, default: 0 },
  ],
  evaluate: (v, x) => {
    const p = v.p ?? 1
    if (Math.abs(x - p) < 1e-9) return null
    return (v.a ?? 2) / (x - p) + (v.q ?? 0)
  },
  equationText: (v) => `y = \\dfrac{${round(v.a ?? 2)}}{${shiftedXPlain(v.p ?? 1)}}${signedTerm(v.q ?? 0)}`,
  standardFormTex: 'y = \\dfrac{a}{x - p} + q',
  featuresText: (v) => `점근선: x = ${round(v.p ?? 1)}, y = ${round(v.q ?? 0)}. 정의역: x ≠ ${round(v.p ?? 1)}, 치역: y ≠ ${round(v.q ?? 0)}`,
}

const irrational: FunctionKindConfig = {
  kind: 'irrational',
  category: 'rationalIrrational',
  coefficients: [
    { key: 'a', label: '계수 a', min: -3, max: 3, step: 0.5, default: 1, disallowZero: true },
    { key: 'p', label: '시작점 x좌표 p', min: -6, max: 6, step: 1, default: 0 },
    { key: 'q', label: '시작점 y좌표 q', min: -6, max: 6, step: 1, default: 0 },
  ],
  evaluate: (v, x) => {
    const p = v.p ?? 0
    if (x < p) return null
    return (v.a ?? 1) * Math.sqrt(x - p) + (v.q ?? 0)
  },
  equationText: (v) => `y = ${leadingCoefficient(v.a ?? 1)}\\sqrt{${shiftedXPlain(v.p ?? 0)}}${signedTerm(v.q ?? 0)}`,
  standardFormTex: 'y = a\\sqrt{x - p} + q',
  featuresText: (v) => {
    const a = v.a ?? 1
    return `정의역: x ≥ ${round(v.p ?? 0)}, 치역: y ${a > 0 ? '≥' : '≤'} ${round(v.q ?? 0)}. 시작점 (${round(v.p ?? 0)}, ${round(v.q ?? 0)})에서 ${a > 0 ? '증가' : '감소'}합니다.`
  },
}

const exponential: FunctionKindConfig = {
  kind: 'exponential',
  category: 'expLog',
  coefficients: [
    { key: 'a', label: '계수 a', min: -3, max: 3, step: 0.5, default: 1, disallowZero: true },
    { key: 'b', label: '밑 b', min: 0.2, max: 4, step: 0.1, default: 2, disallowOne: true },
    { key: 'p', label: 'x축 방향 이동 p', min: -6, max: 6, step: 1, default: 0 },
    { key: 'q', label: '점근선 y좌표 q', min: -6, max: 6, step: 1, default: 0 },
  ],
  evaluate: (v, x) => {
    const b = v.b ?? 2
    if (b <= 0) return null
    return (v.a ?? 1) * b ** (x - (v.p ?? 0)) + (v.q ?? 0)
  },
  equationText: (v) =>
    `y = ${leadingCoefficient(v.a ?? 1)}${round(v.b ?? 2)}^{${shiftedXPlain(v.p ?? 0)}}${signedTerm(v.q ?? 0)}`,
  standardFormTex: 'y = a \\cdot b^{x - p} + q',
  featuresText: (v) => {
    const b = v.b ?? 2
    const a = v.a ?? 1
    const increasing = (b > 1 && a > 0) || (b < 1 && a < 0)
    return `점근선: y = ${round(v.q ?? 0)}. 정의역: 실수 전체, 치역: y ${a > 0 ? '>' : '<'} ${round(v.q ?? 0)}. ${increasing ? '증가함수' : '감소함수'}입니다.`
  },
}

const logarithmic: FunctionKindConfig = {
  kind: 'logarithmic',
  category: 'expLog',
  coefficients: [
    { key: 'a', label: '계수 a', min: -3, max: 3, step: 0.5, default: 1, disallowZero: true },
    { key: 'b', label: '밑 b', min: 0.2, max: 4, step: 0.1, default: 2, disallowOne: true },
    { key: 'p', label: '점근선 x좌표 p', min: -6, max: 6, step: 1, default: 0 },
    { key: 'q', label: 'y축 방향 이동 q', min: -6, max: 6, step: 1, default: 0 },
  ],
  evaluate: (v, x) => {
    const p = v.p ?? 0
    const b = v.b ?? 2
    if (x <= p || b <= 0) return null
    return (v.a ?? 1) * (Math.log(x - p) / Math.log(b)) + (v.q ?? 0)
  },
  equationText: (v) =>
    `y = ${leadingCoefficient(v.a ?? 1)}\\log_{${round(v.b ?? 2)}}${shiftedX(v.p ?? 0)}${signedTerm(v.q ?? 0)}`,
  standardFormTex: 'y = a\\log_{b}(x - p) + q',
  featuresText: (v) => {
    const b = v.b ?? 2
    const a = v.a ?? 1
    const increasing = (b > 1 && a > 0) || (b < 1 && a < 0)
    return `점근선: x = ${round(v.p ?? 0)}. 정의역: x > ${round(v.p ?? 0)}, 치역: 실수 전체. ${increasing ? '증가함수' : '감소함수'}입니다.`
  },
}

const sine: FunctionKindConfig = {
  kind: 'sine',
  category: 'trig',
  coefficients: [
    { key: 'a', label: '진폭 a', min: -4, max: 4, step: 0.5, default: 2, disallowZero: true },
    { key: 'b', label: '주기 관련 b', min: 0.5, max: 3, step: 0.5, default: 1, disallowZero: true },
    { key: 'p', label: 'x축 방향 이동 p', min: -6, max: 6, step: 0.5, default: 0 },
    { key: 'q', label: 'y축 방향 이동 q', min: -4, max: 4, step: 0.5, default: 0 },
  ],
  evaluate: (v, x) => (v.a ?? 2) * Math.sin((v.b ?? 1) * (x - (v.p ?? 0))) + (v.q ?? 0),
  equationText: (v) => `y = ${leadingCoefficient(v.a ?? 2)}\\sin(${angleArgument(v.b ?? 1, v.p ?? 0)})${signedTerm(v.q ?? 0)}`,
  standardFormTex: 'y = a\\sin(b(x - p)) + q',
  featuresText: (v) => {
    const a = Math.abs(v.a ?? 2)
    const b = Math.abs(v.b ?? 1)
    const q = v.q ?? 0
    return `주기: ${round((2 * Math.PI) / b)} (2π/${round(b)}), 진폭: ${round(a)}, 치역: ${round(q - a)} ≤ y ≤ ${round(q + a)}`
  },
}

const cosine: FunctionKindConfig = {
  kind: 'cosine',
  category: 'trig',
  coefficients: [
    { key: 'a', label: '진폭 a', min: -4, max: 4, step: 0.5, default: 2, disallowZero: true },
    { key: 'b', label: '주기 관련 b', min: 0.5, max: 3, step: 0.5, default: 1, disallowZero: true },
    { key: 'p', label: 'x축 방향 이동 p', min: -6, max: 6, step: 0.5, default: 0 },
    { key: 'q', label: 'y축 방향 이동 q', min: -4, max: 4, step: 0.5, default: 0 },
  ],
  evaluate: (v, x) => (v.a ?? 2) * Math.cos((v.b ?? 1) * (x - (v.p ?? 0))) + (v.q ?? 0),
  equationText: (v) => `y = ${leadingCoefficient(v.a ?? 2)}\\cos(${angleArgument(v.b ?? 1, v.p ?? 0)})${signedTerm(v.q ?? 0)}`,
  standardFormTex: 'y = a\\cos(b(x - p)) + q',
  featuresText: (v) => {
    const a = Math.abs(v.a ?? 2)
    const b = Math.abs(v.b ?? 1)
    const q = v.q ?? 0
    return `주기: ${round((2 * Math.PI) / b)} (2π/${round(b)}), 진폭: ${round(a)}, 치역: ${round(q - a)} ≤ y ≤ ${round(q + a)}`
  },
}

const tangent: FunctionKindConfig = {
  kind: 'tangent',
  category: 'trig',
  coefficients: [
    { key: 'a', label: '계수 a', min: -4, max: 4, step: 0.5, default: 1, disallowZero: true },
    { key: 'b', label: '주기 관련 b', min: 0.5, max: 3, step: 0.5, default: 1, disallowZero: true },
    { key: 'p', label: 'x축 방향 이동 p', min: -6, max: 6, step: 0.5, default: 0 },
    { key: 'q', label: 'y축 방향 이동 q', min: -4, max: 4, step: 0.5, default: 0 },
  ],
  evaluate: (v, x) => {
    const angle = (v.b ?? 1) * (x - (v.p ?? 0))
    if (Math.abs(Math.cos(angle)) < 1e-6) return null
    return (v.a ?? 1) * Math.tan(angle) + (v.q ?? 0)
  },
  equationText: (v) => `y = ${leadingCoefficient(v.a ?? 1)}\\tan(${angleArgument(v.b ?? 1, v.p ?? 0)})${signedTerm(v.q ?? 0)}`,
  standardFormTex: 'y = a\\tan(b(x - p)) + q',
  featuresText: (v) => {
    const b = Math.abs(v.b ?? 1)
    return `주기: ${round(Math.PI / b)} (π/${round(b)}). 점근선이 주기적으로 반복되며, 그 x좌표들은 정의역에서 제외됩니다.`
  },
}

export const FUNCTION_CONFIGS: Record<FunctionKind, FunctionKindConfig> = {
  linear,
  quadratic,
  cubic,
  quartic,
  rational,
  irrational,
  exponential,
  logarithmic,
  sine,
  cosine,
  tangent,
}

export function defaultCoefficientValues(kind: FunctionKind): CoefficientValues {
  const values: CoefficientValues = {}
  for (const spec of FUNCTION_CONFIGS[kind].coefficients) {
    values[spec.key] = spec.default
  }
  return values
}

/** Snaps a slider value away from a degenerate coefficient (a leading term of 0, an
 *  exponential/log base of 1) by one step, in whichever direction the value was
 *  already moving from — keeps the function from silently collapsing into a
 *  lower-degree/undefined one without the student ever noticing why the graph
 *  suddenly changed shape. */
export function sanitizeCoefficient(spec: CoefficientSpec, value: number): number {
  const clamped = Math.min(Math.max(value, spec.min), spec.max)
  if (spec.disallowZero && Math.abs(clamped) < spec.step / 2) {
    return clamped >= 0 ? spec.step : -spec.step
  }
  if (spec.disallowOne && Math.abs(clamped - 1) < spec.step / 2) {
    return clamped >= 1 ? 1 + spec.step : 1 - spec.step
  }
  return clamped
}
