import { complement, difference, intersect, setOf, union } from './expressions'
import type { SetExpr } from './expressions'

export interface OperationSide {
  /** Notation as the textbook writes it, in KaTeX source. */
  tex: string
  expr: SetExpr
}

export interface OperationEntry {
  id: string
  label: string
  /** How many circles the diagram needs. Chosen by the operation, not separately. */
  setCount: 2 | 3
  group: 'basic' | 'law'
  /** One side for a plain operation; two for a law, drawn side by side. */
  sides: [OperationSide] | [OperationSide, OperationSide]
  /** What the operation means, in the wording of the definition. */
  meaning: string
}

const A = setOf('A')
const B = setOf('B')
const C = setOf('C')

export const OPERATIONS: OperationEntry[] = [
  {
    id: 'union',
    label: '합집합',
    setCount: 2,
    group: 'basic',
    sides: [{ tex: 'A \\cup B', expr: union(A, B) }],
    meaning: 'A에 속하거나 B에 속하는 모든 원소로 이루어진 집합입니다.',
  },
  {
    id: 'intersection',
    label: '교집합',
    setCount: 2,
    group: 'basic',
    sides: [{ tex: 'A \\cap B', expr: intersect(A, B) }],
    meaning: 'A에도 속하고 B에도 속하는 모든 원소로 이루어진 집합입니다.',
  },
  {
    id: 'difference-ab',
    label: '차집합 A − B',
    setCount: 2,
    group: 'basic',
    sides: [{ tex: 'A - B', expr: difference(A, B) }],
    meaning: 'A에는 속하지만 B에는 속하지 않는 원소로 이루어진 집합입니다.',
  },
  {
    id: 'difference-ba',
    label: '차집합 B − A',
    setCount: 2,
    group: 'basic',
    sides: [{ tex: 'B - A', expr: difference(B, A) }],
    meaning: 'B에는 속하지만 A에는 속하지 않는 원소로 이루어진 집합입니다.',
  },
  {
    id: 'complement-a',
    label: '여집합 Aᶜ',
    setCount: 2,
    group: 'basic',
    sides: [{ tex: 'A^{c}', expr: complement(A) }],
    meaning: '전체집합 U의 원소 중 A에 속하지 않는 모든 원소로 이루어진 집합입니다.',
  },
  {
    id: 'complement-b',
    label: '여집합 Bᶜ',
    setCount: 2,
    group: 'basic',
    sides: [{ tex: 'B^{c}', expr: complement(B) }],
    meaning: '전체집합 U의 원소 중 B에 속하지 않는 모든 원소로 이루어진 집합입니다.',
  },
  {
    id: 'union-3',
    label: '합집합 (세 집합)',
    setCount: 3,
    group: 'basic',
    sides: [{ tex: 'A \\cup B \\cup C', expr: union(union(A, B), C) }],
    meaning: '세 집합 중 어느 하나에라도 속하는 모든 원소로 이루어진 집합입니다.',
  },
  {
    id: 'intersection-3',
    label: '교집합 (세 집합)',
    setCount: 3,
    group: 'basic',
    sides: [{ tex: 'A \\cap B \\cap C', expr: intersect(intersect(A, B), C) }],
    meaning: '세 집합 모두에 속하는 원소로 이루어진 집합입니다.',
  },
  {
    id: 'commutative-union',
    label: '교환법칙 (합집합)',
    setCount: 2,
    group: 'law',
    sides: [
      { tex: 'A \\cup B', expr: union(A, B) },
      { tex: 'B \\cup A', expr: union(B, A) },
    ],
    meaning: '두 집합을 합칠 때는 순서를 바꿔도 결과가 같습니다.',
  },
  {
    id: 'commutative-intersection',
    label: '교환법칙 (교집합)',
    setCount: 2,
    group: 'law',
    sides: [
      { tex: 'A \\cap B', expr: intersect(A, B) },
      { tex: 'B \\cap A', expr: intersect(B, A) },
    ],
    meaning: '공통 부분을 찾을 때도 순서를 바꿔도 결과가 같습니다.',
  },
  {
    id: 'de-morgan-union',
    label: '드모르간 법칙 ①',
    setCount: 2,
    group: 'law',
    sides: [
      { tex: '(A \\cup B)^{c}', expr: complement(union(A, B)) },
      { tex: 'A^{c} \\cap B^{c}', expr: intersect(complement(A), complement(B)) },
    ],
    meaning: '합집합의 여집합은 각 여집합의 교집합과 같습니다.',
  },
  {
    id: 'de-morgan-intersection',
    label: '드모르간 법칙 ②',
    setCount: 2,
    group: 'law',
    sides: [
      { tex: '(A \\cap B)^{c}', expr: complement(intersect(A, B)) },
      { tex: 'A^{c} \\cup B^{c}', expr: union(complement(A), complement(B)) },
    ],
    meaning: '교집합의 여집합은 각 여집합의 합집합과 같습니다.',
  },
  {
    id: 'associative-union',
    label: '결합법칙 (합집합)',
    setCount: 3,
    group: 'law',
    sides: [
      { tex: '(A \\cup B) \\cup C', expr: union(union(A, B), C) },
      { tex: 'A \\cup (B \\cup C)', expr: union(A, union(B, C)) },
    ],
    meaning: '세 집합을 합칠 때는 어느 둘을 먼저 묶어도 결과가 같습니다.',
  },
  {
    id: 'associative-intersection',
    label: '결합법칙 (교집합)',
    setCount: 3,
    group: 'law',
    sides: [
      { tex: '(A \\cap B) \\cap C', expr: intersect(intersect(A, B), C) },
      { tex: 'A \\cap (B \\cap C)', expr: intersect(A, intersect(B, C)) },
    ],
    meaning: '세 집합의 공통 부분도 어느 둘을 먼저 묶든 결과가 같습니다.',
  },
  {
    id: 'distributive-1',
    label: '분배법칙 ①',
    setCount: 3,
    group: 'law',
    sides: [
      { tex: 'A \\cap (B \\cup C)', expr: intersect(A, union(B, C)) },
      { tex: '(A \\cap B) \\cup (A \\cap C)', expr: union(intersect(A, B), intersect(A, C)) },
    ],
    meaning: '교집합이 합집합에 분배됩니다. 교과서 문제 5 (1)과 같은 확인입니다.',
  },
  {
    id: 'distributive-2',
    label: '분배법칙 ②',
    setCount: 3,
    group: 'law',
    sides: [
      { tex: 'A \\cup (B \\cap C)', expr: union(A, intersect(B, C)) },
      { tex: '(A \\cup B) \\cap (A \\cup C)', expr: intersect(union(A, B), union(A, C)) },
    ],
    meaning: '합집합이 교집합에 분배됩니다. 교과서 문제 5 (2)와 같은 확인입니다.',
  },
]

export function findOperation(id: string): OperationEntry {
  return OPERATIONS.find((entry) => entry.id === id) ?? OPERATIONS[0]
}

export const GROUP_LABELS: Record<OperationEntry['group'], string> = {
  basic: '기본 연산',
  law: '연산 법칙',
}
