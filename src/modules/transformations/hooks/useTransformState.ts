import { useCallback, useMemo, useState } from 'react'
import { linePoints, quadraticPoints } from '../lib/equationShapes'
import { SHAPE_PRESETS } from '../lib/presetShapes'
import { applyTransform, interpolatePoint, sequentialProgress } from '../lib/transforms'
import { SHAPE_FAMILY, isTransformAllowedForShape } from '../lib/types'
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

  // Polygon-family shapes (point/segment/triangle/quad) are made of a small set of
  // named vertices a student can point at — for those, each vertex is carried through
  // the transform one at a time (sequentialProgress) so the animation shows "point A
  // moves, then point B, then point C" rather than the whole outline blending at once.
  // Equation-family shapes (line/circle/quadratic) are a locus, not a handful of named
  // points, so their defining points still move in lockstep as a single curve.
  const isSequential = SHAPE_FAMILY[shapeKind] === 'polygon'
  const pointsAtProgress = useCallback(
    (t: number) =>
      points.map((p, i) => interpolatePoint(p, params, isSequential ? sequentialProgress(i, points.length, t) : t)),
    [points, params, isSequential],
  )

  /** Which vertex is currently mid-move (polygon shapes only), for highlighting it in
   *  the grid — -1 when nothing is animating sequentially (equation shapes, or once
   *  every vertex has finished). */
  const activeVertexIndex = useCallback(
    (t: number) => {
      if (!isSequential || points.length <= 1) return -1
      if (t <= 0 || t >= 1) return -1
      const index = Math.floor(t * points.length)
      return Math.min(index, points.length - 1)
    },
    [isSequential, points.length],
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
  }
}
