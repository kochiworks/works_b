import { elementPositions, regionKey } from '../lib/regions'
import type { Circle, Point } from '../lib/regions'
import type { RelationVerdict } from '../lib/relations'
import type { Membership } from '../lib/types'

interface Layout {
  circles: { A: Circle; B: Circle }
  nameLabels: { A: Point; B: Point }
  centroids: Record<string, Point>
  /** 서로 같은 집합: one circle carrying both names. */
  merged?: boolean
}

const WIDTH = 360
const HEIGHT = 250
const FRAME = { x: 8, y: 8, w: 344, h: 234 }
const OUTSIDE: Point = { x: 32, y: 222 }

/**
 * The textbook draws each relation its own way — one circle inside another for
 * A ⊂ B, two apart for 서로소 — so the picture changes with the relation rather
 * than always showing the same overlap. Region keys stay the same throughout:
 * an element of A when A ⊂ B is in both sets, so it lives under "AB".
 */
const LAYOUTS: Record<RelationVerdict['layout'], Layout> = {
  overlap: {
    circles: { A: { cx: 145, cy: 120, r: 80 }, B: { cx: 215, cy: 120, r: 80 } },
    nameLabels: { A: { x: 92, y: 30 }, B: { x: 268, y: 30 } },
    centroids: { A: { x: 103, y: 120 }, AB: { x: 180, y: 120 }, B: { x: 257, y: 120 }, '': OUTSIDE },
  },
  disjoint: {
    circles: { A: { cx: 103, cy: 120, r: 66 }, B: { cx: 257, cy: 120, r: 66 } },
    nameLabels: { A: { x: 103, y: 40 }, B: { x: 257, y: 40 } },
    centroids: { A: { x: 103, y: 120 }, AB: { x: 180, y: 120 }, B: { x: 257, y: 120 }, '': OUTSIDE },
  },
  'nested-a-in-b': {
    circles: { A: { cx: 143, cy: 122, r: 50 }, B: { cx: 180, cy: 122, r: 98 } },
    nameLabels: { A: { x: 143, y: 60 }, B: { x: 180, y: 34 } },
    centroids: { A: { x: 143, y: 122 }, AB: { x: 143, y: 122 }, B: { x: 258, y: 122 }, '': OUTSIDE },
  },
  'nested-b-in-a': {
    circles: { A: { cx: 180, cy: 122, r: 98 }, B: { cx: 143, cy: 122, r: 50 } },
    nameLabels: { A: { x: 180, y: 34 }, B: { x: 143, y: 60 } },
    centroids: { A: { x: 258, y: 122 }, AB: { x: 143, y: 122 }, B: { x: 143, y: 122 }, '': OUTSIDE },
  },
  equal: {
    circles: { A: { cx: 180, cy: 122, r: 88 }, B: { cx: 180, cy: 122, r: 88 } },
    nameLabels: { A: { x: 180, y: 24 }, B: { x: 180, y: 24 } },
    centroids: { A: { x: 180, y: 122 }, AB: { x: 180, y: 122 }, B: { x: 180, y: 122 }, '': OUTSIDE },
    merged: true,
  },
}

interface Props {
  verdict: RelationVerdict
  universe: number[]
  membership: Record<number, Membership>
}

export function RelationVenn({ verdict, universe, membership }: Props) {
  const layout = LAYOUTS[verdict.layout]

  const byRegion = new Map<string, number[]>()
  for (const value of universe) {
    const key = regionKey(membership[value] ?? { A: false, B: false, C: false }, 2)
    byRegion.set(key, [...(byRegion.get(key) ?? []), value])
  }

  return (
    <figure className="venn">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${verdict.title} 벤 다이어그램`}>
        <rect className="venn-frame" x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} rx={14} />
        <text className="venn-universe-label" x={FRAME.x + 14} y={FRAME.y + 22}>
          U
        </text>

        <circle className="venn-outline" {...layout.circles.A} />
        {!layout.merged && <circle className="venn-outline" {...layout.circles.B} />}

        {layout.merged ? (
          <text className="venn-set-label" x={layout.nameLabels.A.x} y={layout.nameLabels.A.y}>
            A = B
          </text>
        ) : (
          <>
            <text className="venn-set-label" x={layout.nameLabels.A.x} y={layout.nameLabels.A.y}>
              A
            </text>
            <text className="venn-set-label" x={layout.nameLabels.B.x} y={layout.nameLabels.B.y}>
              B
            </text>
          </>
        )}

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
