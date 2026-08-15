import { significantPlaces } from '../lib/digits'
import { PLACE_LABELS, PLACE_ORDER } from '../lib/types'
import type { PlaceDigits } from '../lib/digits'

interface Props {
  digits: PlaceDigits
  value: number
  label: string
}

/** One number's 백 · 십 · 일 구슬 묶음 — a hundred is drawn as a compact 10×10
 *  dot square, a ten as a 10-dot row, a one as a single dot, matching the
 *  reference picture's layout (and its color-by-place-value scheme: every
 *  hundred square is the same color regardless of which number it belongs
 *  to, and likewise for tens and ones). A place beyond the number's own
 *  significant digits (e.g. a single-digit multiplier's hundreds/tens) is
 *  left blank rather than showing a "0" header with nothing under it. */
export function PlaceValueBlocks({ digits, value, label }: Props) {
  const shown = new Set(significantPlaces(value))
  return (
    <div className="blocks-panel">
      <div className="blocks-panel-label">{label}</div>
      <div className="blocks-columns">
        {PLACE_ORDER.filter((place) => shown.has(place)).map((place) => (
          <div key={place} className="blocks-column">
            <div className="blocks-column-header">{digits[place]}</div>
            <div className="blocks-column-caption">{PLACE_LABELS[place]}</div>
            <div className="blocks-column-body">
              {place === 'hundreds' &&
                Array.from({ length: digits.hundreds }, (_, flatIndex) => (
                  <div key={flatIndex} className="hundred-flat">
                    {Array.from({ length: 100 }, (_, dotIndex) => (
                      <span key={dotIndex} className="dot dot--hundreds" />
                    ))}
                  </div>
                ))}
              {place === 'tens' && (
                <div className="ten-strips">
                  {Array.from({ length: digits.tens }, (_, stripIndex) => (
                    <div key={stripIndex} className="ten-strip">
                      {Array.from({ length: 10 }, (_, dotIndex) => (
                        <span key={dotIndex} className="dot dot--tens" />
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {place === 'ones' && (
                <div className="one-dots">
                  {Array.from({ length: digits.ones }, (_, dotIndex) => (
                    <span key={dotIndex} className="dot dot--ones" />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
