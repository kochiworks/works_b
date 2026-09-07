import { Fragment } from 'react'
import { allRegions, elementPositions, geometryFor, regionKey } from '../lib/regions'
import type { Circle, VennGeometry } from '../lib/regions'
import type { Membership, SetName } from '../lib/types'

interface Props {
  /** Unique per diagram on the page — two are shown side by side for a law. */
  idPrefix: string
  setCount: 2 | 3
  /** Regions to fill, as membership signatures. */
  shaded: Membership[]
  universe: number[]
  membership: Record<number, Membership>
  caption?: string
}

/**
 * The fixed textbook arrangement — two overlapping circles, or three — with the
 * regions of the chosen expression filled in and every element of U written
 * where it belongs.
 *
 * Regions are cut out with nested SVG masks rather than computed lens paths:
 * one mask per set marks its inside, another its outside, and nesting them
 * multiplies, so A ∩ B ∩ Cᶜ is just three masks wrapped around a rectangle.
 * Every region is built the same way, whatever its shape.
 */
export function VennDiagram({ idPrefix, setCount, shaded, universe, membership, caption }: Props) {
  const geo = geometryFor(setCount)
  const names: SetName[] = setCount === 3 ? ['A', 'B', 'C'] : ['A', 'B']
  const shadedKeys = new Set(shaded.map((region) => regionKey(region, setCount)))

  const byRegion = new Map<string, number[]>()
  for (const value of universe) {
    const key = regionKey(membership[value] ?? { A: false, B: false, C: false }, setCount)
    byRegion.set(key, [...(byRegion.get(key) ?? []), value])
  }

  return (
    <figure className="venn">
      <svg viewBox={`0 0 ${geo.width} ${geo.height}`} role="img" aria-label={caption ?? '벤 다이어그램'}>
        <defs>
          {names.map((name) => (
            <Fragment key={name}>
              <mask id={`${idPrefix}-in-${name}`}>
                <rect x={0} y={0} width={geo.width} height={geo.height} fill="black" />
                <circle {...circleOf(geo, name)} fill="white" />
              </mask>
              <mask id={`${idPrefix}-out-${name}`}>
                <rect x={0} y={0} width={geo.width} height={geo.height} fill="white" />
                <circle {...circleOf(geo, name)} fill="black" />
              </mask>
            </Fragment>
          ))}
        </defs>

        <rect
          className="venn-frame"
          x={geo.frame.x}
          y={geo.frame.y}
          width={geo.frame.w}
          height={geo.frame.h}
          rx={14}
        />
        <text className="venn-universe-label" x={geo.frame.x + 14} y={geo.frame.y + 22}>
          U
        </text>

        {allRegions(setCount)
          .filter((region) => shadedKeys.has(regionKey(region, setCount)))
          .map((region) => (
            <RegionFill key={regionKey(region, setCount)} idPrefix={idPrefix} geo={geo} names={names} region={region} />
          ))}

        {names.map((name) => (
          <circle key={name} className="venn-outline" {...circleOf(geo, name)} />
        ))}

        {names.map((name) => {
          const label = geo.nameLabels[name]
          return label ? (
            <text key={name} className="venn-set-label" x={label.x} y={label.y}>
              {name}
            </text>
          ) : null
        })}

        {[...byRegion.entries()].map(([key, values]) => {
          const centre = geo.centroids[key]
          if (!centre) return null
          return elementPositions(centre, values.length).map((point, index) => (
            <text key={`${key}-${values[index]}`} className="venn-element" x={point.x} y={point.y}>
              {values[index]}
            </text>
          ))
        })}
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/**
 * One region, filled. Starting from a rectangle covering U, each set masks it
 * down to that set's inside or outside; what survives all of them is exactly
 * the region.
 */
function RegionFill({
  idPrefix,
  geo,
  names,
  region,
}: {
  idPrefix: string
  geo: VennGeometry
  names: SetName[]
  region: Membership
}) {
  let node = (
    <rect
      className="venn-shade"
      x={geo.frame.x}
      y={geo.frame.y}
      width={geo.frame.w}
      height={geo.frame.h}
      rx={14}
    />
  )
  for (const name of names) {
    node = <g mask={`url(#${idPrefix}-${region[name] ? 'in' : 'out'}-${name})`}>{node}</g>
  }
  return node
}

function circleOf(geo: VennGeometry, name: SetName): Circle {
  const circle = geo.circles[name]
  if (!circle) throw new Error(`벤 다이어그램에 ${name} 원이 없습니다`)
  return circle
}
