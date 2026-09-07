import { Fragment } from 'react'
import {
  elementPositions,
  labelPoint,
  leaderLine,
  openArcPath,
  regionKey,
} from '../lib/regions'
import type { Circle, Line, Point } from '../lib/regions'
import type { RelationVerdict } from '../lib/relations'
import type { Membership } from '../lib/types'

interface Layout {
  circles: { A: Circle; B: Circle }
  /** Direction of each set's break, in degrees counterclockwise from east. */
  labelAngles: { A: number; B: number }
  centroids: Record<string, Point>
  /** 서로 같은 집합: one curve carrying both names. */
  merged?: boolean
}

const WIDTH = 360
const HEIGHT = 272
const FRAME = { x: 8, y: 30, w: 344, h: 232, radius: 14 }
const FRAME_GAP = { from: 296, to: 326 }
const UNIVERSE_LEADER: Line = { x1: 311, y1: 30, x2: 325, y2: 19 }
const UNIVERSE_LABEL: Point = { x: 333, y: 15 }
const OUTSIDE: Point = { x: 34, y: 243 }

/**
 * The textbook draws each relation its own way — one curve inside another for
 * A ⊂ B, two apart for 서로소 — so the picture changes with the relation rather
 * than always showing the same overlap. Region keys stay the same throughout:
 * an element of A when A ⊂ B is in both sets, so it lives under "AB".
 */
const LAYOUTS: Record<RelationVerdict['layout'], Layout> = {
  overlap: {
    circles: { A: { cx: 145, cy: 146, r: 78 }, B: { cx: 215, cy: 146, r: 78 } },
    labelAngles: { A: 128, B: 52 },
    centroids: { A: { x: 103, y: 146 }, AB: { x: 180, y: 146 }, B: { x: 257, y: 146 }, '': OUTSIDE },
  },
  disjoint: {
    circles: { A: { cx: 103, cy: 146, r: 66 }, B: { cx: 257, cy: 146, r: 66 } },
    labelAngles: { A: 115, B: 65 },
    centroids: { A: { x: 103, y: 146 }, AB: { x: 180, y: 146 }, B: { x: 257, y: 146 }, '': OUTSIDE },
  },
  'nested-a-in-b': {
    circles: { A: { cx: 150, cy: 150, r: 48 }, B: { cx: 180, cy: 150, r: 92 } },
    labelAngles: { A: 90, B: 145 },
    // A ⊂ B, so A's own elements are in both sets and belong under "AB".
    centroids: { A: { x: 150, y: 150 }, AB: { x: 150, y: 150 }, B: { x: 250, y: 150 }, '': OUTSIDE },
  },
  'nested-b-in-a': {
    circles: { A: { cx: 180, cy: 150, r: 92 }, B: { cx: 150, cy: 150, r: 48 } },
    labelAngles: { A: 145, B: 90 },
    centroids: { A: { x: 250, y: 150 }, AB: { x: 150, y: 150 }, B: { x: 150, y: 150 }, '': OUTSIDE },
  },
  equal: {
    circles: { A: { cx: 180, cy: 150, r: 82 }, B: { cx: 180, cy: 150, r: 82 } },
    labelAngles: { A: 90, B: 90 },
    centroids: { A: { x: 180, y: 150 }, AB: { x: 180, y: 150 }, B: { x: 180, y: 150 }, '': OUTSIDE },
    merged: true,
  },
}

function framePath(): string {
  const { x, y, w, h, radius } = FRAME
  const right = x + w
  const bottom = y + h
  return [
    `M ${FRAME_GAP.to} ${y}`,
    `H ${right - radius}`,
    `A ${radius} ${radius} 0 0 1 ${right} ${y + radius}`,
    `V ${bottom - radius}`,
    `A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom}`,
    `H ${x + radius}`,
    `A ${radius} ${radius} 0 0 1 ${x} ${bottom - radius}`,
    `V ${y + radius}`,
    `A ${radius} ${radius} 0 0 1 ${x + radius} ${y}`,
    `H ${FRAME_GAP.from}`,
  ].join(' ')
}

interface Props {
  verdict: RelationVerdict
  universe: number[]
  membership: Record<number, Membership>
}

export function RelationVenn({ verdict, universe, membership }: Props) {
  const layout = LAYOUTS[verdict.layout]
  const drawn: ('A' | 'B')[] = layout.merged ? ['A'] : ['A', 'B']

  const byRegion = new Map<string, number[]>()
  for (const value of universe) {
    const key = regionKey(membership[value] ?? { A: false, B: false, C: false }, 2)
    byRegion.set(key, [...(byRegion.get(key) ?? []), value])
  }

  return (
    <figure className="venn">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${verdict.title} 벤 다이어그램`}>
        <path className="venn-frame" d={framePath()} />
        <line className="venn-leader" {...UNIVERSE_LEADER} />
        <text className="venn-universe-label" x={UNIVERSE_LABEL.x} y={UNIVERSE_LABEL.y}>
          U
        </text>

        {drawn.map((name) => {
          const circle = layout.circles[name]
          const angle = layout.labelAngles[name]
          const label = labelPoint(circle, angle)
          return (
            <Fragment key={name}>
              <path
                className="venn-outline"
                d={openArcPath(circle, angle)}
                data-set={name}
                data-cx={circle.cx}
                data-cy={circle.cy}
                data-r={circle.r}
              />
              <line className="venn-leader" {...leaderLine(circle, angle)} />
              <text className="venn-set-label" x={label.x} y={label.y}>
                {layout.merged ? 'A = B' : name}
              </text>
            </Fragment>
          )
        })}

        {[...byRegion.entries()].map(([key, values]) => {
          const centre = layout.centroids[key]
          if (!centre) return null
          return elementPositions(centre, values.length).map((point, index) => (
            <text key={`${key}-${values[index]}`} className="venn-element" x={point.x} y={point.y}>
              {values[index]}
            </text>
          ))
        })}
      </svg>
      <figcaption>{verdict.title}</figcaption>
    </figure>
  )
}
