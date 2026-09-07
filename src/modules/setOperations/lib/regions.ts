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

export interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

/**
 * Every boundary in these diagrams is drawn as an open curve: the stroke stops
 * short of closing, and a short leader runs out of that break to the set's
 * name. That is how the textbook draws it, and it keeps the drawn line from
 * reading as part of the set — the region a set stands for is its inside, not
 * its edge. The masks that decide shading still use whole circles, so the
 * break changes only what is drawn, never which elements belong where.
 */
export const GAP_DEGREES = 30
/** How far the leader reaches out of the break. */
export const LEADER_LENGTH = 13
/** Where the name is written, measured out from the curve. */
export const LABEL_OFFSET = 27

export interface VennGeometry {
  width: number
  height: number
  frame: { x: number; y: number; w: number; h: number; radius: number }
  /** Horizontal span of the break in the frame's top edge. */
  frameGap: { from: number; to: number }
  universeLeader: Line
  universeLabel: Point
  circles: { A: Circle; B: Circle; C?: Circle }
  /** Direction of each set's break, in degrees counterclockwise from east. */
  labelAngles: { A: number; B: number; C?: number }
  /**
   * Where the elements of each region are written. Keyed by the region's
   * signature — "AB" for A∩B minus C, "" for the part of U outside everything.
   */
  centroids: Record<string, Point>
}

/** Two overlapping circles, the arrangement the textbook uses for A ∪ B. */
export const VENN_2: VennGeometry = {
  width: 360,
  height: 272,
  frame: { x: 8, y: 30, w: 344, h: 232, radius: 14 },
  frameGap: { from: 296, to: 326 },
  universeLeader: { x1: 311, y1: 30, x2: 325, y2: 19 },
  universeLabel: { x: 333, y: 15 },
  circles: { A: { cx: 145, cy: 146, r: 78 }, B: { cx: 215, cy: 146, r: 78 } },
  labelAngles: { A: 128, B: 52 },
  centroids: {
    A: { x: 103, y: 146 },
    AB: { x: 180, y: 146 },
    B: { x: 257, y: 146 },
    '': { x: 34, y: 243 },
  },
}

/** Three circles in the classic arrangement, A above B and C. */
export const VENN_3: VennGeometry = {
  width: 360,
  height: 344,
  frame: { x: 8, y: 30, w: 344, h: 304, radius: 14 },
  frameGap: { from: 296, to: 326 },
  universeLeader: { x1: 311, y1: 30, x2: 325, y2: 19 },
  universeLabel: { x: 333, y: 15 },
  circles: {
    A: { cx: 180, cy: 152, r: 76 },
    B: { cx: 138, cy: 226, r: 76 },
    C: { cx: 222, cy: 226, r: 76 },
  },
  labelAngles: { A: 90, B: 205, C: 335 },
  centroids: {
    A: { x: 180, y: 106 },
    B: { x: 98, y: 252 },
    C: { x: 262, y: 252 },
    AB: { x: 128, y: 202 },
    AC: { x: 232, y: 202 },
    BC: { x: 180, y: 266 },
    ABC: { x: 180, y: 212 },
    '': { x: 34, y: 315 },
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
 * The circle drawn as an arc that stops short of closing, leaving a break
 * centred on `gapCentre`. Sweeping counterclockwise from one lip of the break
 * round to the other covers 360° − gap, which is always the long way, hence
 * the large-arc flag.
 */
export function openArcPath(circle: Circle, gapCentre: number, gap = GAP_DEGREES): string {
  const start = pointOnCircle(circle, gapCentre + gap / 2)
  const end = pointOnCircle(circle, gapCentre - gap / 2)
  return `M ${round(start.x)} ${round(start.y)} A ${circle.r} ${circle.r} 0 1 0 ${round(end.x)} ${round(end.y)}`
}

/** The short line from the break out towards the set's name. */
export function leaderLine(circle: Circle, gapCentre: number): Line {
  const from = pointOnCircle(circle, gapCentre)
  const to = pointOnCircle(circle, gapCentre, LEADER_LENGTH)
  return { x1: round(from.x), y1: round(from.y), x2: round(to.x), y2: round(to.y) }
}

export function labelPoint(circle: Circle, gapCentre: number): Point {
  const point = pointOnCircle(circle, gapCentre, LABEL_OFFSET)
  return { x: round(point.x), y: round(point.y) }
}

/**
 * The universe box, likewise left open where its own name attaches. The path
 * is not closed, but filling it joins the two lips along the top edge it was
 * broken on, so the filled shape is still the whole rounded rectangle.
 */
export function openFramePath(geo: VennGeometry): string {
  const { x, y, w, h, radius } = geo.frame
  const right = x + w
  const bottom = y + h
  return [
    `M ${geo.frameGap.to} ${y}`,
    `H ${right - radius}`,
    `A ${radius} ${radius} 0 0 1 ${right} ${y + radius}`,
    `V ${bottom - radius}`,
    `A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom}`,
    `H ${x + radius}`,
    `A ${radius} ${radius} 0 0 1 ${x} ${bottom - radius}`,
    `V ${y + radius}`,
    `A ${radius} ${radius} 0 0 1 ${x + radius} ${y}`,
    `H ${geo.frameGap.from}`,
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

function round(value: number): number {
  return Math.round(value * 100) / 100
}
