import { applyTransform } from './transforms'
import type { Point, TransformParams } from './types'

/**
 * How far out (in grid units) a line's two defining points are placed. Every
 * transform this app supports (translate by ≤ grid size, reflect, rotate about the
 * origin) preserves distance from the origin closely enough that two points this
 * far apart stay well outside the visible grid after transforming — so the raw
 * line segment between them can be drawn directly and the SVG viewport clips it
 * to the visible portion for free, no explicit box-clipping needed.
 */
export const LINE_REACH = 30

/** The two points used to carry a line (y = slope·x + intercept) through the
 *  generic point-transform/animation engine. */
export function linePoints(slope: number, intercept: number): [Point, Point] {
  return [
    { x: -LINE_REACH, y: slope * -LINE_REACH + intercept },
    { x: LINE_REACH, y: slope * LINE_REACH + intercept },
  ]
}

/** Reads a line's equation back out of two points on it — "y = 2x - 3" form, or
 *  "x = 4" for a (near-)vertical result. */
export function lineEquationText(p1: Point, p2: Point): string {
  const dx = p2.x - p1.x
  if (Math.abs(dx) < 1e-6) {
    return `x = ${round(p1.x)}`
  }
  const slope = (p2.y - p1.y) / dx
  const intercept = p1.y - slope * p1.x
  return `y = ${formatSlope(slope)}x ${formatIntercept(intercept)}`
}

/** Samples points along y = a(x-p)² + q over the visible x-range, for carrying a
 *  parabola through the generic point-transform/animation engine. */
export function quadraticPoints(a: number, vertex: Point, xMin: number, xMax: number, samples = 41): Point[] {
  return Array.from({ length: samples }, (_, i) => {
    const x = xMin + ((xMax - xMin) * i) / (samples - 1)
    return { x, y: a * (x - vertex.x) ** 2 + vertex.y }
  })
}

/** Closed-form transform of a quadratic's (a, vertex) — only valid for the
 *  translate/x-reflect/y-reflect/origin-reflect subset this shape allows (see
 *  isTransformAllowedForShape), where the result stays a "y = f(x)" parabola. */
export function transformQuadratic(a: number, vertex: Point, params: TransformParams): { a: number; vertex: Point } {
  if (params.type === 'translate') {
    return { a, vertex: applyTransform(vertex, params) }
  }
  // reflect: x/origin flip the parabola upside down (negate a); y keeps it upright.
  const flips = params.type === 'reflect' && (params.axis === 'x' || params.axis === 'origin')
  return { a: flips ? -a : a, vertex: applyTransform(vertex, params) }
}

/** "(x - cx)² + (y - cy)² = r²" — used for the before/after comparison in RuleDisplay. */
export function circleEquationText(center: Point, radius: number): string {
  return `(x ${axisTerm(center.x)})² + (y ${axisTerm(center.y)})² = ${round(radius)}²`
}

/** "y = a(x - p)² + q" in vertex form — used for the before/after comparison in RuleDisplay. */
export function quadraticEquationText(a: number, vertex: Point): string {
  return `y = ${round(a)}(x ${axisTerm(vertex.x)})² ${formatIntercept(vertex.y)}`.trimEnd()
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

/** "- p" or "+ |p|" — the "(x - p)" part of vertex-form notation, kept legible when
 *  p itself is negative (avoids a confusing "x - -2"). */
function axisTerm(value: number): string {
  const r = round(value)
  return r >= 0 ? `- ${r}` : `+ ${Math.abs(r)}`
}

function formatSlope(slope: number): string {
  const r = round(slope)
  if (r === 1) return ''
  if (r === -1) return '-'
  return String(r)
}

function formatIntercept(intercept: number): string {
  const r = round(intercept)
  if (r === 0) return ''
  return r > 0 ? `+ ${r}` : `- ${Math.abs(r)}`
}
