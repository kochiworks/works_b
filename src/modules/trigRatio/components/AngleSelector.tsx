import { ANGLE_ORDER } from '../lib/angleData'
import type { AngleDeg } from '../lib/types'

interface Props {
  angleDeg: AngleDeg
  onChange: (deg: AngleDeg) => void
}

/** The only way to change the acute angle: pick one of the three special
 *  angles. Deliberately not a slider — 중3 exact ratios exist only here. */
export function AngleSelector({ angleDeg, onChange }: Props) {
  return (
    <section className="panel">
      <h2>예각의 크기</h2>
      <div className="trig-tabs">
        {ANGLE_ORDER.map((deg) => (
          <button
            key={deg}
            type="button"
            className={deg === angleDeg ? 'trig-tab active' : 'trig-tab'}
            onClick={() => onChange(deg)}
          >
            {deg}°
          </button>
        ))}
      </div>
      <p className="trig-hint">
        중학교 3학년에서 다루는 특수각 30° · 45° · 60° 만 고를 수 있습니다. 세 각의 삼각비는 계산기 없이 정확한 값으로 구할 수 있습니다.
      </p>
    </section>
  )
}
