import type { BeadPlacement, LegendItem, OperandKey, OperandValues, OperationConfig, OperationKind, OperationResult } from './types'

/** Where a bead at 0-based overall position `i` lands on a board made of
 *  10-bead rails, stacked top to bottom. */
function positionOf(i: number): { row: number; col: number } {
  return { row: Math.floor(i / 10), col: i % 10 }
}

const addition: OperationConfig = {
  kind: 'addition',
  description: '첫 번째 수만큼 알을 놓고, 이어서 두 번째 수만큼 더 놓아요. 10을 넘어가면 아랫줄로 이어집니다.',
  operands: [
    { key: 'a', label: '더해지는 수 a', min: 0, max: 10, step: 1, default: 7 },
    { key: 'b', label: '더하는 수 b', min: 0, max: 10, step: 1, default: 5 },
  ],
  compute: (a, b) => {
    const placements: BeadPlacement[] = []
    for (let i = 0; i < a; i++) placements.push({ ...positionOf(i), state: 'a' })
    for (let i = 0; i < b; i++) placements.push({ ...positionOf(a + i), state: 'b' })
    return { value: a + b, rowCount: 2, placements, rowLabels: ['1~10', '11~20'] }
  },
  equationTex: (a, b, result) => `${a} + ${b} = ${result.value}`,
  principleText: (a, b, result) => {
    if (a >= 10) return `이미 10개가 다 놓여 있으니, 아랫줄에 ${b}개를 이어서 놓으면 ${result.value}가 됩니다.`
    if (a + b <= 10) return `${a}개에 ${b}개를 이어서 놓으면 모두 ${result.value}개예요.`
    const toTen = 10 - a
    const rest = b - toTen
    return `${a}개에서 ${toTen}개를 먼저 채워 10을 만들고, 남은 ${rest}개를 아랫줄에 놓으면 ${result.value}가 됩니다.`
  },
}

const subtraction: OperationConfig = {
  kind: 'subtraction',
  description: '처음 수만큼 알을 놓은 뒤, 뒤에서부터 빼는 수만큼 알을 치워요. 남은 알의 개수가 답이에요.',
  operands: [
    { key: 'a', label: '처음 수 a', min: 0, max: 20, step: 1, default: 13 },
    { key: 'b', label: '빼는 수 b', min: 0, max: 20, step: 1, default: 6 },
  ],
  compute: (a, b) => {
    const removeFrom = a - b
    const placements: BeadPlacement[] = []
    for (let i = 0; i < a; i++) placements.push({ ...positionOf(i), state: 'a' })
    for (let i = removeFrom; i < a; i++) placements.push({ ...positionOf(i), state: 'removed' })
    return { value: a - b, rowCount: 2, placements, rowLabels: ['1~10', '11~20'] }
  },
  equationTex: (a, b, result) => `${a} - ${b} = ${result.value}`,
  principleText: (a, b, result) => {
    if (a <= 10) return `${a}개 중에서 ${b}개를 치우면 ${result.value}개가 남아요.`
    const overTen = a - 10
    if (b <= overTen) return `${a}개 중에서 ${b}개를 치우면 ${result.value}개가 남아요.`
    const toTen = overTen
    const rest = b - toTen
    return `${a}개에서 ${toTen}개를 먼저 치워 10을 만들고, 남은 ${rest}개를 10에서 더 치우면 ${result.value}개가 남아요.`
  },
}

const multiplication: OperationConfig = {
  kind: 'multiplication',
  description: '한 줄에 곱해지는 수만큼 알을 놓고, 그 줄을 묶음 수만큼 반복해요. 놓인 알을 모두 세면 곱이에요.',
  operands: [
    { key: 'a', label: '묶음 수 a', min: 1, max: 9, step: 1, default: 3 },
    { key: 'b', label: '한 묶음의 개수 b', min: 1, max: 9, step: 1, default: 4 },
  ],
  compute: (a, b) => {
    const placements: BeadPlacement[] = []
    for (let row = 0; row < a; row++) {
      for (let col = 0; col < b; col++) placements.push({ row, col, state: 'a' })
    }
    const rowLabels = Array.from({ length: a }, (_, i) => `${i + 1}묶음`)
    return { value: a * b, rowCount: a, placements, rowLabels }
  },
  equationTex: (a, b, result) => `${a} \\times ${b} = ${result.value}`,
  principleText: (a, b, result) =>
    `한 묶음에 ${b}개씩 ${a}묶음이 있어요. 놓인 알을 모두 세면 ${a} × ${b} = ${result.value}개입니다.`,
}

