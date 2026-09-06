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

/**
 * The four strands of the 2022 revised curriculum. They are no longer a
 * navigation level — the site is browsed by grade and subject — but every
 * activity still carries one, shown as a tag on its card.
 */
export type DomainId =
  | 'number-and-operation'
  | 'change-and-relation'
  | 'shape-and-measurement'
  | 'data-and-possibility'

export const DOMAIN_LABELS: Record<DomainId, string> = {
  'number-and-operation': '수와 연산',
  'change-and-relation': '변화와 관계',
  'shape-and-measurement': '도형과 측정',
  'data-and-possibility': '자료와 가능성',
}

/**
 * A simulation, defined exactly once. The same activity is placed into every
 * grade and subject that teaches it (see CourseEntry) rather than copied, so
 * there is only ever one implementation to fix.
 */
export interface ActivityMeta {
  id: string
  title: string
  /** Used when a placement does not override it with its own note. */
  subtitle: string
  description: string
  icon: string
  accent: Accent
  domain: DomainId
  /** 'soon' keeps the card visible but unlinked. */
  status: 'available' | 'soon'
  Component?: ComponentType
}

export const ACTIVITIES: ActivityMeta[] = [
  {
    id: 'number-sense',
    title: '수 감각 익히기',
    subtitle: '10알 교구로 만나는 사칙연산',
    description:
      '원목 수셈판(10알 교구)으로 알을 직접 놓아 보며 덧셈 · 뺄셈 · 곱셈 · 나눗셈의 원리를 눈으로 확인합니다.',
    icon: '🧮',
    accent: 'lemon',
    domain: 'number-and-operation',
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
    domain: 'number-and-operation',
    status: 'available',
    Component: PlaceValuePage,
  },
  {
    id: 'functions',
    title: '함수의 그래프',
    subtitle: '함수의 개형과 변화',
    description: '계수를 조절하며 그래프가 실시간으로 바뀌는 모습을 관찰합니다.',
    icon: '📈',
    accent: 'mint',
    domain: 'change-and-relation',
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
    domain: 'shape-and-measurement',
    status: 'available',
    Component: TransformationsPage,
  },
  {
    id: 'combinatorics',
    title: '경우의 수 탐색기',
    subtitle: '순열 · 조합 · 중복순열 · 중복조합',
    description: '모든 경우를 표와 수형도로 직접 확인하고, 하나씩 그려지는 과정을 애니메이션으로 관찰해보세요.',
    icon: '🎲',
    accent: 'violet',
    domain: 'data-and-possibility',
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
    domain: 'data-and-possibility',
    status: 'available',
    Component: ProbabilityPage,
  },
]

/**
 * One activity as it appears inside one grade or subject. `note` replaces the
 * activity's own subtitle so the same simulation can be introduced in the
 * words of that course — "일차함수의 그래프" in 중2, "지수 · 로그함수와
 * 삼각함수" in 대수.
 */
export interface CourseEntry {
  activityId: string
  note?: string
}

/** A grade band (초·중) or a subject (고). */
export interface CourseMeta {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  accent: Accent
  /** High-school subject category; grades leave it unset. */
  band?: string
  entries: CourseEntry[]
}

export interface SchoolLevelMeta {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  accent: Accent
  /** Wording of the call to action, since 초·중 pick a grade and 고 a subject. */
  pickLabel: string
  courses: CourseMeta[]
}

