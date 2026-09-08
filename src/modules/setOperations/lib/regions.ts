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

/**
 * Every boundary in these diagrams is drawn as an open curve, and the set's
 * name sits in the opening itself — the stroke stops, the letter takes that
 * space, and the stroke picks up on the other side. That is how the textbook
 * draws it, and it keeps the drawn line from reading as part of the set: the
 * region a set stands for is its inside, not its edge. The masks that decide
 * shading still use whole circles, so the opening changes only what is drawn,
 * never which elements belong where.
 */

/** Clear space a one-letter name needs in the curve, in user units. */
export const NAME_GAP = 28
/** Clear space "A = B" needs when one curve carries both names. */
export const WIDE_NAME_GAP = 62

export interface VennGeometry {
  width: number
  height: number
  frame: { x: number; y: number; w: number; h: number; radius: number }
  /** Centre of the opening in the frame's top edge, where U is written. */
  universeLabel: Point
  circles: { A: Circle; B: Circle; C?: Circle }
  /** Direction of each set's break, in degrees counterclockwise from east. */
  labelAngles: { A: number; B: number; C?: number }
  /**
   * Where the elements of each region are written. Keyed by the region's
   * signature — "AB" for A∩B minus C, "" for the part of U outside everything.
   * A narrow region carries its own `perRow` so its elements stack instead of
   * spreading sideways past the curve that bounds it.
   */
  centroids: Record<string, RegionSpot>
}

export interface RegionSpot extends Point {
  /** How many elements may share a row here. Defaults to 3. */
  perRow?: number
}

/** Two overlapping circles, the arrangement the textbook uses for A ∪ B. */
export const VENN_2: VennGeometry = {
  width: 360,
  height: 278,
  frame: { x: 8, y: 14, w: 344, h: 250, radius: 14 },
  universeLabel: { x: 306, y: 14 },
  circles: { A: { cx: 145, cy: 130, r: 78 }, B: { cx: 215, cy: 130, r: 78 } },
  labelAngles: { A: 128, B: 52 },
  centroids: {
    A: { x: 103, y: 130 },
    AB: { x: 180, y: 130 },
    B: { x: 257, y: 130 },
    // The band below the circles is wide but shallow, so elements outside every
    // set run along it six to a row rather than stacking into the frame edge.
    '': { x: 180, y: 238, perRow: 6 },
  },
}

/** Three circles in the classic arrangement, A above B and C. */
export const VENN_3: VennGeometry = {
  width: 360,
  height: 344,
  frame: { x: 8, y: 14, w: 344, h: 316, radius: 14 },
  universeLabel: { x: 306, y: 14 },
  circles: {
    A: { cx: 180, cy: 136, r: 76 },
    B: { cx: 138, cy: 210, r: 76 },
    C: { cx: 222, cy: 210, r: 76 },
  },
  labelAngles: { A: 90, B: 200, C: 340 },
  // Every spot below was placed by measuring, not by eye: each one clears the
  // curve of every set it is inside of, and of every set it is outside of, by
  // more than half a glyph — even with several elements sharing the region.
  // The lens regions are the tight ones, so they take two per row.
  centroids: {
    A: { x: 180, y: 95 },
    B: { x: 100, y: 240, perRow: 2 },
    C: { x: 260, y: 240, perRow: 2 },
    AB: { x: 136, y: 158, perRow: 2 },
    AC: { x: 224, y: 158, perRow: 2 },
    BC: { x: 180, y: 238, perRow: 2 },
    ABC: { x: 180, y: 185, perRow: 2 },
    '': { x: 180, y: 308, perRow: 6 },
  },
}

export function geometryFor(setCount: 2 | 3): VennGeometry {
  return setCount === 3 ? VENN_3 : VENN_2
}

/** A point on (or offset from) a circle, at an angle measured as in mathematics. */
export function pointOnCircle(circle: Circle, degrees: number, offset = 0): Point {
  const radians = (degrees * Math.PI) / 180
  const radius = circle.r + offset
  return {
    x: circle.cx + radius * Math.cos(radians),
    y: circle.cy - radius * Math.sin(radians),
  }
}

/**
 * The circle drawn as an arc that stops short of closing, leaving an opening
 * wide enough for the set's name to sit in. The gap is given in user units and
 * converted to an angle for this circle, so a small circle and a large one open
 * by the same amount of space rather than the same angle.
 */
export function openArcPath(circle: Circle, gapCentre: number, gapWidth = NAME_GAP): string {
  const half = ((gapWidth / 2 / circle.r) * 180) / Math.PI
  const start = pointOnCircle(circle, gapCentre + half)
  const end = pointOnCircle(circle, gapCentre - half)
  return `M ${round(start.x)} ${round(start.y)} A ${circle.r} ${circle.r} 0 1 0 ${round(end.x)} ${round(end.y)}`
}

/** Where the name goes: in the opening, centred on the curve itself. */
export function labelPoint(circle: Circle, gapCentre: number): Point {
  const point = pointOnCircle(circle, gapCentre)
  return { x: round(point.x), y: round(point.y) }
}

/**
 * The universe box, likewise left open where its own name sits. The path is
 * not closed, but filling it joins the two lips along the top edge it was
 * broken on, so the filled shape is still the whole rounded rectangle.
 */
export function openFramePath(geo: VennGeometry, gapWidth = NAME_GAP): string {
  const { x, y, w, h, radius } = geo.frame
  const right = x + w
  const bottom = y + h
  const gapFrom = geo.universeLabel.x - gapWidth / 2
  const gapTo = geo.universeLabel.x + gapWidth / 2
  return [
    `M ${gapTo} ${y}`,
    `H ${right - radius}`,
    `A ${radius} ${radius} 0 0 1 ${right} ${y + radius}`,
    `V ${bottom - radius}`,
    `A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom}`,
    `H ${x + radius}`,
    `A ${radius} ${radius} 0 0 1 ${x} ${bottom - radius}`,
    `V ${y + radius}`,
    `A ${radius} ${radius} 0 0 1 ${x + radius} ${y}`,
    `H ${gapFrom}`,
  ].join(' ')
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
 * are laid out in rows around it — at most `maxPerRow` wide, which a narrow
 * region lowers so its elements stay inside its own patch of the diagram.
 */
export function elementPositions(centre: Point, count: number, maxPerRow = 3): Point[] {
  if (count === 0) return []
  const perRow = Math.min(maxPerRow, count)
  const rows = Math.ceil(count / perRow)
  const dx = 18
  const dy = 15
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

function round(value: number): number {
  return Math.round(value * 100) / 100
}
