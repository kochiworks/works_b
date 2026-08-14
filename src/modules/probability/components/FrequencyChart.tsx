const WIDTH = 560
const HEIGHT = 220
const PADDING_LEFT = 44
const PADDING_RIGHT = 16
const PADDING_TOP = 16
const PADDING_BOTTOM = 30
const PLOT_WIDTH = WIDTH - PADDING_LEFT - PADDING_RIGHT
const PLOT_HEIGHT = HEIGHT - PADDING_TOP - PADDING_BOTTOM

interface Props {
  /** Relative frequency after each of the first `revealed` trials, i.e. series[i] is
   *  the running relative frequency after trial i+1. */
  series: number[]
  revealed: number
  total: number
  theoreticalProbability: number
}

function yFor(value: number): number {
  return PADDING_TOP + (1 - value) * PLOT_HEIGHT
}

function xFor(index: number, total: number): number {
  if (total <= 1) return PADDING_LEFT
  return PADDING_LEFT + (index / (total - 1)) * PLOT_WIDTH
}

/**
 * The core "why simulate" payoff for a probability module: as more trials pile up,
 * the observed relative frequency (실험적 확률) should visibly settle in around the
 * theoretical probability (이론적 확률) — the law of large numbers, seen rather than
 * just stated.
 */
export function FrequencyChart({ series, revealed, total, theoreticalProbability }: Props) {
  const visible = series.slice(0, revealed)
  const gridValues = [0, 0.25, 0.5, 0.75, 1]
  const refY = yFor(theoreticalProbability)
  const points = visible.map((value, i) => `${xFor(i, total)},${yFor(value)}`).join(' ')
  const currentValue = visible.length > 0 ? visible[visible.length - 1] : null

  return (
    <svg
      className="freq-chart"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="상대도수가 이론적 확률에 가까워지는 그래프"
    >
      {/* horizontal gridlines + y-axis labels */}
      {gridValues.map((v) => (
        <g key={v}>
          <line
            x1={PADDING_LEFT}
            y1={yFor(v)}
            x2={WIDTH - PADDING_RIGHT}
            y2={yFor(v)}
            stroke="#eeecf9"
            strokeWidth={1}
          />
          <text x={PADDING_LEFT - 8} y={yFor(v) + 4} fontSize={10} fill="#a6a2c0" textAnchor="end">
            {v}
          </text>
        </g>
      ))}

      {/* x-axis labels */}
      <text x={PADDING_LEFT} y={HEIGHT - 8} fontSize={10} fill="#a6a2c0">
        1회
      </text>
      <text x={WIDTH - PADDING_RIGHT} y={HEIGHT - 8} fontSize={10} fill="#a6a2c0" textAnchor="end">
        {total.toLocaleString('ko-KR')}회
      </text>

      {/* theoretical probability reference line */}
      <line
        x1={PADDING_LEFT}
        y1={refY}
        x2={WIDTH - PADDING_RIGHT}
        y2={refY}
        stroke="#6d5ce3"
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
      <text x={WIDTH - PADDING_RIGHT} y={refY - 6} fontSize={10} fontWeight={700} fill="#6d5ce3" textAnchor="end">
        이론적 확률 {theoreticalProbability.toFixed(3)}
      </text>

      {/* observed relative frequency */}
      {visible.length > 1 && <polyline points={points} fill="none" stroke="#4fc9a5" strokeWidth={2.5} />}
      {currentValue !== null && (
        <circle cx={xFor(visible.length - 1, total)} cy={yFor(currentValue)} r={4} fill="#4fc9a5" stroke="#ffffff" strokeWidth={1.5} />
      )}
    </svg>
  )
}
