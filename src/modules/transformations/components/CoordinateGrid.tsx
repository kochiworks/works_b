import { GRID_MAX, GRID_MIN } from '../hooks/useTransformState'
import { isClosedShape } from '../lib/presetShapes'
import type { PointPhase } from '../lib/transforms'
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
  /** Fixed original points, shown as a dashed reference shape. */
  points: Point[]
  /** Same points, at the current animation progress — this is what visibly moves. */
  animatedPoints: Point[]
  /** Only meaningful for shapeKind === 'circle' (radius is transform-invariant). */
  radius?: number
  /** Index of the vertex currently mid-move in the sequential per-point animation
   *  (polygon shapes only); -1/undefined when nothing should be highlighted. */
  activeIndex?: number
  /** Per-vertex pending/active/done status (polygon shapes only) — a 'pending' vertex
   *  is hidden from the animated layer entirely (it hasn't had its turn yet, so it
   *  shouldn't already look "arrived"), and an edge only draws once both of its
   *  endpoints are 'done' — so the image shape visibly accumulates point by point
   *  instead of appearing all at once. undefined disables this and always shows
   *  everything (used for equation shapes, which move together as one curve). */
  pointPhases?: PointPhase[]
}

export function CoordinateGrid({ shapeKind, points, animatedPoints, radius, activeIndex = -1, pointPhases }: Props) {
  const isPolygon = shapeKind === 'point' || shapeKind === 'segment' || shapeKind === 'triangle' || shapeKind === 'quad'
  const closed = isClosedShape(shapeKind)
  const edges = isPolygon ? edgesFor(points.length, closed) : []
  const gridLines = []
  for (let v = GRID_MIN; v <= GRID_MAX; v++) {
    gridLines.push(v)
  }

  const originalScreen = points.map(toScreen)
  const animatedScreen = animatedPoints.map(toScreen)
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

      {/* original shape (fixed reference) */}
      <ShapeOutline shapeKind={shapeKind} screenPoints={originalScreen} edges={edges} radius={radius} variant="original" />

      {/* animated shape (moves with progress) */}
      <ShapeOutline
        shapeKind={shapeKind}
        screenPoints={animatedScreen}
        edges={edges}
        radius={radius}
        variant="animated"
        activeIndex={activeIndex}
        pointPhases={pointPhases}
      />
    </svg>
  )
}

interface ShapeOutlineProps {
  shapeKind: ShapeKind
  screenPoints: { x: number; y: number }[]
  edges: [number, number][]
  radius?: number
  variant: 'original' | 'animated'
  activeIndex?: number
  pointPhases?: PointPhase[]
}

function ShapeOutline({ shapeKind, screenPoints, edges, radius, variant, activeIndex = -1, pointPhases }: ShapeOutlineProps) {
  const isOriginal = variant === 'original'
  const stroke = isOriginal ? '#b6b2d6' : '#ff9d87'
  const strokeStyle = isOriginal ? '5 4' : undefined
  const strokeWidth = isOriginal ? 2 : 2.5
  const vertexFill = isOriginal ? '#ffffff' : '#ff9d87'
  const vertexStroke = isOriginal ? '#8b7cf6' : '#e8735c'
  const labelFill = isOriginal ? '#6d5ce3' : '#c1543f'
  const groupClass = isOriginal ? undefined : 'shape-animated'
  const lineClass = isOriginal ? undefined : 'shape-edge'
  const vertexClass = isOriginal ? undefined : 'shape-vertex'

  if (shapeKind === 'circle') {
    const [center] = screenPoints
    if (!center) return null
    return (
      <g className={groupClass}>
        <circle
          className={vertexClass}
          cx={center.x}
          cy={center.y}
          r={(radius ?? 1) * SCALE}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeStyle}
        />
        <circle cx={center.x} cy={center.y} r={3} fill={vertexFill} stroke={vertexStroke} strokeWidth={1.5} />
      </g>
    )
  }

  if (shapeKind === 'line') {
    const [p1, p2] = screenPoints
    if (!p1 || !p2) return null
    return (
      <g className={groupClass}>
        <line
          className={lineClass}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeStyle}
        />
      </g>
    )
  }

  if (shapeKind === 'quadratic') {
    const d = screenPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    return (
      <g className={groupClass}>
        <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeStyle} />
      </g>
    )
  }

  // point / segment / triangle / quad. `phaseOf` defaults to 'done' (fully shown) —
  // for the original reference shape (isOriginal) and for shapes without a phases
  // array (nothing sequential going on), that reproduces the old "always show
  // everything" behavior.
  const phaseOf = (i: number): PointPhase => (isOriginal ? 'done' : (pointPhases?.[i] ?? 'done'))

  return (
    <g className={groupClass}>
      {edges.map(([a, b]) => {
        // An edge only draws once BOTH endpoints have landed — otherwise it would
        // connect a landed point to one still waiting at its pre-move spot, implying
        // a shape that isn't really there yet. This is what makes the image shape
        // visibly accumulate vertex by vertex instead of appearing all at once.
        if (phaseOf(a) !== 'done' || phaseOf(b) !== 'done') return null
        return (
          <line
            key={`${a}-${b}`}
            className={lineClass}
            x1={screenPoints[a].x}
            y1={screenPoints[a].y}
            x2={screenPoints[b].x}
            y2={screenPoints[b].y}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeStyle}
          />
        )
      })}
      {screenPoints.map((p, i) => {
        const phase = phaseOf(i)
        if (phase === 'pending') return null
        const isActive = !isOriginal && i === activeIndex
        const justLanded = !isOriginal && phase === 'done' && !!pointPhases
        return (
          // Keying on phase remounts the vertex the moment it flips active → done,
          // which re-triggers the "landed" pop animation below.
          <g key={`${i}-${phase}`}>
            {isActive && (
              <circle className="shape-vertex-pulse" cx={p.x} cy={p.y} r={9} fill="none" stroke="#ff9d87" strokeWidth={2} />
            )}
            <circle
              className={justLanded ? `${vertexClass} shape-vertex-landed` : vertexClass}
              cx={p.x}
              cy={p.y}
              r={isOriginal ? 5 : isActive ? 6.5 : 5.5}
              fill={vertexFill}
              stroke={isActive ? '#c1543f' : vertexStroke}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <text x={p.x + 9} y={p.y - 7} fontSize={isActive ? 13 : 12} fontWeight={700} fill={labelFill}>
              {VERTEX_NAMES[i]}
              {isOriginal ? '' : "'"}
            </text>
          </g>
        )
      })}
    </g>
  )
}
