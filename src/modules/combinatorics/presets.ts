import type { Mode } from './lib/types'

export interface Preset {
  id: string
  label: string
  description: string
  mode: Mode
  names: string[]
  r: number
}

/** Canned classroom scenarios — quick, relatable setups a teacher can jump straight into
 *  instead of starting from abstract A/B/C/D letters. */
export const PRESETS: Preset[] = [
  {
    id: 'class-officers',
    label: '반장 · 부반장 뽑기',
    description: '학생 5명 중 반장 1명, 부반장 1명을 순서 있게 뽑아요.',
    mode: 'permutation',
    names: ['민준', '서연', '도윤', '하은', '지호'],
    r: 2,
  },
  {
    id: 'club-reps',
    label: '동아리 대표 뽑기',
    description: '학생 6명 중 대표 3명을 순서 없이 뽑아요.',
    mode: 'combination',
    names: ['가온', '나은', '다인', '라온', '마루', '바다'],
    r: 3,
  },
  {
    id: 'password',
    label: '4자리 비밀번호 만들기',
    description: '숫자 0~9 중 중복을 허용해 4자리를 순서대로 뽑아요.',
    mode: 'permutationWithRepetition',
    names: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    r: 4,
  },
  {
    id: 'ice-cream',
    label: '아이스크림 담기',
    description: '맛 3가지 중 중복을 허용해 5개를 순서 없이 담아요.',
    mode: 'combinationWithRepetition',
    names: ['바닐라', '초코', '딸기'],
    r: 5,
  },
]
