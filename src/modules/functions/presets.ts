import type { FunctionPreset } from './hooks/useFunctionState'

export interface Preset {
  id: string
  label: string
  description: string
  config: FunctionPreset
}

/** One quick-start example per major kind — a fast way to jump straight into a
 *  recognizable, well-shaped graph instead of starting from default coefficients. */
export const PRESETS: Preset[] = [
  {
    id: 'linear-decreasing',
    label: '일차함수 — 감소',
    description: '기울기가 음수인 직선을 관찰해요.',
    config: { category: 'polynomial', kind: 'linear', values: { a: -2, b: 3 } },
  },
  {
    id: 'quadratic-max',
    label: '이차함수 — 위로 볼록',
    description: '최댓값을 갖는 포물선을 관찰해요.',
    config: { category: 'polynomial', kind: 'quadratic', values: { a: -1, p: 0, q: 4 } },
  },
  {
    id: 'rational-basic',
    label: '유리함수 — 표준형',
    description: 'y = 2/x 꼴의 반비례 그래프를 관찰해요.',
    config: { category: 'rationalIrrational', kind: 'rational', values: { a: 2, p: 0, q: 0 } },
  },
  {
    id: 'irrational-basic',
    label: '무리함수 — 표준형',
    description: 'y = √x 꼴의 그래프를 관찰해요.',
    config: { category: 'rationalIrrational', kind: 'irrational', values: { a: 1, p: 0, q: 0 } },
  },
  {
    id: 'exponential-growth',
    label: '지수함수 — 증가',
    description: '밑이 1보다 큰 지수함수의 급격한 증가를 관찰해요.',
    config: { category: 'expLog', kind: 'exponential', values: { a: 1, b: 2, p: 0, q: 0 } },
  },
  {
    id: 'logarithmic-growth',
    label: '로그함수 — 증가',
    description: '지수함수와 역함수 관계인 로그함수를 관찰해요.',
    config: { category: 'expLog', kind: 'logarithmic', values: { a: 1, b: 2, p: 0, q: 0 } },
  },
  {
    id: 'sine-basic',
    label: '사인함수 — 기본형',
    description: '진폭과 주기를 갖는 사인 곡선을 관찰해요.',
    config: { category: 'trig', kind: 'sine', values: { a: 2, b: 1, p: 0, q: 0 } },
  },
  {
    id: 'tangent-basic',
    label: '탄젠트함수 — 기본형',
    description: '점근선이 반복되는 탄젠트 그래프를 관찰해요.',
    config: { category: 'trig', kind: 'tangent', values: { a: 1, b: 1, p: 0, q: 0 } },
  },
]
