import type { EventOption, Outcome } from './types'

export const COIN_COUNT_MIN = 1
export const COIN_COUNT_MAX = 3
export const DICE_COUNT_MIN = 1
export const DICE_COUNT_MAX = 2

export interface BallGroup {
  id: string
  label: string
  color: string
  count: number
}

export const BALL_GROUP_COUNT_MIN = 0
export const BALL_GROUP_COUNT_MAX = 8

/** Pastel swatch colors pulled from the site's own design tokens so the ball bag
 *  reads as part of the same visual system rather than arbitrary primary colors. */
export const DEFAULT_BALL_GROUPS: BallGroup[] = [
  { id: 'red', label: '빨강', color: '#ff9d87', count: 4 },
  { id: 'blue', label: '파랑', color: '#4fa8e8', count: 3 },
  { id: 'yellow', label: '노랑', color: '#e8b330', count: 2 },
]

/** All 2^count sequences of heads/tails for `count` coins tossed together, e.g.
 *  count=2 → 앞·앞, 앞·뒤, 뒤·앞, 뒤·뒤. */
export function coinSampleSpace(count: number): Outcome[] {
  const outcomes: Outcome[] = []
  const total = 2 ** count
  for (let i = 0; i < total; i++) {
    const faces: string[] = []
    for (let bit = count - 1; bit >= 0; bit--) {
      faces.push((i >> bit) & 1 ? '앞' : '뒤')
    }
    const headsCount = faces.filter((f) => f === '앞').length
    outcomes.push({ id: faces.join(''), label: faces.join(' · '), meta: { headsCount } })
  }
  return outcomes
}

export function coinEventOptions(count: number): EventOption[] {
  const options: EventOption[] = [
    { id: 'all-heads', label: '모두 앞면', matches: (o) => o.meta.headsCount === count },
    { id: 'all-tails', label: '모두 뒷면', matches: (o) => o.meta.headsCount === 0 },
  ]
  if (count > 1) {
    options.push({ id: 'at-least-one-head', label: '적어도 한 개는 앞면', matches: (o) => Number(o.meta.headsCount) >= 1 })
  }
  for (let k = 0; k <= count; k++) {
    options.push({ id: `heads-${k}`, label: `앞면이 정확히 ${k}개`, matches: (o) => o.meta.headsCount === k })
  }
  return options
}

/** All outcomes of rolling `count` dice together — a single number 1~6 for one die,
 *  or every (a, b) pair for two. */
export function diceSampleSpace(count: number): Outcome[] {
  if (count <= 1) {
    return [1, 2, 3, 4, 5, 6].map((v) => ({ id: `${v}`, label: `${v}`, meta: { value: v } }))
  }
  const outcomes: Outcome[] = []
  for (let a = 1; a <= 6; a++) {
    for (let b = 1; b <= 6; b++) {
      outcomes.push({ id: `${a}-${b}`, label: `${a}, ${b}`, meta: { a, b, sum: a + b, isDouble: a === b ? 1 : 0 } })
    }
  }
  return outcomes
}

export function diceEventOptions(count: number): EventOption[] {
  if (count <= 1) {
    const options: EventOption[] = [1, 2, 3, 4, 5, 6].map((v) => ({
      id: `eq-${v}`,
      label: `눈의 수가 ${v}`,
      matches: (o) => o.meta.value === v,
    }))
    options.push(
      { id: 'even', label: '짝수 눈', matches: (o) => Number(o.meta.value) % 2 === 0 },
      { id: 'odd', label: '홀수 눈', matches: (o) => Number(o.meta.value) % 2 === 1 },
      { id: 'multiple-of-3', label: '3의 배수', matches: (o) => Number(o.meta.value) % 3 === 0 },
      { id: 'at-least-4', label: '4 이상', matches: (o) => Number(o.meta.value) >= 4 },
    )
    return options
  }
  const options: EventOption[] = []
  for (let s = 2; s <= 12; s++) {
    options.push({ id: `sum-${s}`, label: `두 눈의 합이 ${s}`, matches: (o) => o.meta.sum === s })
  }
  options.push(
    { id: 'double', label: '두 눈이 같다 (더블)', matches: (o) => o.meta.isDouble === 1 },
    { id: 'sum-even', label: '두 눈의 합이 짝수', matches: (o) => Number(o.meta.sum) % 2 === 0 },
    { id: 'at-least-one-6', label: '적어도 하나가 6', matches: (o) => o.meta.a === 6 || o.meta.b === 6 },
  )
  return options
}

/** Each individual ball is its own equally-likely sample-space element (even ones
 *  sharing a color), matching the textbook "근원사건" framing — favorable outcomes
 *  for "빨간 공" are simply however many red balls are in the bag. */
export function ballSampleSpace(groups: BallGroup[]): Outcome[] {
  const outcomes: Outcome[] = []
  for (const group of groups) {
    for (let i = 0; i < group.count; i++) {
      outcomes.push({ id: `${group.id}-${i}`, label: group.label, color: group.color, meta: { groupId: group.id } })
    }
  }
  return outcomes
}

export function ballEventOptions(groups: BallGroup[]): EventOption[] {
  return groups
    .filter((g) => g.count > 0)
    .map((g) => ({ id: `color-${g.id}`, label: `${g.label} 공 뽑기`, matches: (o) => o.meta.groupId === g.id }))
}
