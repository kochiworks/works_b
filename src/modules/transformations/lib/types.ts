export interface Point {
  x: number
  y: number
}

export type ShapeKind = 'point' | 'segment' | 'triangle' | 'quad' | 'line' | 'circle' | 'quadratic'

/** point/segment/triangle/quad edit vertices directly; line/circle/quadratic are defined
 *  by an equation's parameters instead (slope+intercept, center+radius, a/p/q). */
export type ShapeFamily = 'polygon' | 'equation'

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
  line: '직선',
  circle: '원',
  quadratic: '이차함수',
}

export const SHAPE_FAMILY: Record<ShapeKind, ShapeFamily> = {
  point: 'polygon',
  segment: 'polygon',
  triangle: 'polygon',
  quad: 'polygon',
  line: 'equation',
  circle: 'equation',
  quadratic: 'equation',
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

/**
 * 이차함수(y = a(x-p)²+q)는 평행이동·x축/y축/원점 대칭에서만 "y = f(x)" 형태를
 * 유지한다 — 회전이동이나 직선 y=x 대칭을 적용하면 x에 대한 함수가 아닌
 * 옆으로 열린 포물선이 되어 표준형으로 표현할 수 없다. 그래서 이 도형일 때는
 * 회전이동 탭과 y=x 대칭 옵션을 아예 숨긴다.
 */
export function isTransformAllowedForShape(kind: ShapeKind, type: TransformType, axis: ReflectionAxis): boolean {
  if (kind !== 'quadratic') return true
  if (type === 'rotate') return false
  if (type === 'reflect' && axis === 'yEqualsX') return false
  return true
}
