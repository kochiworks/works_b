import type { MembershipSpec } from './hooks/useSetLab'
import type { Stage } from './lib/types'

export interface PresetConfig {
  stage: Stage
  /** Step 1 only: which situation to load. */
  situationId?: string
  /** Steps 2 and 3: how to arrange the universe. */
  membership?: MembershipSpec
  /** Step 3 only: which operation or law to show. */
  operationId?: string
}

export interface Preset {
  id: string
  label: string
  description: string
  config: PresetConfig
}

export const PRESETS: Preset[] = [
  {
    id: 'divisors',
    label: '집합 만들기 — 12의 약수',
    description: '조건으로 주어진 집합을 원소나열법으로 바꿔봐요.',
    config: { stage: 'build', situationId: 'divisors-12' },
  },
  {
    id: 'roots',
    label: '집합 만들기 — 방정식의 해',
    description: '(x−3)(x−5)=0의 해를 원소로 갖는 집합을 만들어요.',
    config: { stage: 'build', situationId: 'quadratic-roots' },
  },
  {
    id: 'subset',
    label: '포함 관계 — A ⊂ B',
    description: 'A의 원소가 모두 B에 들어 있는 모습을 확인해요.',
    config: {
      stage: 'relation',
      membership: { universeSize: 8, A: [2, 3], B: [2, 3, 5, 6] },
    },
  },
  {
    id: 'disjoint',
    label: '포함 관계 — 서로소',
    description: '공통 원소가 하나도 없는 두 집합을 살펴봐요.',
    config: {
      stage: 'relation',
      membership: { universeSize: 8, A: [1, 2, 3], B: [5, 6, 7] },
    },
  },
  {
    id: 'union-intersection',
    label: '합집합과 교집합',
    description: '두 집합을 합칠 때와 겹칠 때 어디가 색칠되는지 봐요.',
    config: { stage: 'operation', operationId: 'union' },
  },
  {
    id: 'complement',
    label: '여집합과 차집합',
    description: '전체집합 U 안에서 A에 속하지 않는 부분을 확인해요.',
    config: { stage: 'operation', operationId: 'complement-a' },
  },
  {
    id: 'de-morgan',
    label: '드모르간 법칙',
    description: '(A∪B)ᶜ 와 Aᶜ∩Bᶜ 의 색칠된 부분을 나란히 비교해요.',
    config: { stage: 'operation', operationId: 'de-morgan-union' },
  },
  {
    id: 'distributive',
    label: '분배법칙 (세 집합)',
    description: 'A∩(B∪C)와 (A∩B)∪(A∩C)를 색칠해 나란히 비교해요.',
    config: { stage: 'operation', operationId: 'distributive-1' },
  },
]