/**
 * The whole site as one tree: school level → grade or subject → activity.
 * Navigation, routing and every card list are derived from this, so growing
 * the site is one of three edits:
 *
 *  - new activity → build its folder under src/modules/, add it to ACTIVITIES,
 *                   then list its id in the `entries` of every course that
 *                   teaches it
 *  - new course   → add a CourseMeta to a level's `courses`
 *  - new level    → add a SchoolLevelMeta here
 *
 * A course with no entries renders as a dimmed "준비 중" card, which is how
 * the yet-to-be-filled subjects of the curriculum stay visible as targets.
 *
 * A placement has to match what the simulation actually asks of the reader,
 * not just the name of the unit. Two are deliberately absent from 초등학교:
 *
 *  - 도형의 이동 works on a signed coordinate plane (-8..8) and offers 직선,
 *    원 and 이차함수 alongside polygons, 직선 y=x 대칭 and rotation about the
 *    origin. 초4's 평면도형의 이동 is 밀기 · 뒤집기 · 돌리기 on plain grid
 *    paper, and the coordinate plane itself only arrives in 중1.
 *  - 확률 states P(A) as a fraction, decimal and percentage, and always shows
 *    the binomial-to-normal approximation. 초5~6 only asks for 가능성 in
 *    words and as 0, 1/2, 1.
 *
 * Two more are absent from 중학교 for the same reason:
 *
 *  - 함수의 그래프 is not placed in 중1. It has no 정비례 or 반비례 mode at
 *    all: 정비례 is 일차함수 with b set to 0 ("기울기 a" / "y절편 b", both
 *    중2 vocabulary) and 반비례 is 유리함수 with p and q set to 0 ("점근선"
 *    sliders, 공통수학2 vocabulary). Its 중2 and 중3 placements match exactly.
 *  - 경우의 수 탐색기 is not placed in 중2. Its only modes are 순열 · 조합 ·
 *    중복순열 · 중복조합 and it writes nPr, nCr = nPr ÷ r!, nΠr and nHr in
 *    textbook notation. 중2 counts cases with tables and tree diagrams; the
 *    symbols belong to 확률과 통계.
 */
