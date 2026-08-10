import { useMemo } from 'react'
import { buildTree, flattenTree, layoutTree } from '../lib/tree'
import type { ResultCase } from '../lib/types'

/** Above this many leaves the tree gets too tall/slow to be useful — suggest the table view instead. */
const TREE_LEAF_LIMIT = 300

const NODE_RADIUS = 5
const PADDING = 20

interface Props {
  /** Full, stable case list — the tree's shape is always built from all of it. */
  cases: ResultCase[]
  /** How many cases (from the start) have been "revealed" so far by the build animation. */
  revealedCases: number
}

export function TreeDiagram({ cases, revealedCases }: Props) {
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

  const clampedCases = Math.min(Math.max(revealedCases, 0), cases.length)
  // nodes[0] is always the root; nodes[i] (i ≥ 1) is revealed together with edges[i - 1].
  const nodeRevealCount =
    clampedCases === 0 ? 1 : Math.min(built.caseNodeBoundaries[clampedCases - 1] ?? nodes.length, nodes.length)
  const visibleNodes = nodes.slice(0, nodeRevealCount)
  const visibleEdges = edges.slice(0, Math.max(nodeRevealCount - 1, 0))

  const width = layout.width + PADDING * 2
  const height = layout.height + PADDING * 2

  return (
    <div className="tree-scroll">
      <svg width={width} height={height} role="img" aria-label="경우의 수 수형도">
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
  )
}
