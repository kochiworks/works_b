import { significantPlaces } from '../lib/digits'
import { PLACE_ORDER } from '../lib/types'
import type { ColumnState, PlaceKey } from '../lib/types'

interface Props {
  columns: Record<PlaceKey, ColumnState>
  operatorSymbol: string
  aValue: number
  bValue: number
  resultValue: number
  /** 곱셈처럼 두 번째 수가 한 자리뿐일 때 — 그 자리 외에는 digitB를 그리지 않는다. */
  bIsSingleDigit?: boolean
}

/** 세로셈 for 덧셈/뺄셈/곱셈 — right-aligned digit columns with the operator to
 *  the left of the second row, a carry/borrow badge row above, and the
 *  result row filling in as each place finishes. */
export function VerticalColumns({ columns, operatorSymbol, aValue, bValue, resultValue, bIsSingleDigit }: Props) {
  const aPlaces = new Set(significantPlaces(aValue))
  const bPlaces = new Set(bIsSingleDigit ? ['ones'] : significantPlaces(bValue))
  const resultPlaces = new Set(significantPlaces(resultValue))

  return (
    <div className="vertical-columns">
      <div className="vcol-row vcol-row--marks">
        <span className="vcol-operator" aria-hidden="true" />
        {PLACE_ORDER.map((place) => (
          <span key={place} className="vcol-cell vcol-cell--marks">
            {columns[place].carryIn ? <span className="carry-badge">{columns[place].carryIn}</span> : null}
            {columns[place].lentTen ? <span className="lent-badge">−1</span> : null}
          </span>
        ))}
      </div>
      <div className="vcol-row">
        <span className="vcol-operator" aria-hidden="true" />
        {PLACE_ORDER.map((place) => (
          <span key={place} className="vcol-cell">
            {aPlaces.has(place) ? columns[place].digitA : ''}
          </span>
        ))}
      </div>
      <div className="vcol-row">
        <span className="vcol-operator">{operatorSymbol}</span>
        {PLACE_ORDER.map((place) => (
          <span key={place} className="vcol-cell">
            {bPlaces.has(place) ? columns[place].digitB : ''}
          </span>
        ))}
      </div>
      <div className="vcol-rule" />
      <div className="vcol-row vcol-row--result">
        <span className="vcol-operator" aria-hidden="true" />
        {PLACE_ORDER.map((place) => (
          <span key={place} className={`vcol-cell vcol-cell--result${columns[place].done ? ' is-done' : ''}`}>
            {columns[place].done && resultPlaces.has(place) ? columns[place].resultDigit : ''}
          </span>
        ))}
      </div>
    </div>
  )
}
