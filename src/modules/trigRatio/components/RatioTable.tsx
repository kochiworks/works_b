import { Katex } from './Katex'
import { ANGLE_ORDER } from '../lib/angleData'
import { ANGLE_DATA } from '../lib/angleData'
import { RATIO_LABEL } from '../lib/types'
import type { AngleDeg, RatioKind } from '../lib/types'

const RATIO_ORDER: RatioKind[] = ['sin', 'cos', 'tan']

interface Props {
  angleDeg: AngleDeg
  ratio: RatioKind
}

/** The full 3×3 special-angle table, with the current cell highlighted. Lets a
 *  student see the patterns — sin going up as cos comes down, tan 45° = 1 in the
 *  middle — while they change the selection. */
export function RatioTable({ angleDeg, ratio }: Props) {
  return (
    <section className="panel trig-table-panel">
      <h2>특수각의 삼각비</h2>
      <div className="trig-table-scroll">
        <table className="trig-table">
          <thead>
            <tr>
              <th />
              {ANGLE_ORDER.map((deg) => (
                <th key={deg} className={deg === angleDeg ? 'col-on' : undefined}>
                  {deg}°
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RATIO_ORDER.map((kind) => (
              <tr key={kind} className={kind === ratio ? 'row-on' : undefined}>
                <th scope="row">{RATIO_LABEL[kind]}</th>
                {ANGLE_ORDER.map((deg) => {
                  const on = deg === angleDeg && kind === ratio
                  return (
                    <td key={deg} className={on ? 'cell-on' : undefined}>
                      <Katex tex={ANGLE_DATA[deg].ratios[kind].tex} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
