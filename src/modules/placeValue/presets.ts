import type { PlaceValuePreset } from './hooks/usePlaceValueState'

export interface Preset {
  id: string
  label: string
  description: string
  config: PlaceValuePreset
}

/** One "받아올림/받아내림 없음" and one "있음" example per operation, plus a
 *  remainder example for 나눗셈 — the moments where 자릿값 구슬 묶음이 실제로
 *  재구성되는(regroup) 장면이 가장 잘 보이는 상황들이다. */
export const PRESETS: Preset[] = [
  {
    id: 'addition-no-carry',
    label: '덧셈 — 받아올림 없어요',
    description: '123 + 456처럼 자리마다 그대로 더해서 끝나요.',
    config: { kind: 'addition', values: { a: 123, b: 456 } },
  },
  {
    id: 'addition-carry',
    label: '덧셈 — 받아올림 있어요',
    description: '234 + 158처럼 10이 모여 윗자리로 올라가는 순간을 살펴봐요.',
    config: { kind: 'addition', values: { a: 234, b: 158 } },
  },
  {
    id: 'subtraction-no-borrow',
    label: '뺄셈 — 받아내림 없어요',
    description: '586 - 243처럼 자리마다 그대로 빼서 끝나요.',
    config: { kind: 'subtraction', values: { a: 586, b: 243 } },
  },
  {
    id: 'subtraction-cascading-borrow',
    label: '뺄셈 — 받아내림이 연이어 일어나요',
    description: '300 - 125처럼 윗자리에서 윗자리로 이어서 묶음을 풀어와요.',
    config: { kind: 'subtraction', values: { a: 300, b: 125 } },
  },
  {
    id: 'multiplication-no-carry',
    label: '곱셈 — 받아올림 없어요',
    description: '211 × 3처럼 자리마다 곱해서 끝나요.',
    config: { kind: 'multiplication', values: { a: 211, b: 3 } },
  },
  {
    id: 'multiplication-carry',
    label: '곱셈 — 받아올림 있어요',
    description: '123 × 4처럼 곱이 10을 넘어 윗자리로 올라가는 순간을 살펴봐요.',
    config: { kind: 'multiplication', values: { a: 123, b: 4 } },
  },
  {
    id: 'division-exact',
    label: '나눗셈 — 나누어떨어져요',
    description: '456 ÷ 3처럼 자리를 내려가며 나누어 몫을 구해요.',
    config: { kind: 'division', values: { a: 456, b: 3 } },
  },
  {
    id: 'division-remainder',
    label: '나눗셈 — 나머지가 남아요',
    description: '100 ÷ 3처럼 끝까지 나눈 뒤에도 나머지가 남는 경우예요.',
    config: { kind: 'division', values: { a: 100, b: 3 } },
  },
]
