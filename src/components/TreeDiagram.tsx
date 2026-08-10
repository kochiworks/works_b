import { useMemo, useState } from 'react'
import { buildTree, flattenTree, layoutTree } from '../lib/tree'
import type { ResultCase } from '../lib/types'

/** Above this many leaves the tree gets too tall/slow to be useful — suggest the table view instead. */
const TREE_LEAF_LIMIT = 300

const NODE_RADIUS = 5
const PADDING = 20

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

  const clampedCells = Math.min(Math.max(revealedCells, 0), built.cellNodeBoundaries.length)
  // nodes[0] is always the root; nodes[i] (i ≥ 1) is revealed together with edges[i - 1].
  const nodeRevealCount =
    clampedCells === 0 ? 1 : Math.min(built.cellNodeBoundaries[clampedCells - 1] ?? nodes.length, nodes.length)
  const visibleNodes = nodes.slice(0, nodeRevealCount)
  // The root has no visible marker, so the stub lines running from it to the first
  // level of nodes would just dangle at an empty point — drop those too.
  const visibleEdges = edges.slice(0, Math.max(nodeRevealCount - 1, 0)).filter((edge) => edge.from.key !== 'root')

  const width = layout.width + PADDING * 2
  const height = layout.height + PADDING * 2

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
      <div className={fitToScreen ? 'tree-fit' : 'tree-scroll'}>
        <svg
          width={fitToScreen ? '100%' : width}
          height={fitToScreen ? '100%' : height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio={fitToScreen ? 'xMidYMid meet' : undefined}
          role="img"
          aria-label="경우의 수 수형도"
        >
          <g transform={`translate(${PADDING}, ${PADDING})`}>
            {visibleEdges.map((edge) => (
              <line
                key={edge.key}
                className="tree-edge-enter"
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke="#c3ccdc"
                strokeWidth={1.5}
              />
            ))}
            {visibleNodes.map((node) => (
              <g key={node.key} transform={`translate(${node.x}, ${node.y})`}>
                {node.key !== 'root' && (
                  <circle
                    className="tree-node-enter"
                    r={NODE_RADIUS}
                    fill={node.isLeaf ? '#2f6fed' : '#ffffff'}
                    stroke="#2f6fed"
                    strokeWidth={1.5}
                  />
                )}
                {node.label && (
                  <text
                    className="tree-node-enter"
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
