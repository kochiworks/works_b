import type { Membership } from './types'

export interface Circle {
  cx: number
  cy: number
  r: number
}

export interface Point {
  x: number
  y: number
}

export interface VennGeometry {
  width: number
  height: number
  frame: { x: number; y: number; w: number; h: number }
  circles: { A: Circle; B: Circle; C?: Circle }
  /** Where each set's own name label goes. */
  nameLabels: { A: Point; B: Point; C?: Point }
  /**
   * Where the elements of each region are written. Keyed by the region's
   * signature — "AB" for A∩B minus C, "" for the part of U outside everything.
   */
  centroids: Record<string, Point>
}

/** Two overlapping circles, the arrangement the textbook uses for A ∪ B. */
export const VENN_2: VennGeometry = {
  width: 360,
  height: 250,
  frame: { x: 8, y: 8, w: 344, h: 234 },
  circles: { A: { cx: 145, cy: 120, r: 80 }, B: { cx: 215, cy: 120, r: 80 } },
  nameLabels: { A: { x: 92, y: 30 }, B: { x: 268, y: 30 } },
  centroids: {
    A: { x: 103, y: 120 },
    AB: { x: 180, y: 120 },
    B: { x: 257, y: 120 },
    '': { x: 32, y: 222 },
  },
}

/** Three circles in the classic arrangement, A on top of B and C. */
export const VENN_3: VennGeometry = {
  width: 360,
  height: 320,
  frame: { x: 8, y: 8, w: 344, h: 304 },
  circles: {
    A: { cx: 180, cy: 118, r: 76 },
    B: { cx: 138, cy: 192, r: 76 },
    C: { cx: 222, cy: 192, r: 76 },
  },
  nameLabels: { A: { x: 180, y: 26 }, B: { x: 42, y: 246 }, C: { x: 318, y: 246 } },
  centroids: {
    A: { x: 180, y: 72 },
    B: { x: 98, y: 218 },
    C: { x: 262, y: 218 },
    AB: { x: 128, y: 168 },
    AC: { x: 232, y: 168 },
    BC: { x: 180, y: 232 },
    ABC: { x: 180, y: 178 },
    '': { x: 32, y: 292 },
  },
}

export function geometryFor(setCount: 2 | 3): VennGeometry {
  return setCount === 3 ? VENN_3 : VENN_2
}

/** "AB" for an element in A and B but not C; "" for one outside every set. */
export function regionKey(membership: Membership, setCount: 2 | 3): string {
  let key = ''
  if (membership.A) key += 'A'
  if (membership.B) key += 'B'
  if (setCount === 3 && membership.C) key += 'C'
  return key
}

/** Every region of the diagram: 4 of them for two sets, 8 for three. */
export function allRegions(setCount: 2 | 3): Membership[] {
  const regions: Membership[] = []
  for (const A of [false, true]) {
    for (const B of [false, true]) {
      if (setCount === 2) {
        regions.push({ A, B, C: false })
        continue
      }
      for (const C of [false, true]) regions.push({ A, B, C })
    }
  }
  return regions
}

/**
 * Where to write a region's elements. One label sits on the centroid; several
 * are laid out in rows of at most three around it, so they stay inside the
 * region's own patch of the diagram.
 */
export function elementPositions(centre: Point, count: number): Point[] {
  if (count === 0) return []
  const perRow = Math.min(3, count)
  const rows = Math.ceil(count / perRow)
  const dx = 20
  const dy = 17
  const positions: Point[] = []
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / perRow)
    const inRow = Math.min(perRow, count - row * perRow)
    const col = i % perRow
    positions.push({
      x: centre.x + (col - (inRow - 1) / 2) * dx,
      y: centre.y + (row - (rows - 1) / 2) * dy,
    })
  }
  return positions
}
