import type { Point } from './types'

/**
 * Samples y = evaluate(x) across [xMin, xMax] and splits the result into continuous
 * segments, breaking wherever the curve is undefined (evaluate returns null — a
 * rational function's asymptote, an irrational/logarithmic function's excluded
 * domain) or shoots outside the visible window. This one generic sampler is what
 * lets every function kind — polynomial, rational, irrational, exponential,
 * logarithmic, or trig — share the same rendering code with no per-kind special
 * casing: a tangent function's repeated vertical asymptotes, for instance, are
 * caught by the same "value exceeded yClamp" and "jumped too far between adjacent
 * samples" checks that handle a rational function's single asymptote.
 */
export function sampleCurve(evaluate: (x: number) => number | null, xMin: number, xMax: number, yClamp: number, samples = 480): Point[][] {
  const segments: Point[][] = []
  let current: Point[] = []
  let previousY: number | null = null

  for (let i = 0; i <= samples; i++) {
    const x = xMin + ((xMax - xMin) * i) / samples
    const y = evaluate(x)
    const outOfRange = y === null || !Number.isFinite(y) || Math.abs(y) > yClamp
    const bigJump = !outOfRange && previousY !== null && Math.abs((y as number) - previousY) > yClamp

    if (outOfRange || bigJump) {
      if (current.length > 1) segments.push(current)
      current = []
      previousY = outOfRange ? null : (y as number)
      continue
    }

    current.push({ x, y: y as number })
    previousY = y as number
  }

  if (current.length > 1) segments.push(current)
  return segments
}
