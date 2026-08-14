import { DEFAULT_BALL_GROUPS } from './lib/experiments'
import type { ProbabilityPreset } from './hooks/useProbabilityState'

export interface Preset {
  id: string
  label: string
  description: string
  config: ProbabilityPreset
}

/** Canned classroom scenarios — a one-click way to demo each experiment kind instead
 *  of clicking through the settings first. */
export const PRESETS: Preset[] = [
  {
    id: 'coin-two-both-heads',
    label: '동전 2개, 모두 앞면',
    description: '동전 2개를 던져 둘 다 앞면이 나올 확률을 관찰해요.',
    config: { kind: 'coin', coinCount: 2, eventId: 'all-heads' },
  },
  {
    id: 'dice-one-even',
    label: '주사위 1개, 짝수 눈',
    description: '주사위를 굴려 짝수 눈이 나올 확률을 관찰해요.',
    config: { kind: 'dice', diceCount: 1, eventId: 'even' },
  },
  {
    id: 'dice-two-sum-seven',
    label: '주사위 2개, 합이 7',
    description: '주사위 2개를 굴려 두 눈의 합이 7이 될 확률을 관찰해요.',
    config: { kind: 'dice', diceCount: 2, eventId: 'sum-7' },
  },
  {
    id: 'ball-red',
    label: '공 뽑기, 빨간 공',
    description: '빨강 4 · 파랑 3 · 노랑 2개가 든 주머니에서 빨간 공을 뽑을 확률을 관찰해요.',
    config: { kind: 'ball', ballGroups: DEFAULT_BALL_GROUPS, eventId: 'color-red' },
  },
]
