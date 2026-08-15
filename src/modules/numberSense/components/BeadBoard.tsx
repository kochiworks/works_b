import { BeadRow } from './BeadRow'
import type { BeadBoardModel } from '../lib/types'

interface Props {
  board: BeadBoardModel
}

export function BeadBoard({ board }: Props) {
  return (
    <div className="bead-board">
      {board.rows.map((row, index) => (
        <BeadRow key={index} cells={row.cells} label={board.rowLabels?.[index]} />
      ))}
    </div>
  )
}
