import type { NumberSensePreset } from './hooks/useNumberSenseState'

export interface Preset {
  id: string
  label: string
  description: string
  config: NumberSensePreset
}

/** One quick-start example per notable scenario — covers both the "simple"
 *  and "crosses the ten boundary" case for +/-, and both the "divides evenly"
 *  and "leaves a remainder" case for ÷, since those are the moments where the
 *  bead board actually teaches something new. */
export const PRESETS: Preset[] = [
  {
    id: 'addition-no-carry',
    label: '덧셈 — 10을 넘지 않아요',
    description: '3 + 4처럼 한 줄 안에서 끝나는 간단한 덧셈이에요.',
    config: { kind: 'addition', values: { a: 3, b: 4 } },
  },
  {
    id: 'addition-bridge-ten',
    label: '덧셈 — 10 만들기',
    description: '7 + 5처럼 10을 먼저 만들고 남은 수를 더해요.',
    config: { kind: 'addition', values: { a: 7, b: 5 } },
  },
  {
    id: 'subtraction-no-borrow',
    label: '뺄셈 — 10을 넘지 않아요',
    description: '8 - 3처럼 한 줄 안에서 끝나는 간단한 뺄셈이에요.',
    config: { kind: 'subtraction', values: { a: 8, b: 3 } },
  },
  {
    id: 'subtraction-bridge-ten',
    label: '뺄셈 — 10 아래로 내려가요',
    description: '13 - 6처럼 10을 먼저 만들고 나머지를 더 치워요.',
    config: { kind: 'subtraction', values: { a: 13, b: 6 } },
  },
  {
    id: 'multiplication-basic',
    label: '곱셈 — 3묶음 × 4개',
    description: '한 묶음에 4개씩 3묶음이 있으면 모두 몇 개인지 알아봐요.',
    config: { kind: 'multiplication', values: { a: 3, b: 4 } },
  },
  {
    id: 'multiplication-two-groups',
    label: '곱셈 — 5묶음 × 2개',
    description: '한 묶음에 2개씩 5묶음이 있으면 모두 몇 개인지 알아봐요.',
    config: { kind: 'multiplication', values: { a: 5, b: 2 } },
  },
  {
    id: 'division-exact',
    label: '나눗셈 — 나누어떨어져요',
    description: '12개를 3묶음으로 똑같이 나누면 한 묶음에 몇 개인지 알아봐요.',
    config: { kind: 'division', values: { a: 12, b: 3 } },
  },
  {
    id: 'division-remainder',
    label: '나눗셈 — 나머지가 남아요',
    description: '13개를 4묶음으로 나누면 나머지가 몇 개 남는지 알아봐요.',
    config: { kind: 'division', values: { a: 13, b: 4 } },
  },
]
