export type RelationKind = 'equal' | 'aSubsetB' | 'bSubsetA' | 'disjoint' | 'overlap'

export interface RelationVerdict {
  kind: RelationKind
  /** Short name of the relation, e.g. "A ⊂ B". */
  title: string
  /** KaTeX source for the relation itself. */
  tex: string
  /** One sentence saying why, in the wording of the textbook. */
  explanation: string
  /** How the diagram should be drawn for this relation. */
  layout: 'equal' | 'nested-a-in-b' | 'nested-b-in-a' | 'disjoint' | 'overlap'
}

const subsetOf = (a: number[], b: number[]): boolean => a.every((v) => b.includes(v))

/**
 * Which of the standard relations holds between A and B. The order matters:
 * equality is checked before containment, since equal sets satisfy both, and
 * the textbook names that case 서로 같은 집합.
 */
export function classifyRelation(a: number[], b: number[]): RelationVerdict {
  const aInB = subsetOf(a, b)
  const bInA = subsetOf(b, a)

  if (aInB && bInA) {
    return {
      kind: 'equal',
      title: '서로 같은 집합',
      tex: 'A = B',
      explanation: '두 집합의 원소가 완전히 같습니다. A ⊂ B 이면서 B ⊂ A 이므로 A = B 입니다.',
      layout: 'equal',
    }
  }
  if (aInB) {
    return {
      kind: 'aSubsetB',
      title: 'A는 B의 진부분집합',
      tex: 'A \\subset B',
      explanation: 'A의 모든 원소가 B에 속하고, B에는 A에 없는 원소가 더 있습니다.',
      layout: 'nested-a-in-b',
    }
  }
  if (bInA) {
    return {
      kind: 'bSubsetA',
      title: 'B는 A의 진부분집합',
      tex: 'B \\subset A',
      explanation: 'B의 모든 원소가 A에 속하고, A에는 B에 없는 원소가 더 있습니다.',
      layout: 'nested-b-in-a',
    }
  }
  if (!a.some((v) => b.includes(v))) {
    return {
      kind: 'disjoint',
      title: '서로소',
      tex: 'A \\cap B = \\varnothing',
      explanation: '두 집합이 공통으로 갖는 원소가 하나도 없습니다.',
      layout: 'disjoint',
    }
  }
  return {
    kind: 'overlap',
    title: '일부만 겹침',
    tex: 'A \\cap B \\ne \\varnothing',
    explanation: '겹치는 원소가 있지만 어느 쪽도 다른 쪽을 모두 담고 있지는 않습니다.',
    layout: 'overlap',
  }
}

/** Cap on how many subsets are listed before only the count is shown. */
export const SUBSET_LIST_LIMIT = 3

/** Every subset of the given elements, shortest first then in element order. */
export function subsetsOf(items: number[]): number[][] {
  let subsets: number[][] = [[]]
  for (const item of items) {
    subsets = subsets.flatMap((existing) => [existing, [...existing, item]])
  }
  return subsets.sort((x, y) => x.length - y.length || compareLists(x, y))
}

function compareLists(x: number[], y: number[]): number {
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    if (x[i] !== y[i]) return x[i] - y[i]
  }
  return 0
}
