import type { Point, ReflectionAxis, RotationAngle, TransformParams } from './types'

export function translate(p: Point, dx: number, dy: number): Point {
  return { x: p.x + dx, y: p.y + dy }
}

export function reflect(p: Point, axis: ReflectionAxis): Point {
  switch (axis) {
    case 'x':
      return { x: p.x, y: -p.y }
    case 'y':
      return { x: -p.x, y: p.y }
    case 'origin':
      return { x: -p.x, y: -p.y }
    case 'yEqualsX':
      return { x: p.y, y: p.x }
  }
}

export function rotate(p: Point, angle: RotationAngle): Point {
  switch (angle) {
    case 90:
      return { x: -p.y, y: p.x }
    case 180:
      return { x: -p.x, y: -p.y }
    case 270:
      return { x: p.y, y: -p.x }
  }
}

/** Applies the currently-selected transform (only one of translate/reflect/rotate is
 *  "active" at a time — matches how this is taught before composite transforms). */
export function applyTransform(p: Point, params: TransformParams): Point {
  switch (params.type) {
    case 'translate':
      return translate(p, params.dx, params.dy)
    case 'reflect':
      return reflect(p, params.axis)
    case 'rotate':
      return rotate(p, params.angle)
  }
}

/**
 * The point's position partway (t ∈ [0, 1]) through the transform — this is what
 * drives the build-up animation. Translation and reflection interpolate the
 * coordinates directly (a reflection "slides" to its mirrored spot rather than
 * flipping through a third dimension, which is the standard simplification for a
 * 2D-only view). Rotation instead interpolates the *angle* and re-applies the
 * rotation matrix at each step, so points sweep along the correct circular arc
 * instead of cutting a straight line through the shape's interior.
 */
export function interpolatePoint(p: Point, params: TransformParams, t: number): Point {
  const clampedT = Math.min(Math.max(t, 0), 1)
  switch (params.type) {
    case 'translate':
      return translate(p, params.dx * clampedT, params.dy * clampedT)
    case 'reflect': {
      const end = reflect(p, params.axis)
      return {
        x: p.x + (end.x - p.x) * clampedT,
        y: p.y + (end.y - p.y) * clampedT,
      }
    }
    case 'rotate': {
      const theta = ((params.angle * Math.PI) / 180) * clampedT
      const cos = Math.cos(theta)
      const sin = Math.sin(theta)
      return { x: p.x * cos - p.y * sin, y: p.x * sin + p.y * cos }
    }
  }
}

function signed(n: number): string {
  return n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`
}

/** The coordinate rule in textbook notation, e.g. "(x, y) → (x+3, y-2)". */
export function transformRuleText(params: TransformParams): string {
  switch (params.type) {
    case 'translate':
      return `(x, y) → (x ${signed(params.dx)}, y ${signed(params.dy)})`
    case 'reflect':
      switch (params.axis) {
        case 'x':
          return '(x, y) → (x, -y)'
        case 'y':
          return '(x, y) → (-x, y)'
        case 'origin':
          return '(x, y) → (-x, -y)'
        case 'yEqualsX':
          return '(x, y) → (y, x)'
      }
      break
    case 'rotate':
      return `(x, y) → (${params.angle === 90 ? '-y, x' : params.angle === 180 ? '-x, -y' : 'y, -x'})`
  }
}

/** A short plain-language description of what's happening, for the panel subtitle. */
export function transformSummary(params: TransformParams): string {
  switch (params.type) {
    case 'translate':
      return `x축으로 ${params.dx}, y축으로 ${params.dy}만큼 평행이동`
    case 'reflect':
      switch (params.axis) {
        case 'x':
          return 'x축에 대해 대칭이동'
        case 'y':
          return 'y축에 대해 대칭이동'
        case 'origin':
          return '원점에 대해 대칭이동'
        case 'yEqualsX':
          return '직선 y = x에 대해 대칭이동'
      }
      break
    case 'rotate':
      return `원점을 중심으로 ${params.angle}° 회전이동`
  }
}