export const SCHOOL_LEVELS: SchoolLevelMeta[] = [
  {
    id: 'elementary',
    title: '초등학교',
    subtitle: '1~2학년 · 3~4학년 · 5~6학년',
    description:
      '교육과정이 묶는 학년군을 그대로 따랐습니다. 수를 눈에 보이는 교구로 바꿔 놓고 계산의 원리를 손으로 익히는 활동이 모여 있습니다.',
    icon: '🧒',
    accent: 'lemon',
    pickLabel: '학년 고르기',
    courses: [
      {
        id: 'grade-1-2',
        title: '1~2학년',
        subtitle: '수 세기 · 덧셈과 뺄셈 · 곱셈구구',
        description: '수를 하나씩 놓아 보며 더하기와 빼기가 무엇을 하는 일인지부터 익힙니다.',
        icon: '🌱',
        accent: 'lemon',
        entries: [{ activityId: 'number-sense', note: '덧셈 · 뺄셈과 곱셈구구' }],
      },
      {
        id: 'grade-3-4',
        title: '3~4학년',
        subtitle: '세 자리 수의 계산 · 나눗셈 · 평면도형',
        description: '자릿값과 받아올림이 드러나는 계산 과정을 한 자리씩 따라갑니다.',
        icon: '🌿',
        accent: 'peach',
        entries: [
          { activityId: 'place-value', note: '세 자리 수의 덧셈 · 뺄셈과 곱셈 · 나눗셈' },
          { activityId: 'number-sense', note: '나눗셈과 곱셈의 관계' },
        ],
      },
      {
        id: 'grade-5-6',
        title: '5~6학년',
        subtitle: '규칙과 대응 · 비와 비율 · 가능성',
        description: '수의 관계를 식으로 나타내고, 일이 일어날 가능성을 수로 말해보기 시작합니다.',
        icon: '🌳',
        accent: 'rose',
        entries: [],
      },
    ],
  },
  {
    id: 'middle',
    title: '중학교',
    subtitle: '1학년 · 2학년 · 3학년',
    description:
      '문자와 식, 함수, 확률로 넘어가는 시기입니다. 학년별로 그 해에 처음 만나는 개념을 조작해보며 확인할 수 있습니다.',
    icon: '🎒',
    accent: 'mint',
    pickLabel: '학년 고르기',
    courses: [
      {
        id: 'middle-1',
        title: '1학년',
        subtitle: '정수와 유리수 · 문자와 식 · 좌표평면과 그래프',
        description: '좌표평면 위에서 두 양의 관계를 그래프로 나타내는 것을 처음 다루는 학년입니다.',
        icon: '1️⃣',
        accent: 'mint',
        entries: [],
      },
      {
        id: 'middle-2',
        title: '2학년',
        subtitle: '일차함수 · 경우의 수와 확률 · 도형의 성질',
        description: '일차함수의 그래프가 계수에 따라 어떻게 변하는지 살피고, 시행을 반복하며 확률을 확인합니다.',
        icon: '2️⃣',
        accent: 'sky',
        entries: [
          { activityId: 'functions', note: '일차함수의 그래프' },
          { activityId: 'probability', note: '확률과 그 기본 성질' },
        ],
      },
      {
        id: 'middle-3',
        title: '3학년',
        subtitle: '이차방정식 · 이차함수 · 삼각비',
        description: '이차함수의 그래프를 계수별로 움직여 보며 포물선의 꼴을 익힙니다.',
        icon: '3️⃣',
        accent: 'violet',
        entries: [{ activityId: 'functions', note: '이차함수의 그래프' }],
      },
    ],
  },
  {
    id: 'high',
    title: '고등학교',
    subtitle: '공통 · 일반 선택 · 진로 선택 · 융합 선택',
    description:
      '2022 개정 교육과정의 수학 과목을 그대로 두었습니다. 아직 활동이 없는 과목도 자리를 남겨 두어, 채워야 할 곳이 한눈에 보이도록 했습니다.',
    icon: '🎓',
    accent: 'violet',
    pickLabel: '과목 고르기',
    courses: [
      {
        id: 'common-math-1',
        title: '공통수학1',
        subtitle: '다항식 · 방정식과 부등식 · 경우의 수',
        description: '고등학교 수학의 출발점이 되는 공통 과목입니다.',
        icon: '📘',
        accent: 'violet',
        band: '공통',
        entries: [],
      },
      {
        id: 'common-math-2',
        title: '공통수학2',
        subtitle: '도형의 방정식 · 집합과 명제 · 함수와 그래프',
        description: '좌표평면 위에서 도형을 다루고, 유리함수와 무리함수의 그래프를 익힙니다.',
        icon: '📙',
        accent: 'violet',
        band: '공통',
        entries: [
          { activityId: 'transformations', note: '평행이동과 대칭이동' },
          { activityId: 'functions', note: '유리함수와 무리함수' },
        ],
      },
      {
        id: 'algebra',
        title: '대수',
        subtitle: '지수함수와 로그함수 · 삼각함수 · 수열',
        description: '지수 · 로그 · 삼각함수의 그래프가 밑과 주기에 따라 어떻게 달라지는지 관찰합니다.',
        icon: '🔣',
        accent: 'sky',
        band: '일반 선택',
        entries: [{ activityId: 'functions', note: '지수 · 로그함수와 삼각함수' }],
      },
      {
        id: 'calculus-1',
        title: '미적분Ⅰ',
        subtitle: '함수의 극한과 연속 · 미분 · 적분',
        description: '다항함수의 미분과 적분을 다루는 일반 선택 과목입니다.',
        icon: '♾️',
        accent: 'sky',
        band: '일반 선택',
        entries: [],
      },
      {
        id: 'probability-statistics',
        title: '확률과 통계',
        subtitle: '경우의 수 · 확률 · 통계',
        description: '순열과 조합으로 경우의 수를 세고, 그것이 확률 계산으로 이어지는 과정을 확인합니다.',
        icon: '📊',
        accent: 'sky',
        band: '일반 선택',
        entries: [
          { activityId: 'combinatorics', note: '순열과 조합' },
          { activityId: 'probability', note: '확률의 계산' },
        ],
      },
      {
        id: 'geometry',
        title: '기하',
        subtitle: '이차곡선 · 평면벡터 · 공간도형과 공간좌표',
        description: '이차곡선과 벡터를 다루는 진로 선택 과목입니다.',
        icon: '📐',
        accent: 'mint',
        band: '진로 선택',
        entries: [],
      },
      {
        id: 'calculus-2',
        title: '미적분Ⅱ',
        subtitle: '수열의 극한 · 미분법 · 적분법',
        description: '초월함수까지 넓힌 미분과 적분을 다루는 진로 선택 과목입니다.',
        icon: '🌀',
        accent: 'mint',
        band: '진로 선택',
        entries: [],
      },
      {
        id: 'economic-math',
        title: '경제 수학',
        subtitle: '수와 경제 · 함수와 경제 · 자료의 분석',
        description: '경제 현상을 수와 함수로 설명하는 진로 선택 과목입니다.',
        icon: '💹',
        accent: 'mint',
        band: '진로 선택',
        entries: [],
      },
      {
        id: 'ai-math',
        title: '인공지능 수학',
        subtitle: '자료의 표현 · 분류와 예측 · 최적화',
        description: '인공지능이 쓰는 수학적 도구를 다루는 진로 선택 과목입니다.',
        icon: '🤖',
        accent: 'mint',
        band: '진로 선택',
        entries: [],
      },
      {
        id: 'job-math',
        title: '직무 수학',
        subtitle: '직무 상황에서의 수 · 도형 · 자료',
        description: '직업 현장의 문제를 수학으로 다루는 진로 선택 과목입니다.',
        icon: '🛠️',
        accent: 'mint',
        band: '진로 선택',
        entries: [],
      },
      {
        id: 'math-culture',
        title: '수학과 문화',
        subtitle: '수학과 예술 · 사회 · 인류 문명',
        description: '수학이 문화 속에서 어떻게 쓰였는지 살피는 융합 선택 과목입니다.',
        icon: '🎨',
        accent: 'peach',
        band: '융합 선택',
        entries: [],
      },
      {
        id: 'practical-statistics',
        title: '실용 통계',
        subtitle: '자료 수집 · 정리와 분석 · 통계적 추정',
        description: '실제 자료를 모아 분석하고 해석하는 융합 선택 과목입니다.',
        icon: '📋',
        accent: 'peach',
        band: '융합 선택',
        entries: [],
      },
      {
        id: 'math-inquiry',
        title: '수학과제 탐구',
        subtitle: '과제 탐구의 방법 · 실행 · 발표',
        description: '스스로 주제를 정해 수학적으로 탐구하는 융합 선택 과목입니다.',
        icon: '🔎',
        accent: 'peach',
        band: '융합 선택',
        entries: [],
      },
    ],
  },
]

