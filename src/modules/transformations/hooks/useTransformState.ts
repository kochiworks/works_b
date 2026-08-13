import { useCallback, useMemo, useState } from 'react'
import { SHAPE_PRESETS } from '../lib/presetShapes'
import { applyTransform } from '../lib/transforms'
import type { Point, ReflectionAxis, RotationAngle, ShapeKind, TransformParams, TransformType } from '../lib/types'

export const GRID_MIN = -8
export const GRID_MAX = 8

function clampToGrid(value: number): number {
  return Math.min(Math.max(Math.round(value), GRID_MIN), GRID_MAX)
}

export function useTransformState() {
  const [shapeKind, setShapeKindState] = useState<ShapeKind>('triangle')
  const [points, setPoints] = useState<Point[]>(SHAPE_PRESETS.triangle)
  const [params, setParams] = useState<TransformParams>({
    type: 'translate',
    dx: 3,
    dy: 2,
    axis: 'x',
    angle: 90,
  })

  const setShapeKind = useCallback((kind: ShapeKind) => {
    setShapeKindState(kind)
    setPoints(SHAPE_PRESETS[kind])
  }, [])

  const setPointCoord = useCallback((index: number, axis: 'x' | 'y', value: number) => {
    const clamped = clampToGrid(value)
    setPoints((prev) => prev.map((p, i) => (i === index ? { ...p, [axis]: clamped } : p)))
  }, [])

  const setTransformType = useCallback((type: TransformType) => {
    setParams((prev) => ({ ...prev, type }))
  }, [])

  const setDx = useCallback((dx: number) => setParams((prev) => ({ ...prev, dx: clampToGrid(dx) })), [])
  const setDy = useCallback((dy: number) => setParams((prev) => ({ ...prev, dy: clampToGrid(dy) })), [])
  const setAxis = useCallback((axis: ReflectionAxis) => setParams((prev) => ({ ...prev, axis })), [])
  const setAngle = useCallback((angle: RotationAngle) => setParams((prev) => ({ ...prev, angle })), [])

  const transformedPoints = useMemo(() => points.map((p) => applyTransform(p, params)), [points, params])

  return {
    shapeKind,
    setShapeKind,
    points,
    setPointCoord,
    params,
    setTransformType,
    setDx,
    setDy,
    setAxis,
    setAngle,
    transformedPoints,
  }
}