const division: OperationConfig = {
  kind: 'division',
  description: '전체 알을 묶음 수만큼 한 개씩 똑같이 나누어 담아요. 한 묶음에 들어간 개수가 답, 못 나눈 알은 나머지예요.',
  operands: [
    { key: 'a', label: '전체 개수 a', min: 1, max: 90, step: 1, default: 12 },
    { key: 'b', label: '나누는 묶음 수 b', min: 2, max: 9, step: 1, default: 3 },
  ],
  compute: (a, b) => {
    const quotient = Math.floor(a / b)
    const remainder = a % b
    const placements: BeadPlacement[] = []
    // Deal one bead at a time to each group in turn — mirrors how a student
    // would actually share the beads out round-robin.
    for (let round = 0; round < quotient; round++) {
      for (let group = 0; group < b; group++) placements.push({ row: group, col: round, state: 'a' })
    }
    for (let i = 0; i < remainder; i++) placements.push({ row: b, col: i, state: 'remainder' })
    const rowLabels = Array.from({ length: b }, (_, i) => `${i + 1}묶음`)
    if (remainder > 0) rowLabels.push('나머지')
    return { value: quotient, remainder, rowCount: remainder > 0 ? b + 1 : b, placements, rowLabels }
  },
  equationTex: (a, b, result) =>
    result.remainder ? `${a} \\div ${b} = ${result.value} \\;\\cdots\\; ${result.remainder}` : `${a} \\div ${b} = ${result.value}`,
  principleText: (a, b, result) =>
    result.remainder
      ? `${a}개를 ${b}묶음으로 똑같이 나누면 한 묶음에 ${result.value}개씩 나뉘고, ${result.remainder}개가 남아요.`
      : `${a}개를 ${b}묶음으로 똑같이 나누면 한 묶음에 ${result.value}개씩 나뉘어요.`,
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

/** Clamps both operands to their own slider range, then applies the one
 *  operation-specific rule that keeps the bead board representable: you can't
 *  subtract more than you started with, and division's dividend is capped so
 *  every group still fits on a single 10-bead rail. */
export function sanitizeOperandPair(kind: OperationKind, values: OperandValues): OperandValues {
  const [specA, specB] = OPERATION_CONFIGS[kind].operands
  let a = clampToSpec(specA, values.a)
  let b = clampToSpec(specB, values.b)
  if (kind === 'subtraction') b = Math.min(b, a)
  if (kind === 'division') a = Math.min(a, b * 10)
  return { a, b }
}

export function defaultOperandValues(kind: OperationKind): OperandValues {
  const [specA, specB] = OPERATION_CONFIGS[kind].operands
  return sanitizeOperandPair(kind, { a: specA.default, b: specB.default })
}

/** The slider's usable upper bound right now — narrower than the spec's own max
 *  wherever the other operand currently limits it (뺄셈's b can't exceed the
 *  a it's being taken from; 나눗셈's a is capped so every group still fits on
 *  one 10-bead rail). Driving the <input max> from this, instead of always the
 *  spec max, keeps the thumb from being draggable into a range that would just
 *  get silently clamped back by sanitizeOperandPair. */
export function effectiveOperandMax(kind: OperationKind, key: OperandKey, values: OperandValues): number {
  const spec = OPERATION_CONFIGS[kind].operands.find((s) => s.key === key)
  const specMax = spec?.max ?? 0
  if (kind === 'subtraction' && key === 'b') return Math.min(specMax, values.a)
  if (kind === 'division' && key === 'a') return Math.min(specMax, values.b * 10)
  return specMax
}

const LEGENDS: Record<OperationKind, LegendItem[]> = {
  addition: [
    { state: 'a', label: '처음 수' },
    { state: 'b', label: '더한 수' },
  ],
  subtraction: [
    { state: 'a', label: '남은 수' },
    { state: 'removed', label: '치운 수' },
  ],
  multiplication: [{ state: 'a', label: '묶음 안의 개수' }],
  division: [
    { state: 'a', label: '묶음에 나눈 개수' },
    { state: 'remainder', label: '나머지' },
  ],
}

export function legendItems(kind: OperationKind): LegendItem[] {
  return LEGENDS[kind]
}

export function computeResult(kind: OperationKind, values: OperandValues): OperationResult {
  return OPERATION_CONFIGS[kind].compute(values.a, values.b)
}
