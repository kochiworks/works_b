import type { ComponentType } from 'react'
import { CombinatoricsPage } from './combinatorics/CombinatoricsPage'
import { FunctionsPage } from './functions/FunctionsPage'
import { NumberSensePage } from './numberSense/NumberSensePage'
import { PlaceValuePage } from './placeValue/PlaceValuePage'
import { ProbabilityPage } from './probability/ProbabilityPage'
import { TransformationsPage } from './transformations/TransformationsPage'

/**
 * Pastel highlight assigned to every card. Each name has matching
 * `--<name>` / `--<name>-soft` tokens in index.css and an `.accent-<name>`
 * rule in App.css, so adding a colour means touching those three places.
 */
export type Accent = 'violet' | 'mint' | 'peach' | 'sky' | 'lemon' | 'rose'

export type Availability = 'available' | 'soon'

/** A single simulation the learner actually plays with. */
export interface ActivityMeta {
  /** Last segment of the route: #/<subject>/<domain>/<id> */
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  accent: Accent
  status: Availability
  Component?: ComponentType
}

/** A curriculum strand inside a subject — the middle level of the tree. */
export interface DomainMeta {
  /** Middle segment of the route: #/<subject>/<id> */
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  accent: Accent
  activities: ActivityMeta[]
}

/** A school subject — the level the home page lists. */
export interface SubjectMeta {
  /** First segment of the route: #/<id> */
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  accent: Accent
  status: Availability
  domains: DomainMeta[]
}

/**
 * The whole site as one tree: subject → domain → activity. Navigation, routing
 * and every card list are derived from this, so growing the site is meant to be
 * just one of three edits:
 *
 *  - new activity  → build its folder under src/modules/, add an entry to the
 *                    `activities` array of the domain it belongs to
 *  - new domain    → add a DomainMeta to a subject's `domains`
 *  - new subject   → add a SubjectMeta here
 *
 * Domains follow the four strands of the 2022 revised national curriculum so
 * that a teacher can find an activity by the strand name used in their own
 * lesson plan.
 */
export const SUBJECTS: SubjectMeta[] = [
  {
    id: 'math',
    title: '수학',
    subtitle: '수와 연산 · 변화와 관계 · 도형과 측정 · 자료와 가능성',
    description:
      '2022 개정 교육과정의 네 영역을 따라 활동을 정리했습니다. 수업에서 다루는 영역을 고르면 그 영역의 시뮬레이션만 모아서 볼 수 있습니다.',
    icon: '🧠',
    accent: 'violet',
    status: 'available',
    domains: [
      {
        id: 'number-and-operation',
        title: '수와 연산',
        subtitle: '수의 크기 · 자릿값 · 사칙연산',
        description: '수를 눈에 보이는 교구로 바꿔 놓고, 계산이 왜 그렇게 되는지 과정을 하나씩 따라갑니다.',
        icon: '➕',
        accent: 'lemon',
        activities: [
          {
            id: 'number-sense',
            title: '수 감각 익히기',
            subtitle: '10알 교구로 만나는 사칙연산',
            description:
              '원목 수셈판(10알 교구)으로 알을 직접 놓아 보며 덧셈 · 뺄셈 · 곱셈 · 나눗셈의 원리를 눈으로 확인합니다.',
            icon: '🧮',
            accent: 'lemon',
            status: 'available',
            Component: NumberSensePage,
          },
          {
            id: 'place-value',
            title: '가로셈 · 세로셈 탐구기',
            subtitle: '자릿값 구슬 묶음으로 보는 계산 원리',
            description:
              '수를 백 · 십 · 일 구슬 묶음으로 나타내고, 받아올림 · 받아내림이 일어나는 순간을 가로셈과 세로셈으로 함께 확인합니다.',
            icon: '🔢',
            accent: 'rose',
            status: 'available',
            Component: PlaceValuePage,
          },
        ],
      },
      {
        id: 'change-and-relation',
        title: '변화와 관계',
        subtitle: '규칙 · 대응 · 함수',
        description: '두 양이 어떻게 맞물려 변하는지를 식과 그래프를 나란히 놓고 관찰합니다.',
        icon: '🔗',
        accent: 'mint',
        activities: [
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
        ],
      },
      {
        id: 'shape-and-measurement',
        title: '도형과 측정',
        subtitle: '도형의 성질 · 이동 · 측정',
        description: '도형을 직접 움직이고 재어 보며 모양과 위치가 어떤 규칙을 따르는지 살펴봅니다.',
        icon: '📐',
        accent: 'peach',
        activities: [
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
        ],
      },
      {
        id: 'data-and-possibility',
        title: '자료와 가능성',
        subtitle: '경우의 수 · 확률 · 자료의 정리',
        description: '일어날 수 있는 경우를 빠짐없이 세어 보고, 그 결과가 확률로 어떻게 이어지는지 확인합니다.',
        icon: '📊',
        accent: 'sky',
        activities: [
          {
            id: 'combinatorics',
            title: '경우의 수 탐색기',
            subtitle: '순열 · 조합 · 중복순열 · 중복조합',
            description:
              '모든 경우를 표와 수형도로 직접 확인하고, 하나씩 그려지는 과정을 애니메이션으로 관찰해보세요.',
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
        ],
      },
    ],
  },
]

export function findSubject(subjectId: string): SubjectMeta | undefined {
  return SUBJECTS.find((subject) => subject.id === subjectId)
}

export function findDomain(subject: SubjectMeta, domainId: string): DomainMeta | undefined {
  return subject.domains.find((domain) => domain.id === domainId)
}

export function findActivity(domain: DomainMeta, activityId: string): ActivityMeta | undefined {
  return domain.activities.find((activity) => activity.id === activityId)
}

/** Every activity of a subject, flattened in domain order. */
export function subjectActivities(subject: SubjectMeta): ActivityMeta[] {
  return subject.domains.flatMap((domain) => domain.activities)
}

/**
 * Locates an activity by id alone, across the whole tree. Activity ids are
 * unique site-wide, which is what lets the old flat `#/<activityId>` links
 * (shared before the subject/domain levels existed) still resolve.
 */
export function locateActivity(
  activityId: string,
): { subject: SubjectMeta; domain: DomainMeta; activity: ActivityMeta } | undefined {
  for (const subject of SUBJECTS) {
    for (const domain of subject.domains) {
      const activity = findActivity(domain, activityId)
      if (activity) return { subject, domain, activity }
    }
  }
  return undefined
}
