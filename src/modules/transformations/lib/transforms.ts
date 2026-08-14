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

export type PointPhase = 'pending' | 'active' | 'done'

interface PhaseInfo {
  phase: PointPhase
  localT: number
}

/** Shared boundary math behind sequentialProgress/sequentialPhase — see sequentialProgress
 *  for the reasoning behind splitting [0, 1] into one phase per point. */
function pointPhaseInfo(index: number, count: number, t: number): PhaseInfo {
  const clampedT = Math.min(Math.max(t, 0), 1)
  if (count <= 1) {
    if (clampedT <= 0) return { phase: 'pending', localT: 0 }
    if (clampedT >= 1) return { phase: 'done', localT: 1 }
    return { phase: 'active', localT: clampedT }
  }
  const start = index / count
  const end = (index + 1) / count
  if (clampedT <= start) return { phase: 'pending', localT: 0 }
  if (clampedT >= end) return { phase: 'done', localT: 1 }
  return { phase: 'active', localT: (clampedT - start) / (end - start) }
}

/**
 * Splits the overall [0, 1] animation progress into `count` equal back-to-back
 * phases, one per point, and returns *this point's own* local progress within its
 * phase — 0 before its turn, 1 once its turn has passed, and a live 0→1 ramp during
 * its turn. This is what makes the animation show each point of the shape being
 * carried by the transform one at a time (point 0 finishes moving, then point 1
 * starts, ...) instead of every point sliding in lockstep like a single blended
 * shape — the pointwise nature of a transform rule is the thing being demonstrated,
 * so watching one point complete its move before the next begins is the more
 * mathematically legible animation, even though the in-between shape is briefly
 * distorted (some vertices already moved, some not).
 */
export function sequentialProgress(index: number, count: number, t: number): number {
  return pointPhaseInfo(index, count, t).localT
}

/** Which stage this point's turn is in — 'pending' (hasn't started, stays hidden so it
 *  doesn't look like it "already arrived"), 'active' (mid-move, the one point currently
 *  animating), or 'done' (landed — accumulates into the growing image shape). */
export function sequentialPhase(index: number, count: number, t: number): PointPhase {
  return pointPhaseInfo(index, count, t).phase
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
