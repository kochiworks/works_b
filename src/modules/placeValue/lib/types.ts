import type { PlaceDigits } from './digits'

export type OperationKind = 'addition' | 'subtraction' | 'multiplication' | 'division'

export const OPERATION_LABELS: Record<OperationKind, string> = {
  addition: '덧셈',
  subtraction: '뺄셈',
  multiplication: '곱셈',
  division: '나눗셈',
}

export const OPERATION_ICONS: Record<OperationKind, string> = {
  addition: '➕',
  subtraction: '➖',
  multiplication: '✖️',
  division: '➗',
}

export type OperandKey = 'a' | 'b'

export interface OperandSpec {
  key: OperandKey
  label: string
  min: number
  max: number
  step: number
  default: number
}

export interface OperandValues {
  a: number
  b: number
}

export type PlaceKey = 'hundreds' | 'tens' | 'ones'

export const PLACE_LABELS: Record<PlaceKey, string> = {
  hundreds: '백의 자리',
  tens: '십의 자리',
  ones: '일의 자리',
}

/** Left-to-right display order — matches how both 세로셈 columns and the
 *  block panels' place headers are laid out. */
export const PLACE_ORDER: PlaceKey[] = ['hundreds', 'tens', 'ones']

/** One column of the 덧셈/뺄셈/곱셈 vertical layout. digitA/digitB are the
 *  operands' own digits (always shown, unchanged through the animation);
 *  resultDigit fills in once this column has been computed. */
export interface ColumnState {
  digitA: number
  digitB: number
  resultDigit?: number
  /** Small digit shown above this column — addition/multiplication's
   *  받아올림 carried in from the place to the right. */
  carryIn?: number
  /** This column lent a ten to its right neighbor (뺄셈's 받아내림) — shown
   *  as a struck-through original digit next to the reduced one. */
  lentTen?: boolean
  active: boolean
  done: boolean
}

interface StageBase {
  /** How each of the three block panels (A / B / 결과) currently looks —
   *  the 결과 panel starts empty and fills in as stages complete. */
  blocksA: PlaceDigits
  blocksB: PlaceDigits
  blocksResult: PlaceDigits
  /** 가로셈 lines revealed so far, oldest first — rendered as a growing list
   *  rather than one single-line expression. */
   horizontalLines: string[]
  /** Plain-language narration of what this stage is doing. */
  caption: string
}

export interface ColumnStage extends StageBase {
  variant: 'columns'
  columns: Record<PlaceKey, ColumnState>
}

export interface DivisionBringDown {
  place: PlaceKey
  digit: number
  brought: number
  quotientDigit: number
  remainder: number
}

export interface LongDivisionStage extends StageBase {
  variant: 'longDivision'
  quotientDigits: Partial<Record<PlaceKey, number>>
  bringDowns: DivisionBringDown[]
  remainder: number
}

export type Stage = ColumnStage | LongDivisionStage

export interface OperationOutcome {
  value: number
  remainder?: number
  stages: Stage[]
}

export interface OperationConfig {
  kind: OperationKind
  description: string
  operands: OperandSpec[]
  /** Panel captions — what "A"/"B"/the result mean for this operation, e.g.
   *  덧셈's {a:'더해지는 수', b:'더하는 수', result:'합'}. */
  labels: { a: string; b: string; result: string }
  compute: (a: number, b: number) => OperationOutcome
  equationTex: (a: number, b: number, outcome: OperationOutcome) => string
}
