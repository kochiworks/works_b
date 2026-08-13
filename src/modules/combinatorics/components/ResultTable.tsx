import { usePrevious } from '../hooks/usePrevious'
import type { ResultCase } from '../lib/types'

/**
 * Above this many newly-revealed cells in one render (e.g. clicking "전체 보기" on a
 * large result, or the very first paint), skip the per-cell mount animation — firing
 * a CSS animation on thousands of cells at once is what made large jumps freeze the
 * page for seconds, not the DOM size itself.
 */
const ANIMATE_JUMP_THRESHOLD = 40

interface Props {
  /** Full result set — rows/cells are revealed via `revealedCells`, not by slicing this. */
  cases: ResultCase[]
  r: number
  /** Full result count, used to tell "genuinely no matches" apart from "animation hasn't started". */
  totalCases: number
  /** How many cells (one item within one row) have been revealed so far by the build animation. */
  revealedCells: number
}

export function ResultTable({ cases, r, totalCases, revealedCells }: Props) {
  const previousRevealedCells = usePrevious(revealedCells)
  const animate = Math.abs(revealedCells - previousRevealedCells) <= ANIMATE_JUMP_THRESHOLD

  if (totalCases === 0) {
    return <p className="hint">조건을 만족하는 경우가 없습니다.</p>
  }

  const columns = Array.from({ length: r }, (_, i) => `${i + 1}번째`)
  const completeRows = Math.min(Math.floor(revealedCells / r), cases.length)
  const partialCount = revealedCells - completeRows * r
  const rowsToRender = partialCount > 0 && completeRows < cases.length ? completeRows + 1 : completeRows

  return (
    <div className="table-scroll">
      <table className="result-table">
        <thead>
          <tr>
            <th>#</th>
            {columns.map((label) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cases.slice(0, rowsToRender).map((kase, index) => {
            const visibleCount = index < completeRows ? r : partialCount
            return (
              <tr key={index}>
                <td className="row-index">{index + 1}</td>
                {kase.map((item, position) => (
                  <td key={`${item.id}-${position}`}>
                    {position < visibleCount && (
                      <span className={animate ? 'cell-enter' : undefined}>{item.name}</span>
                    )}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
