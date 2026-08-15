import type { ComponentType } from 'react'
import { CombinatoricsPage } from './combinatorics/CombinatoricsPage'
import { FunctionsPage } from './functions/FunctionsPage'
import { NumberSensePage } from './numberSense/NumberSensePage'
import { PlaceValuePage } from './placeValue/PlaceValuePage'
import { ProbabilityPage } from './probability/ProbabilityPage'
import { TransformationsPage } from './transformations/TransformationsPage'

export type ModuleAccent = 'violet' | 'mint' | 'peach' | 'sky' | 'lemon' | 'rose'

export interface ModuleMeta {
  /** Used as the hash route: #/<id> */
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  accent: ModuleAccent
  status: 'available' | 'soon'
  Component?: ComponentType
}

/**
 * Every simulation module the site can show, in display order. Adding a new
 * curriculum unit is meant to be just: build its module folder next to
 * combinatorics/, then add one entry here — the home gallery, routing, and
 * shared header all pick it up automatically.
 */
export const MODULES: ModuleMeta[] = [
  {
    id: 'number-sense',
    title: '수 감각 익히기',
    subtitle: '10알 교구로 만나는 사칙연산',
    description: '원목 수셈판(10알 교구)으로 알을 직접 놓아 보며 덧셈 · 뺄셈 · 곱셈 · 나눗셈의 원리를 눈으로 확인합니다.',
    icon: '🧮',
    accent: 'lemon',
    status: 'available',
    Component: NumberSensePage,
  },
  {
    id: 'place-value',
    title: '가로셈 · 세로셈 탐구기',
    subtitle: '자릿값 구슬 묶음으로 보는 계산 원리',
    description: '수를 백 · 십 · 일 구슬 묶음으로 나타내고, 받아올림 · 받아내림이 일어나는 순간을 가로셈과 세로셈으로 함께 확인합니다.',
    icon: '🔢',
    accent: 'rose',
    status: 'available',
    Component: PlaceValuePage,
  },
  {
    id: 'combinatorics',
    title: '경우의 수 탐색기',
    subtitle: '순열 · 조합 · 중복순열 · 중복조합',
    description: '모든 경우를 표와 수형도로 직접 확인하고, 하나씩 그려지는 과정을 애니메이션으로 관찰해보세요.',
    icon: '🎲',
    accent: 'violet',
    status: 'available',
    Component: CombinatoricsPage,
  },
  {
    id: 'probability',
    title: '확률',
    subtitle: '사건과 확률 계산',
    description: '동전 · 주사위 · 카드 실험을 시뮬레이션하며 확률 개념을 체험합니다.',
    icon: '🎯',
    accent: 'sky',
    status: 'available',
    Component: ProbabilityPage,
  },
  {
    id: 'functions',
    title: '함수의 그래프',
    subtitle: '함수의 개형과 변화',
    description: '계수를 조절하며 그래프가 실시간으로 바뀌는 모습을 관찰합니다.',
    icon: '📈',
    accent: 'mint',
    status: 'available',
    Component: FunctionsPage,
  },
  {
    id: 'transformations',
    title: '도형의 이동',
    subtitle: '평행이동 · 대칭이동 · 회전이동',
    description: '도형을 직접 움직여 보며 이동 규칙을 눈으로 확인합니다.',
    icon: '🔺',
    accent: 'peach',
    status: 'available',
    Component: TransformationsPage,
  },
]
