import { sampleCurve } from '../lib/curve'
import type { AsymptoteLines } from '../lib/asymptotes'
import type { CoefficientValues, FunctionKindConfig, Point } from '../lib/types'

export const GRID_MIN = -8
export const GRID_MAX = 8
const SCALE = 26
const PADDING = 26
const SIZE = (GRID_MAX - GRID_MIN) * SCALE + PADDING * 2
const Y_CLAMP = 9

function toScreen(p: Point): { x: number; y: number } {
  return { x: PADDING + (p.x - GRID_MIN) * SCALE, y: PADDING + (GRID_MAX - p.y) * SCALE }
}

interface Props {
  config: FunctionKindConfig
  values: CoefficientValues
  asymptotes: AsymptoteLines
}

export function FunctionGraph({ config, values, asymptotes }: Props) {
  const gridLines: number[] = []
  for (let v = GRID_MIN; v <= GRID_MAX; v++) gridLines.push(v)

  const segments = sampleCurve((x) => config.evaluate(values, x), GRID_MIN, GRID_MAX, Y_CLAMP)
  const origin = toScreen({ x: 0, y: 0 })

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="함수의 그래프">
      {/* grid */}
      {gridLines.map((v) => (
        <g key={`grid-${v}`}>
          <line
            x1={toScreen({ x: v, y: GRID_MIN }).x}
            y1={PADDING}
            x2={toScreen({ x: v, y: GRID_MIN }).x}
            y2={SIZE - PADDING}
            stroke={v === 0 ? '#c9c2f0' : '#eeecf9'}
            strokeWidth={v === 0 ? 1.5 : 1}
          />
          <line
            x1={PADDING}
            y1={toScreen({ x: GRID_MIN, y: v }).y}
            x2={SIZE - PADDING}
            y2={toScreen({ x: GRID_MIN, y: v }).y}
            stroke={v === 0 ? '#c9c2f0' : '#eeecf9'}
            strokeWidth={v === 0 ? 1.5 : 1}
          />
        </g>
      ))}

      {/* axis tick labels, every 2 units */}
      {gridLines
        .filter((v) => v !== 0 && v % 2 === 0)
        .map((v) => (
          <g key={`tick-${v}`} fontSize={9} fill="#a6a2c0">
            <text x={toScreen({ x: v, y: 0 }).x} y={origin.y + 12} textAnchor="middle">
              {v}
            </text>
            <text x={origin.x - 8} y={toScreen({ x: 0, y: v }).y + 3} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
      <text x={SIZE - PADDING + 10} y={origin.y + 4} fontSize={11} fill="#736f8f">
        x
      </text>
      <text x={origin.x - 4} y={PADDING - 8} fontSize={11} fill="#736f8f">
        y
      </text>

      {/* asymptote guide lines */}
      {asymptotes.vertical.map((x, i) => (
        <line
          key={`va-${i}`}
          x1={toScreen({ x, y: GRID_MIN }).x}
          y1={PADDING}
          x2={toScreen({ x, y: GRID_MIN }).x}
          y2={SIZE - PADDING}
          stroke="#e8b330"
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />
      ))}
      {asymptotes.horizontal.map((y, i) => (
        <line
          key={`ha-${i}`}
          x1={PADDING}
          y1={toScreen({ x: 0, y }).y}
          x2={SIZE - PADDING}
          y2={toScreen({ x: 0, y }).y}
          stroke="#e8b330"
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />
      ))}

      {/* the curve, as one <path> per continuous segment */}
      {segments.map((segment, i) => {
        const d = segment.map((p, j) => `${j === 0 ? 'M' : 'L'} ${toScreen(p).x} ${toScreen(p).y}`).join(' ')
        return <path key={i} d={d} fill="none" stroke="#8b7cf6" strokeWidth={2.75} strokeLinecap="round" />
      })}
    </svg>
  )
}