/** One entry of a course with its activity already resolved. */
export interface ResolvedEntry {
  activity: ActivityMeta
  /** Course-specific subtitle, falling back to the activity's own. */
  label: string
}

export function findLevel(levelId: string): SchoolLevelMeta | undefined {
  return SCHOOL_LEVELS.find((level) => level.id === levelId)
}

export function findCourse(level: SchoolLevelMeta, courseId: string): CourseMeta | undefined {
  return level.courses.find((course) => course.id === courseId)
}

export function findActivity(activityId: string): ActivityMeta | undefined {
  return ACTIVITIES.find((activity) => activity.id === activityId)
}

/** The activities a course lists, skipping ids that no longer exist. */
export function courseEntries(course: CourseMeta): ResolvedEntry[] {
  return course.entries.flatMap((entry) => {
    const activity = findActivity(entry.activityId)
    return activity ? [{ activity, label: entry.note ?? activity.subtitle }] : []
  })
}

/** Whether a course has anything a reader can actually open. */
export function isCourseOpen(course: CourseMeta): boolean {
  return courseEntries(course).some(({ activity }) => isActivityOpen(activity))
}

export function isActivityOpen(activity: ActivityMeta): boolean {
  return activity.status === 'available' && activity.Component !== undefined
}

/** Distinct activities available anywhere under a level, counted once each. */
export function levelActivityCount(level: SchoolLevelMeta): number {
  const ids = new Set<string>()
  for (const course of level.courses) {
    for (const { activity } of courseEntries(course)) {
      if (isActivityOpen(activity)) ids.add(activity.id)
    }
  }
  return ids.size
}

/**
 * Where an activity lives when all we know is its id — the first course that
 * lists it, in registry order. Used to give bare `#/<activityId>` links (and
 * the retired `#/math/<domain>/<activityId>` ones) somewhere to land.
 */
export function primaryPlacement(
  activityId: string,
): { level: SchoolLevelMeta; course: CourseMeta; activity: ActivityMeta } | undefined {
  const activity = findActivity(activityId)
  if (!activity) return undefined
  for (const level of SCHOOL_LEVELS) {
    for (const course of level.courses) {
      if (course.entries.some((entry) => entry.activityId === activityId)) {
        return { level, course, activity }
      }
    }
  }
  return undefined
}

/** Courses of a level grouped by their band, in registry order. */
export function courseBands(level: SchoolLevelMeta): { band: string | undefined; courses: CourseMeta[] }[] {
  const groups: { band: string | undefined; courses: CourseMeta[] }[] = []
  for (const course of level.courses) {
    const last = groups[groups.length - 1]
    if (last && last.band === course.band) last.courses.push(course)
    else groups.push({ band: course.band, courses: [course] })
  }
  return groups
}
