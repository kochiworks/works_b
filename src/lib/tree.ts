import type { ResultCase } from './types'

export interface TreeNode {
  key: string
  label: string
  isLeaf: boolean
  children: TreeNode[]
}

export interface BuiltTree {
  root: TreeNode
  /**
   * Cumulative node count (including the root) right after each case finished being
   * inserted, in generation order. `caseNodeBoundaries.length === cases.length`.
   * Used to drive the build-up animation: revealing the first N nodes of the
   * (depth-first, insertion-ordered) node list is equivalent to having replayed the
   * first `caseNodeBoundaries.indexOf(...)`-th case.
   */
  caseNodeBoundaries: number[]
}

/** Builds a prefix tree (trie) from the enumerated cases, merging shared prefixes. */
export function buildTree(cases: ResultCase[]): BuiltTree {
  const root: TreeNode = { key: 'root', label: '', isLeaf: cases.length === 0, children: [] }
  const childMaps = new WeakMap<TreeNode, Map<string, TreeNode>>()
  const caseNodeBoundaries: number[] = []
  let nodeCount = 1 // root

  const childMapOf = (node: TreeNode): Map<string, TreeNode> => {
    let map = childMaps.get(node)
    if (!map) {
      map = new Map()
      childMaps.set(node, map)
    }
    return map
  }

  for (const kase of cases) {
    let current = root
    for (let depth = 0; depth < kase.length; depth++) {
      const item = kase[depth]
      const mapKey = `${item.id}#${depth}`
      const map = childMapOf(current)
      let child = map.get(mapKey)
      if (!child) {
        child = { key: `${current.key}>${mapKey}`, label: item.name, isLeaf: false, children: [] }
        map.set(mapKey, child)
        current.children.push(child)
        nodeCount += 1
      }
      current = child
    }
    current.isLeaf = true
    caseNodeBoundaries.push(nodeCount)
  }

  return { root, caseNodeBoundaries }
}

export interface PositionedNode extends TreeNode {
  x: number
  y: number
  children: PositionedNode[]
}

export interface TreeLayout {
  root: PositionedNode
  width: number
  height: number
  leafCount: number
}

/**
 * Left-to-right ("vertical") layout: depth maps to x (bounded by r, so this stays
 * narrow), leaf order maps to y (unbounded, so the diagram grows tall and scrolls
 * vertically instead of spreading wide). Parents are centered over their children on y.
 */
export function layoutTree(root: TreeNode, levelWidth = 108, leafSlot = 32): TreeLayout {
  let leafIndex = 0
  let maxDepth = 0

  function assign(node: TreeNode, depth: number): PositionedNode {
    maxDepth = Math.max(maxDepth, depth)
    if (node.children.length === 0) {
      const y = leafIndex * leafSlot + leafSlot / 2
      leafIndex += 1
      return { ...node, x: depth * levelWidth, y, children: [] }
    }
    const children = node.children.map((child) => assign(child, depth + 1))
    const y = children.reduce((sum, child) => sum + child.y, 0) / children.length
    return { ...node, x: depth * levelWidth, y, children }
  }

  const positionedRoot = assign(root, 0)
  const leafCount = Math.max(leafIndex, 1)

  return {
    root: positionedRoot,
    width: (maxDepth + 1) * levelWidth,
    height: leafCount * leafSlot,
    leafCount,
  }
}

export interface TreeEdge {
  key: string
  from: PositionedNode
  to: PositionedNode
}

/**
 * Flattens the positioned tree into a depth-first, insertion-ordered node list and a
 * parent→child edge list for SVG rendering. Because children arrays preserve creation
 * order, `nodes[i]` (for i ≥ 1) is always revealed together with `edges[i - 1]` — that
 * pairing is what the build animation's single `revealCount` steps through.
 */
export function flattenTree(root: PositionedNode): { nodes: PositionedNode[]; edges: TreeEdge[] } {
  const nodes: PositionedNode[] = []
  const edges: TreeEdge[] = []

  function walk(node: PositionedNode) {
    nodes.push(node)
    for (const child of node.children) {
      edges.push({ key: `${node.key}->${child.key}`, from: node, to: child })
      walk(child)
    }
  }

  walk(root)
  return { nodes, edges }
}
