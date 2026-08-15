import { computeAddition } from './addition'
import { computeDivision } from './division'
import { computeMultiplication } from './multiplication'
import { computeSubtraction } from './subtraction'
import type { OperandKey, OperandValues, OperationConfig, OperationKind } from './types'

const addition: OperationConfig = {
  kind: 'addition',
  description: '두 수를 백 · 십 · 일 구슬 묶음으로 나타내고, 일의 자리부터 더하며 10이 모이면 윗자리로 받아올려요.',
  operands: [
    { key: 'a', label: '더해지는 수 a', min: 0, max: 999, step: 1, default: 234 },
    { key: 'b', label: '더하는 수 b', min: 0, max: 999, step: 1, default: 158 },
  ],
  labels: { a: '더해지는 수', b: '더하는 수', result: '합' },
  compute: computeAddition,
  equationTex: (a, b, outcome) => `${a} + ${b} = ${outcome.value}`,
}

const subtraction: OperationConfig = {
  kind: 'subtraction',
  description: '처음 수에서 빼는 수만큼 자리별로 덜어내고, 모자라면 윗자리 묶음을 풀어(받아내림) 계산해요.',
  operands: [
    { key: 'a', label: '처음 수 a', min: 0, max: 999, step: 1, default: 300 },
    { key: 'b', label: '빼는 수 b', min: 0, max: 999, step: 1, default: 125 },
  ],
  labels: { a: '처음 수', b: '빼는 수', result: '차' },
  compute: computeSubtraction,
  equationTex: (a, b, outcome) => `${a} - ${b} = ${outcome.value}`,
}

const multiplication: OperationConfig = {
  kind: 'multiplication',
  description: '여러 자리 수의 자리마다 한 자리 수를 곱하고, 곱이 10을 넘으면 윗자리로 받아올려요.',
  operands: [
    { key: 'a', label: '곱해지는 수 a', min: 0, max: 999, step: 1, default: 123 },
    { key: 'b', label: '곱하는 수 b (한 자리)', min: 2, max: 9, step: 1, default: 4 },
  ],
  labels: { a: '곱해지는 수', b: '곱하는 수', result: '곱' },
  compute: computeMultiplication,
  equationTex: (a, b, outcome) => `${a} \\times ${b} = ${outcome.value}`,
}

const division: OperationConfig = {
  kind: 'division',
  description: '백의 자리부터 순서대로 한 자리 수로 나누고, 남는 수는 다음 자리로 내려써서 이어 나눠요.',
  operands: [
    { key: 'a', label: '나누어지는 수 a', min: 0, max: 999, step: 1, default: 456 },
    { key: 'b', label: '나누는 수 b (한 자리)', min: 2, max: 9, step: 1, default: 3 },
  ],
  labels: { a: '나누어지는 수', b: '나누는 수', result: '몫' },
  compute: computeDivision,
  equationTex: (a, b, outcome) =>
    outcome.remainder ? `${a} \\div ${b} = ${outcome.value} \\;\\cdots\\; ${outcome.remainder}` : `${a} \\div ${b} = ${outcome.value}`,
}

export const OPERATION_CONFIGS: Record<OperationKind, OperationConfig> = {
  addition,
  subtraction,
  multiplication,
  division,
}

function clampToSpec(spec: { min: number; max: number; step: number }, value: number): number {
  const stepped = Math.round(value / spec.step) * spec.step
  return Math.min(Math.max(stepped, spec.min), spec.max)
}

/** Clamps both operands to their own slider range, then applies the one rule
 *  that keeps every place-value block panel representable within 백·십·일
 *  (no 천의 자리 needed): 덧셈's sum, and 곱셈's product, must stay ≤ 999. */
export function sanitizeOperandPair(kind: OperationKind, values: OperandValues): OperandValues {
  const [specA, specB] = OPERATION_CONFIGS[kind].operands
  let a = clampToSpec(specA, values.a)
  let b = clampToSpec(specB, values.b)
  if (kind === 'addition') b = Math.min(b, 999 - a)
  if (kind === 'subtraction') b = Math.min(b, a)
  if (kind === 'multiplication') a = Math.min(a, Math.floor(999 / b))
  return { a, b }
}

export function defaultOperandValues(kind: OperationKind): OperandValues {
  const [specA, specB] = OPERATION_CONFIGS[kind].operands
  return sanitizeOperandPair(kind, { a: specA.default, b: specB.default })
}

/** Mirrors 수 감각 익히기's effectiveOperandMax — the slider's usable upper
 *  bound right now, narrower than the spec's own max wherever the other
 *  operand currently limits it. */
export function effectiveOperandMax(kind: OperationKind, key: OperandKey, values: OperandValues): number {
  const spec = OPERATION_CONFIGS[kind].operands.find((s) => s.key === key)
  const specMax = spec?.max ?? 0
  if (kind === 'addition' && key === 'b') return Math.min(specMax, 999 - values.a)
  if (kind === 'subtraction' && key === 'b') return Math.min(specMax, values.a)
  if (kind === 'multiplication' && key === 'a') return Math.min(specMax, Math.floor(999 / values.b))
  return specMax
}
