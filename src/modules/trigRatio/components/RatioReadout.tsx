import { Katex } from './Katex'
import { RATIO_LABEL, SIDE_ROLE } from '../lib/types'
import type { AngleData, RatioKind, SideId } from '../lib/types'

const PLAIN_LEN: Record<string, string> = {
  '1': '1',
  '2': '2',
  '\\sqrt{2}': '√2',
  '\\sqrt{3}': '√3',
}

interface Props {
  data: AngleData
  ratio: RatioKind
}

/**
 * The chosen ratio spelled out left to right: name → 대변/빗변 as words → the
 * two side *lengths* read straight off the triangle → the tidied exact value →
 * its decimal. Every step is on screen at once so nothing has to be taken on
 * trust.
 */
export function RatioReadout({ data, ratio }: Props) {
  const value = data.ratios[ratio]
  const { numer, denom } = value.parts
  const lenOf = (id: SideId) => PLAIN_LEN[data.sideTex[id]] ?? data.sideTex[id]

  return (
    <section className="panel trig-readout">
      <div className="trig-readout__line">
        <span className="trig-readout__name">
          {RATIO_LABEL[ratio]} {data.deg}°
        </span>
        <span className="trig-readout__eq">=</span>

        <span className="trig-frac">
          <span className={`trig-side-word trig-side-word--${numer}`}>{SIDE_ROLE[numer]}</span>
          <span className="trig-frac__bar" />
          <span className={`trig-side-word trig-side-word--${denom}`}>{SIDE_ROLE[denom]}</span>
        </span>
        <span className="trig-readout__eq">=</span>

        <span className="trig-frac">
          <span className={`trig-side-word trig-side-word--${numer}`}>{lenOf(numer)}</span>
          <span className="trig-frac__bar" />
          <span className={`trig-side-word trig-side-word--${denom}`}>{lenOf(denom)}</span>
        </span>
        <span className="trig-readout__eq">=</span>

        <Katex className="trig-readout__value" tex={value.tex} />
        <span className="trig-readout__eq">≈</span>
        <span className="trig-readout__approx">{value.approx}</span>
      </div>
    </section>
  )
}
