export interface Point {
  x: number
  y: number
}

export type ShapeKind = 'point' | 'segment' | 'triangle' | 'quad'

export type TransformType = 'translate' | 'reflect' | 'rotate'

export type ReflectionAxis = 'x' | 'y' | 'origin' | 'yEqualsX'

export type RotationAngle = 90 | 180 | 270

export interface TransformParams {
  type: TransformType
  dx: number
  dy: number
  axis: ReflectionAxis
  angle: RotationAngle
}

export const SHAPE_LABELS: Record<ShapeKind, string> = {
  point: '점',
  segment: '선분',
  triangle: '삼각형',
  quad: '사각형',
}

export const TRANSFORM_TYPE_LABELS: Record<TransformType, string> = {
  translate: '평행이동',
  reflect: '대칭이동',
  rotate: '회전이동',
}

export const REFLECTION_AXIS_LABELS: Record<ReflectionAxis, string> = {
  x: 'x축',
  y: 'y축',
  origin: '원점',
  yEqualsX: '직선 y = x',
}

export const VERTEX_NAMES = ['A', 'B', 'C', 'D']
