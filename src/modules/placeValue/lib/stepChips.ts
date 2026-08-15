import type { ColumnState, OperandValues, OperationKind, PlaceKey, Stage } from './types'

export type ChipTone = 'carry' | 'borrow' | 'remainder'

export type StepChip =
  | { kind: 'dots'; count: number; place: PlaceKey }
  | { kind: 'symbol'; text: string }
  | { kind: 'badge'; text: string; tone: ChipTone }

/** Builds the small "이번 자리에서 무슨 일이 있었는지" bead sequence for one
 *  stage — the visual half of each StepList row, paired on the same row with
 *  that stage's explanation sentence. Returns null for the initial "설정"
 *  stage, which has no single 자리 to summarize yet. */
export function buildStepChips(kind: OperationKind, values: OperandValues, stage: Stage): StepChip[] | null {
  if (!stage.place) return null
  const place = stage.place

  if (stage.variant === 'columns') {
    const col = stage.columns[place]
    if (kind === 'multiplication') return multiplicationChips(place, col, values.b)
    if (kind === 'subtraction') return subtractionChips(place, col)
    return additionChips(place, col)
  }

  const bringDown = stage.bringDowns.at(-1)
  if (!bringDown) return null
  const chips: StepChip[] = []
  if (bringDown.priorRemainder > 0) {
    chips.push({ kind: 'badge', text: `나머지 ${bringDown.priorRemainder}`, tone: 'remainder' })
  }
  chips.push({ kind: 'dots', count: bringDown.digit, place })
  chips.push({ kind: 'symbol', text: '÷' })
  chips.push({ kind: 'dots', count: values.b, place: 'ones' })
  chips.push({ kind: 'symbol', text: '=' })
  chips.push({ kind: 'dots', count: bringDown.quotientDigit, place })
  if (bringDown.remainder > 0) {
    chips.push({ kind: 'badge', text: `나머지 ${bringDown.remainder}`, tone: 'remainder' })
  }
  return chips
}

function additionChips(place: PlaceKey, col: ColumnState): StepChip[] {
  const chips: StepChip[] = []
  if (col.carryIn) chips.push({ kind: 'badge', text: `+${col.carryIn} 받아올림`, tone: 'carry' })
  chips.push({ kind: 'dots', count: col.digitA, place })
  chips.push({ kind: 'symbol', text: '+' })
  chips.push({ kind: 'dots', count: col.digitB, place })
  chips.push({ kind: 'symbol', text: '=' })
  if (col.done && col.resultDigit !== undefined) chips.push({ kind: 'dots', count: col.resultDigit, place })
  return chips
}

function subtractionChips(place: PlaceKey, col: ColumnState): StepChip[] {
  const chips: StepChip[] = []
  chips.push({ kind: 'dots', count: col.digitA, place })
  if (col.carryIn) chips.push({ kind: 'badge', text: `+10 받아내림`, tone: 'borrow' })
  chips.push({ kind: 'symbol', text: '−' })
  chips.push({ kind: 'dots', count: col.digitB, place })
  chips.push({ kind: 'symbol', text: '=' })
  if (col.done && col.resultDigit !== undefined) chips.push({ kind: 'dots', count: col.resultDigit, place })
  if (col.lentTen) chips.push({ kind: 'badge', text: '−10 빌려줌', tone: 'borrow' })
  return chips
}

function multiplicationChips(place: PlaceKey, col: ColumnState, multiplier: number): StepChip[] {
  const chips: StepChip[] = []
  if (col.carryIn) chips.push({ kind: 'badge', text: `+${col.carryIn} 받아올림`, tone: 'carry' })
  chips.push({ kind: 'dots', count: col.digitA, place })
  chips.push({ kind: 'symbol', text: '×' })
  chips.push({ kind: 'dots', count: multiplier, place: 'ones' })
  chips.push({ kind: 'symbol', text: '=' })
  if (col.done && col.resultDigit !== undefined) chips.push({ kind: 'dots', count: col.resultDigit, place })
  return chips
}
