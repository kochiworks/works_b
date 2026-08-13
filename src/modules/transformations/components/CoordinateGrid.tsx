import { GRID_MAX, GRID_MIN } from '../hooks/useTransformState'
import { isClosedShape } from '../lib/presetShapes'
import { VERTEX_NAMES } from '../lib/types'
import type { Point, ShapeKind } from '../lib/types'

const SCALE = 26
const PADDING = 26
const SIZE = (GRID_MAX - GRID_MIN) * SCALE + PADDING * 2

function toScreen(p: Point): { x: number; y: number } {
  return { x: PADDING + (p.x - GRID_MIN) * SCALE, y: PADDING + (GRID_MAX - p.y) * SCALE }
}

function edgesFor(count: number, closed: boolean): [number, number][] {
  const edges: [number, number][] = []
  for (let i = 0; i < count - 1; i++) edges.push([i, i + 1])
  if (closed && count > 2) edges.push([count - 1, 0])
  return edges
}

interface Props {
  shapeKind: ShapeKind
  points: Point[]
  transformedPoints: Point[]
  hidden: boolean
}

export function CoordinateGrid({ shapeKind, points, transformedPoints, hidden }: Props) {
  const closed = isClosedShape(shapeKind)
  const edges = edgesFor(points.length, closed)
  const gridLines = []
  for (let v = GRID_MIN; v <= GRID_MAX; v++) {
    gridLines.push(v)
  }

  const originalScreen = points.map(toScreen)
  const transformedScreen = transformedPoints.map(toScreen)
  const origin = toScreen({ x: 0, y: 0 })

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="좌표평면 도형 이동">
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

      {/* original shape */}
      <g>
        {edges.map(([a, b]) => (
          <line
            key={`orig-edge-${a}-${b}`}
            x1={originalScreen[a].x}
            y1={originalScreen[a].y}
            x2={originalScreen[b].x}
            y2={originalScreen[b].y}
            stroke="#b6b2d6"
            strokeWidth={2}
            strokeDasharray="5 4"
          />
        ))}
        {originalScreen.map((p, i) => (
          <g key={`orig-${i}`}>
            <circle cx={p.x} cy={p.y} r={5} fill="#ffffff" stroke="#8b7cf6" strokeWidth={2} />
            <text x={p.x + 9} y={p.y - 7} fontSize={12} fontWeight={700} fill="#6d5ce3">
              {VERTEX_NAMES[i]}
            </text>
          </g>
        ))}
      </g>

      {/* transformed shape */}
      <g className={hidden ? 'shape-transformed is-hidden' : 'shape-transformed'}>
        {edges.map(([a, b]) => (
          <line
            key={`trans-edge-${a}-${b}`}
            className="shape-edge"
            x1={transformedScreen[a].x}
            y1={transformedScreen[a].y}
            x2={transformedScreen[b].x}
            y2={transformedScreen[b].y}
            stroke="#ff9d87"
            strokeWidth={2.5}
          />
        ))}
        {transformedScreen.map((p, i) => (
          <g key={`trans-${i}`}>
            <circle className="shape-vertex" cx={p.x} cy={p.y} r={5.5} fill="#ff9d87" stroke="#e8735c" strokeWidth={2} />
            <text
              className="shape-vertex-label"
              x={p.x + 9}
              y={p.y - 7}
              fontSize={12}
              fontWeight={700}
              fill="#c1543f"
            >
              {VERTEX_NAMES[i]}&apos;
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}
