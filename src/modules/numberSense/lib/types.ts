export type OperationKind = 'addition' | 'subtraction' | 'multiplication' | 'division'

export const OPERATION_LABELS: Record<OperationKind, string> = {
  addition: '덧셈',
  subtraction: '뺄셈',
  multiplication: '곱셈',
  division: '나눗셈',
}

/** A small icon shown next to each operation tab — purely decorative, keeps the
 *  tabs friendly and easy to tell apart for early readers. */
export const OPERATION_ICONS: Record<OperationKind, string> = {
  addition: '➕',
  subtraction: '➖',
  multiplication: '✖️',
  division: '➗',
}

export type OperandKey = 'a' | 'b'

/** One operand's slider config — what a "덧셈" or "나눗셈" screen calls a/b
 *  changes meaning per operation (e.g. division's a is the total count, its b is
 *  the number of groups), so each OperationConfig supplies its own pair. */
export interface OperandSpec {
  key: OperandKey
  /** Plain-language caption shown above the slider, e.g. "더하는 수 b". */
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

/** What one bead cell on the board currently shows. Meaning is operation-specific
 *  (see legendItems in operationConfigs.ts) but the palette is fixed:
 *  - 'empty': not used yet — a hollow outline bead.
 *  - 'a': the first operand's beads (or, for grouping operations, the beads
 *    counted into a group).
 *  - 'b': the second operand's beads, used only where addition continues
 *    counting past the first operand on the same rail.
 *  - 'removed': a bead taken away (subtraction's "치우기").
 *  - 'remainder': a leftover bead that didn't fit evenly into a group
 *    (division's "나머지"). */
export type BeadState = 'empty' | 'a' | 'b' | 'removed' | 'remainder'

/** One bead's position and the state it changes to — the unit of the reveal
 *  animation. A cell can appear more than once (e.g. subtraction first places a
 *  bead as 'a', then a later placement at the same row/col turns it 'removed'),
 *  each occurrence is one animation step. */
export interface BeadPlacement {
  row: number
  col: number
  state: BeadState
}

export interface BeadRowModel {
  cells: BeadState[]
}

export interface BeadBoardModel {
  rows: BeadRowModel[]
  rowLabels?: string[]
}

export interface OperationResult {
  /** The headline number — the sum/difference/product, or the quotient for
   *  division (division's leftover count is `remainder`, not folded into this). */
  value: number
  remainder?: number
  /** How many 10-bead rails the board needs to show every placement. */
  rowCount: number
  /** Ordered "one bead at a time" sequence the reveal animation steps through;
   *  applying all of them reproduces the final board. */
  placements: BeadPlacement[]
  rowLabels?: string[]
}

export interface OperationConfig {
  kind: OperationKind
  /** One-line reminder of what this operation's board layout is showing —
   *  printed under the operation's tabs. */
  description: string
  operands: OperandSpec[]
  compute: (a: number, b: number) => OperationResult
  /** The equation in textbook notation, as LaTeX source for KaTeX — e.g.
   *  "7 + 5 = 12" or "13 \\div 4 = 3 \\cdots 1". */
  equationTex: (a: number, b: number, result: OperationResult) => string
  /** A short, plain-language explanation of the principle behind the current
   *  numbers — e.g. "7개에서 3개를 더 놓아 10을 만들고, 남은 2개를 더 놓으면 12가 됩니다." */
  principleText: (a: number, b: number, result: OperationResult) => string
}

export interface LegendItem {
  state: BeadState
  label: string
}
