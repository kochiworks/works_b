import type { Point, ShapeKind } from './types'

/** Only the polygon-family shapes need a preset vertex list — line/circle/quadratic are
 *  defined by their own equation parameters (see useTransformState's DEFAULT_LINE etc). */
export const SHAPE_PRESETS: Partial<Record<ShapeKind, Point[]>> = {
  point: [{ x: 2, y: 3 }],
  segment: [
    { x: -3, y: -1 },
    { x: 2, y: 3 },
  ],
  triangle: [
    { x: -3, y: -2 },
    { x: 3, y: -2 },
    { x: 0, y: 3 },
  ],
  quad: [
    { x: -3, y: -2 },
    { x: 3, y: -2 },
    { x: 3, y: 2 },
    { x: -3, y: 2 },
  ],
}

/** Whether the shape's edges close back into a loop (triangle/quad) or stay open (segment). */
export function isClosedShape(kind: ShapeKind): boolean {
  return kind === 'triangle' || kind === 'quad'
}
