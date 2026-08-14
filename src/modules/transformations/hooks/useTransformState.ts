import { useCallback, useMemo, useState } from 'react'
import { linePoints, quadraticPoints } from '../lib/equationShapes'
import { SHAPE_PRESETS } from '../lib/presetShapes'
import { applyTransform, interpolatePoint, sequentialPhase, sequentialProgress } from '../lib/transforms'
import type { PointPhase } from '../lib/transforms'
import { isTransformAllowedForShape } from '../lib/types'
import type { Point, ReflectionAxis, RotationAngle, ShapeKind, TransformParams, TransformType } from '../lib/types'

export const GRID_MIN = -8
export const GRID_MAX = 8

function clampToGrid(value: number): number {
  return Math.min(Math.max(Math.round(value), GRID_MIN), GRID_MAX)
}

const DEFAULT_LINE = { slope: 1, intercept: -1 }
const DEFAULT_CIRCLE = { center: { x: -2, y: 1 }, radius: 3 }
const DEFAULT_QUADRATIC = { a: 0.5, vertex: { x: -2, y: -3 } }

function sanitizeParams(kind: ShapeKind, params: TransformParams): TransformParams {
  if (isTransformAllowedForShape(kind, params.type, params.axis)) return params
  // Quadratic only: fall back to a transform the shape can still represent.
  if (params.type === 'rotate') return { ...params, type: 'translate' }
  return { ...params, axis: 'x' }
}

export function useTransformState() {
  const [shapeKind, setShapeKindState] = useState<ShapeKind>('triangle')
  const [vertices, setVertices] = useState<Point[]>(SHAPE_PRESETS.triangle ?? [])
  const [lineSlope, setLineSlopeState] = useState(DEFAULT_LINE.slope)
  const [lineIntercept, setLineInterceptState] = useState(DEFAULT_LINE.intercept)
  const [circleCenter, setCircleCenter] = useState<Point>(DEFAULT_CIRCLE.center)
  const [circleRadius, setCircleRadiusState] = useState(DEFAULT_CIRCLE.radius)
  const [quadA, setQuadAState] = useState(DEFAULT_QUADRATIC.a)
  const [quadVertex, setQuadVertex] = useState<Point>(DEFAULT_QUADRATIC.vertex)
  const [params, setParams] = useState<TransformParams>({
    type: 'translate',
    dx: 3,
    dy: 2,
    axis: 'x',
    angle: 90,
  })

  const setShapeKind = useCallback((kind: ShapeKind) => {
    setShapeKindState(kind)
    const preset = SHAPE_PRESETS[kind]
    if (preset) setVertices(preset)
    setParams((prev) => sanitizeParams(kind, prev))
  }, [])

  const setVertexCoord = useCallback((index: number, axis: 'x' | 'y', value: number) => {
    const clamped = clampToGrid(value)
    setVertices((prev) => prev.map((p, i) => (i === index ? { ...p, [axis]: clamped } : p)))
  }, [])

  const setLineSlope = useCallback((slope: number) => setLineSlopeState(Math.min(Math.max(slope, -4), 4)), [])
  const setLineIntercept = useCallback(
    (intercept: number) => setLineInterceptState(clampToGrid(intercept)),
    [],
  )

  const setCircleCenterCoord = useCallback((axis: 'x' | 'y', value: number) => {
    setCircleCenter((prev) => ({ ...prev, [axis]: clampToGrid(value) }))
  }, [])
  const setCircleRadius = useCallback((radius: number) => setCircleRadiusState(Math.min(Math.max(radius, 1), 6)), [])

  const setQuadA = useCallback((a: number) => {
    const clamped = Math.min(Math.max(a, -2), 2)
    setQuadAState(clamped === 0 ? 0.5 : clamped)
  }, [])
  const setQuadVertexCoord = useCallback((axis: 'x' | 'y', value: number) => {
    setQuadVertex((prev) => ({ ...prev, [axis]: clampToGrid(value) }))
  }, [])

  const setTransformType = useCallback((type: TransformType) => {
    setParams((prev) => ({ ...prev, type }))
  }, [])
  const setDx = useCallback((dx: number) => setParams((prev) => ({ ...prev, dx: clampToGrid(dx) })), [])
  const setDy = useCallback((dy: number) => setParams((prev) => ({ ...prev, dy: clampToGrid(dy) })), [])
  const setAxis = useCallback((axis: ReflectionAxis) => setParams((prev) => ({ ...prev, axis })), [])
  const setAngle = useCallback((angle: RotationAngle) => setParams((prev) => ({ ...prev, angle })), [])

  // The points fed into the shared transform/animation engine — for polygon shapes
  // these *are* the vertices; for equation shapes they're just enough points to
  // carry the curve through (2 far-apart points for a line, the center for a
  // circle, sampled points for a parabola). Everything downstream (interpolation,
  // rendering) treats every shape kind identically once it has this array.
  const points = useMemo<Point[]>(() => {
    switch (shapeKind) {
      case 'line':
        return linePoints(lineSlope, lineIntercept)
      case 'circle':
        return [circleCenter]
      case 'quadratic':
        return quadraticPoints(quadA, quadVertex, GRID_MIN, GRID_MAX)
      default:
        return vertices
    }
  }, [shapeKind, vertices, lineSlope, lineIntercept, circleCenter, quadA, quadVertex])

  const transformedPoints = useMemo(() => points.map((p) => applyTransform(p, params)), [points, params])

  // Every shape kind — polygon vertices as well as an equation shape's defining
  // points (a line's 2 anchor points, a circle's center, a parabola's sampled curve
  // points) — is carried through the transform one point at a time: point 0 finishes
  // its move before point 1 starts, and so on. This is what makes the animation read
  // as "each point of the shape gets the same rule applied to it" rather than the
  // whole outline blending/rotating as one blob — interpolating two far-apart line
  // points simultaneously, for example, visibly looks like the line is *rotating*
  // through a reflection instead of flipping, which sequential motion avoids since
  // only one point is ever in flight at a time.
  const pointsAtProgress = useCallback(
    (t: number) => points.map((p, i) => interpolatePoint(p, params, sequentialProgress(i, points.length, t))),
    [points, params],
  )

  /** Which point is currently mid-move, for highlighting it in the grid — -1 once
   *  every point has finished (or before any point count exists). */
  const activeVertexIndex = useCallback(
    (t: number) => {
      if (points.length <= 1) return -1
      if (t <= 0 || t >= 1) return -1
      const index = Math.floor(t * points.length)
      return Math.min(index, points.length - 1)
    },
    [points.length],
  )

  /** Per-point pending/active/done status — lets the grid hide a point until its
   *  turn, then have it accumulate at its landed position instead of showing every
   *  point's eventual image up front (and, for a line, instead of drawing a
   *  half-moved connecting line that reads as a rotation). */
  const pointPhases = useCallback(
    (t: number): PointPhase[] => points.map((_, i) => sequentialPhase(i, points.length, t)),
    [points],
  )

  return {
    shapeKind,
    setShapeKind,
    vertices,
    setVertexCoord,
    lineSlope,
    setLineSlope,
    lineIntercept,
    setLineIntercept,
    circleCenter,
    setCircleCenterCoord,
    circleRadius,
    setCircleRadius,
    quadA,
    setQuadA,
    quadVertex,
    setQuadVertexCoord,
    params,
    setTransformType,
    setDx,
    setDy,
    setAxis,
    setAngle,
    points,
    transformedPoints,
    pointsAtProgress,
    activeVertexIndex,
    pointPhases,
  }
}
