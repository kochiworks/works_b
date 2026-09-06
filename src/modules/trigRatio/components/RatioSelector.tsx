import { RATIO_LABEL, SIDE_ROLE } from '../lib/types'
import type { AngleData, RatioKind } from '../lib/types'

const RATIO_ORDER: RatioKind[] = ['sin', 'cos', 'tan']

interface Props {
  ratio: RatioKind
  data: AngleData
  onChange: (ratio: RatioKind) => void
}

/** Picks which ratio the triangle highlights. Each tab also spells out the two
 *  sides it is a fraction of, so switching tabs is switching which pair of sides
 *  lights up on the drawing. */
export function RatioSelector({ ratio, data, onChange }: Props) {
  return (
    <section className="panel">
      <h2>삼각비 고르기</h2>
      <div className="trig-tabs">
        {RATIO_ORDER.map((kind) => (
          <button
            key={kind}
            type="button"
            className={kind === ratio ? 'trig-tab active' : 'trig-tab'}
            onClick={() => onChange(kind)}
          >
            {RATIO_LABEL[kind]} {data.deg}°
          </button>
        ))}
      </div>
      <ul className="trig-ratio-defs">
        {RATIO_ORDER.map((kind) => {
          const parts = data.ratios[kind].parts
          return (
            <li key={kind} className={kind === ratio ? 'active' : undefined}>
              <span className="trig-ratio-defs__name">{RATIO_LABEL[kind]} A</span>
              <span className="trig-ratio-defs__frac">
                <span className={`trig-side-word trig-side-word--${parts.numer}`}>{SIDE_ROLE[parts.numer]}</span>
                <span className="trig-ratio-defs__bar" />
                <span className={`trig-side-word trig-side-word--${parts.denom}`}>{SIDE_ROLE[parts.denom]}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
