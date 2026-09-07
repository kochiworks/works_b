export type SetName = 'A' | 'B' | 'C'

/** Which of the named sets one element belongs to. */
export type Membership = Record<SetName, boolean>

export const SET_NAMES: SetName[] = ['A', 'B', 'C']

/** The three steps of the activity, in the order they are meant to be worked. */
export type Stage = 'build' | 'relation' | 'operation'

export const STAGE_LABELS: Record<Stage, string> = {
  build: '집합 만들기',
  relation: '포함 관계',
  operation: '집합의 연산',
}

export const STAGE_ICONS: Record<Stage, string> = {
  build: '📝',
  relation: '⊂',
  operation: '∪',
}

export const STAGE_HINTS: Record<Stage, string> = {
  build: '주어진 상황에 맞는 원소를 골라 집합을 만들어 봅니다.',
  relation: '두 집합의 원소를 바꿔가며 포함 관계가 어떻게 달라지는지 살펴봅니다.',
  operation: '합집합 · 교집합 · 차집합 · 여집합을 벤 다이어그램으로 확인합니다.',
}

export const UNIVERSE_MIN = 6
export const UNIVERSE_MAX = 12

/** Renders {1, 2, 3} — or the empty-set symbol — as KaTeX source. */
export function roster(values: number[]): string {
  if (values.length === 0) return '\\varnothing'
  return `\\{${values.join(',\\ ')}\\}`
}

/** Membership with C forced off, for the two-set views. */
export function project(membership: Membership, setCount: 2 | 3): Membership {
  return setCount === 3 ? membership : { A: membership.A, B: membership.B, C: false }
}

export function emptyMembership(): Membership {
  return { A: false, B: false, C: false }
}
