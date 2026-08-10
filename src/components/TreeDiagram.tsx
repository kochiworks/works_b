import { useEffect, useMemo, useRef, useState } from 'react'
import { buildTree, flattenTree, layoutTree } from '../lib/tree'
import { usePrevious } from '../hooks/usePrevious'
import type { ResultCase } from '../lib/types'

/**
 * Above this many leaves the tree gets too slow to render — suggest the table view
 * instead. Matches ENUMERATE_LIMIT (the shared cap on how many cases get generated at
 * all), since a leaf count can never exceed the case count and browser benchmarking
 * showed both table rows and tree nodes stay under ~1s to render up to this size.
 */
const TREE_LEAF_LIMIT = 5000

/**
 * Above this many newly-revealed nodes in one render (e.g. "전체 보기" on a large
 * tree, or the very first paint), skip the per-node mount animation — see the same
 * constant's comment in ResultTable.tsx for why.
 */
const ANIMATE_JUMP_THRESHOLD = 40

const NODE_RADIUS = 5
const PADDING = 20

/** Target box height for "화면에 맞춰 보기". */
const FIT_BOX_HEIGHT = 520
/**
 * Never shrink below this scale — beyond it, nodes/labels become too small to
 * perceive at all (which is exactly what made the build animation look "stuck"
 * on tall trees). Below this floor we fall back to scrolling instead of shrinking
 * further, so newly-revealed cells stay visible even if not everything fits at once.
 */
const FIT_MIN_SCALE = 0.5

interface Props {
  /** Full, stable case list — the tree's shape is always built from all of it. */
  cases: ResultCase[]
  /** How many cells (one item within one case) have been "revealed" so far by the build animation. */
  revealedCells: number
}

export function TreeDiagram({ cases, revealedCells }: Props) {
  const [fitToScreen, setFitToScreen] = useState(false)
  const built = useMemo(() => buildTree(cases), [cases])
  const layout = useMemo(() => layoutTree(built.root), [built])
  const { nodes, edges } = useMemo(() => flattenTree(layout.root), [layout])

  const clampedCells = Math.min(Math.max(revealedCells, 0), built.cellNodeBoundaries.length)
  // nodes[0] is always the root; nodes[i] (i ≥ 1) is revealed together with edges[i - 1].
  const nodeRevealCount =
    clampedCells === 0 ? 1 : Math.min(built.cellNodeBoundaries[clampedCells - 1] ?? nodes.length, nodes.length)
  const visibleNodes = nodes.slice(0, nodeRevealCount)
  // The root has no visible marker, so the stub lines running from it to the first
  // level of nodes would just dangle at an empty point — drop those too.
  const visibleEdges = edges.slice(0, Math.max(nodeRevealCount - 1, 0)).filter((edge) => edge.from.key !== 'root')

  const previousNodeRevealCount = usePrevious(nodeRevealCount)
  const animate = Math.abs(nodeRevealCount - previousNodeRevealCount) <= ANIMATE_JUMP_THRESHOLD

  const width = layout.width + PADDING * 2
  const height = layout.height + PADDING * 2

  // Only shrink down to FIT_MIN_SCALE — past that, keep the minimum readable size
  // and let the container scroll for the rest, rather than shrinking nodes into
  // invisibility (see FIT_MIN_SCALE comment above).
  const fitScale = fitToScreen ? Math.max(FIT_MIN_SCALE, Math.min(1, FIT_BOX_HEIGHT / height)) : 1
  const renderWidth = fitToScreen ? width * fitScale : width
  const renderHeight = fitToScreen ? height * fitScale : height
  const stillNeedsScroll = fitToScreen && renderHeight > FIT_BOX_HEIGHT

  // As the tree grows taller than its scroll box, keep the just-revealed node in
  // view automatically instead of leaving the viewport pinned at the top.
  const latestNodeRef = useRef<SVGGElement | null>(null)
  useEffect(() => {
    // 'auto' (instant), not 'smooth': at fast playback speeds a new step can fire
    // before the previous smooth-scroll animation finishes, and interrupting an
    // in-flight smooth scroll repeatedly makes the browser overshoot/undershoot
    // instead of tracking the latest node.
    latestNodeRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' })
  }, [nodeRevealCount, fitToScreen])

  if (cases.length === 0) {
    return <p className="hint">조건을 만족하는 경우가 없습니다.</p>
  }

  if (layout.leafCount > TREE_LEAF_LIMIT) {
    return (
      <p className="warning">
        경우의 수가 {cases.length.toLocaleString('ko-KR')}가지로 많아 수형도가 너무 커집니다. 표 보기를
        이용하거나 n·r을 줄여주세요.
      </p>
    )
  }

  return (
    <div>
      <label className="fit-toggle">
        <input
          type="checkbox"
          checked={fitToScreen}
          onChange={(event) => setFitToScreen(event.target.checked)}
        />
        화면에 맞춰 보기 (스크롤 없이)
      </label>
      {stillNeedsScroll && (
        <p className="hint">
          결과가 많아 완전히 맞추면 너무 작아지므로 최소 크기로 표시합니다 (세로 스크롤 가능).
        </p>
      )}
      <div className={fitToScreen ? 'tree-fit' : 'tree-scroll'}>
        <svg
          width={renderWidth}
          height={renderHeight}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="경우의 수 수형도"
        >
          <g transform={`translate(${PADDING}, ${PADDING})`}>
            {visibleEdges.map((edge) => (
              <line
                key={edge.key}
                className={animate ? 'tree-edge-enter' : undefined}
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke="#c3ccdc"
                strokeWidth={1.5}
              />
            ))}
            {visibleNodes.map((node, index) => (
              <g
                key={node.key}
                ref={index === visibleNodes.length - 1 ? latestNodeRef : undefined}
                transform={`translate(${node.x}, ${node.y})`}
              >
                {node.key !== 'root' && (
                  <circle
                    className={animate ? 'tree-node-enter' : undefined}
                    r={NODE_RADIUS}
                    fill={node.isLeaf ? '#2f6fed' : '#ffffff'}
                    stroke="#2f6fed"
                    strokeWidth={1.5}
                  />
                )}
                {node.label && (
                  <text
                    className={animate ? 'tree-node-enter' : undefined}
                    x={NODE_RADIUS + 6}
                    dominantBaseline="central"
                    fontSize={12}
                    fill="#1a2233"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
