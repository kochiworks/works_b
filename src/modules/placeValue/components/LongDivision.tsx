import { significantPlaces, toDigits } from '../lib/digits'
import { PLACE_ORDER } from '../lib/types'
import type { PlaceKey } from '../lib/types'

interface Props {
  dividend: number
  divisor: number
  quotientDigits: Partial<Record<PlaceKey, number>>
  quotientValue: number
  remainder: number
  showRemainder: boolean
}

/** 세로셈 for 나눗셈 — the bracket layout: divisor to the left, dividend under
 *  the bracket, quotient digits filling in above as each place is worked out
 *  left to right. The detailed "곱해서 빼기" subtraction boxes are left to the
 *  가로셈 panel's step list below, so this stays a clean, recognizable
 *  long-division shape rather than duplicating that narration here. */
export function LongDivision({ dividend, divisor, quotientDigits, quotientValue, remainder, showRemainder }: Props) {
  const dividendDigits = toDigits(dividend)
  const dividendPlaces = new Set(significantPlaces(dividend))
  const quotientPlaces = new Set(significantPlaces(quotientValue))

  return (
    <div className="long-division">
      <div className="ld-quotient-row">
        <span className="ld-divisor-spacer" aria-hidden="true" />
        {PLACE_ORDER.map((place) => (
          <span key={place} className="ld-cell ld-cell--quotient">
            {dividendPlaces.has(place) && quotientPlaces.has(place) ? (quotientDigits[place] ?? '') : ''}
          </span>
        ))}
      </div>
      <div className="ld-bracket-row">
        <span className="ld-divisor">{divisor}</span>
        <span className="ld-bracket" aria-hidden="true" />
        {PLACE_ORDER.map((place) => (
          <span key={place} className="ld-cell ld-cell--dividend">
            {dividendPlaces.has(place) ? dividendDigits[place] : ''}
          </span>
        ))}
      </div>
      {showRemainder && remainder > 0 && <div className="ld-remainder">나머지 {remainder}</div>}
    </div>
  )
}
