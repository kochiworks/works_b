import type { BeadBoardModel, BeadRowModel, OperationResult } from './types'

function emptyRow(): BeadRowModel {
  return { cells: Array(10).fill('empty') }
}

/** Builds the board as it looks after the first `step` placements have been
 *  applied — step 0 is an all-empty board, step === placements.length is the
 *  finished picture. Later placements at the same cell overwrite earlier ones
 *  (this is how subtraction turns an already-placed 'a' bead into 'removed'
 *  without needing a second cell). */
export function boardAtStep(result: OperationResult, step: number): BeadBoardModel {
  const rows: BeadRowModel[] = Array.from({ length: result.rowCount }, emptyRow)
  const applied = result.placements.slice(0, Math.max(0, Math.min(step, result.placements.length)))
  for (const placement of applied) {
    rows[placement.row].cells[placement.col] = placement.state
  }
  return { rows, rowLabels: result.rowLabels }
}
