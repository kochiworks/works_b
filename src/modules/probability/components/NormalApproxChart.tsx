import { binomialMeanSd, binomialPmf, normalPdf } from '../lib/binomial'

const WIDTH = 560
const HEIGHT = 240
const PADDING_LEFT = 16
const PADDING_RIGHT = 16
const PADDING_TOP = 16
const PADDING_BOTTOM = 30
const PLOT_WIDTH = WIDTH - PADDING_LEFT - PADDING_RIGHT
const PLOT_HEIGHT = HEIGHT - PADDING_TOP - PADDING_BOTTOM

interface Props {
  /** Number of independent repeats of the Bernoulli(p) trial — the current trial
   *  count, so the chart tracks the same "n" the student is already controlling. */
  n: number
  /** P(A), the theoretical probability of the chosen event. */
  p: number
  /** How many of the n trials the running simulation actually landed on event A —
   *  shown as a marker once every trial has been revealed. */
  observedHits: number | null
}

/**
 * The De Moivre–Laplace / central limit theorem story: as the number of trials n
 * grows, the (discrete, exact) binomial distribution of "how many of n trials hit
 * event A" is increasingly well approximated by a (continuous, smooth) normal curve
 * with the same mean np and standard deviation √(np(1-p)). Sliding the trial-count
 * control up lets a student watch the violet bars visibly tighten around the coral
 * curve.
 */
export function NormalApproxChart({ n, p, observedHits }: Props) {
  const { mean, sd } = binomialMeanSd(n, p)
  const spread = sd > 0 ? sd : 1
  const kMin = Math.max(0, Math.floor(mean - 4 * spread))
  const kMax = Math.min(n, Math.ceil(mean + 4 * spread))
  const pmf = binomialPmf(n, p).filter((point) => point.k >= kMin && point.k <= kMax)

  const peakProbability = Math.max(...pmf.map((point) => point.probability), normalPdf(mean, mean, spread))
  const yMax = peakProbability * 1.15 || 1

  const xFor = (k: number) => PADDING_LEFT + ((k - kMin) / Math.max(kMax - kMin, 1)) * PLOT_WIDTH
  const yFor = (value: number) => PADDING_TOP + (1 - Math.min(value, yMax) / yMax) * PLOT_HEIGHT

  const barWidth = Math.max(PLOT_WIDTH / Math.max(kMax - kMin + 1, 1) - 1, 0.5)

  const normalSamples = 80
  const normalPoints = Array.from({ length: normalSamples + 1 }, (_, i) => {
    const k = kMin + ((kMax - kMin) * i) / normalSamples
    return `${xFor(k)},${yFor(normalPdf(k, mean, spread))}`
  }).join(' ')

  const baseline = yFor(0)

  return (
    <svg
      className="freq-chart"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="이항분포가 정규분포에 가까워지는 그래프"
    >
      <line x1={PADDING_LEFT} y1={baseline} x2={WIDTH - PADDING_RIGHT} y2={baseline} stroke="#eeecf9" strokeWidth={1} />

      {/* exact binomial distribution, as bars */}
      {pmf.map((point) => (
        <rect
          key={point.k}
          x={xFor(point.k) - barWidth / 2}
          y={yFor(point.probability)}
          width={barWidth}
          height={Math.max(baseline - yFor(point.probability), 0)}
          fill="#ece7ff"
          stroke="#8b7cf6"
          strokeWidth={0.5}
        />
      ))}

      {/* normal approximation curve */}
      <polyline points={normalPoints} fill="none" stroke="#ff9d87" strokeWidth={2.5} />

      {/* observed hit count from the live simulation, once every trial has run */}
      {observedHits !== null && observedHits >= kMin && observedHits <= kMax && (
        <g>
          <line
            x1={xFor(observedHits)}
            y1={PADDING_TOP}
            x2={xFor(observedHits)}
            y2={baseline}
            stroke="#4fc9a5"
            strokeWidth={2}
            strokeDasharray="4 3"
          />
          <text x={xFor(observedHits)} y={PADDING_TOP - 4} fontSize={10} fontWeight={700} fill="#1d7a5f" textAnchor="middle">
            관찰값 {observedHits}
          </text>
        </g>
      )}

      {/* x-axis labels */}
      <text x={xFor(kMin)} y={HEIGHT - 8} fontSize={10} fill="#a6a2c0" textAnchor="start">
        {kMin}
      </text>
      <text x={xFor(mean)} y={HEIGHT - 8} fontSize={10} fontWeight={700} fill="#6d5ce3" textAnchor="middle">
        평균 {mean.toFixed(1)}
      </text>
      <text x={xFor(kMax)} y={HEIGHT - 8} fontSize={10} fill="#a6a2c0" textAnchor="end">
        {kMax}
      </text>
    </svg>
  )
}
