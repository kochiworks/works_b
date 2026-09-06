import type { AngleData, AngleDeg } from './types'

const SQRT3 = Math.sqrt(3)
const SQRT2 = Math.sqrt(2)

/**
 * Every special angle, with its right triangle already worked out. The side
 * lengths are the textbook ones — 1 : √3 : 2 for 30°/60°, 1 : 1 : √2 for 45° —
 * so the drawing is to scale and each ratio is literally "one side length over
 * another" that the reader can see.
 */
export const ANGLE_DATA: Record<AngleDeg, AngleData> = {
  30: {
    deg: 30,
    opp: 1,
    adj: SQRT3,
    hyp: 2,
    sideTex: { opp: '1', adj: '\\sqrt{3}', hyp: '2' },
    ratios: {
      sin: { tex: '\\dfrac{1}{2}', approx: 0.5, parts: { numer: 'opp', denom: 'hyp' } },
      cos: { tex: '\\dfrac{\\sqrt{3}}{2}', approx: 0.866, parts: { numer: 'adj', denom: 'hyp' } },
      tan: { tex: '\\dfrac{1}{\\sqrt{3}}', approx: 0.577, parts: { numer: 'opp', denom: 'adj' } },
    },
    companion: 'equilateral-down',
    reason: '한 변의 길이가 2인 정삼각형을 절반으로 자른 모양입니다. 30°의 대변은 정삼각형 한 변의 절반이므로 빗변의 1/2 입니다.',
  },
  45: {
    deg: 45,
    opp: 1,
    adj: 1,
    hyp: SQRT2,
    sideTex: { opp: '1', adj: '1', hyp: '\\sqrt{2}' },
    ratios: {
      sin: { tex: '\\dfrac{\\sqrt{2}}{2}', approx: 0.707, parts: { numer: 'opp', denom: 'hyp' } },
      cos: { tex: '\\dfrac{\\sqrt{2}}{2}', approx: 0.707, parts: { numer: 'adj', denom: 'hyp' } },
      tan: { tex: '1', approx: 1, parts: { numer: 'opp', denom: 'adj' } },
    },
    companion: 'square',
    reason: '한 변의 길이가 1인 정사각형을 대각선으로 자른 모양입니다. 두 예각이 모두 45°라 대변과 밑변의 길이가 같고, 빗변은 대각선이라 √2 입니다.',
  },
  60: {
    deg: 60,
    opp: SQRT3,
    adj: 1,
    hyp: 2,
    sideTex: { opp: '\\sqrt{3}', adj: '1', hyp: '2' },
    ratios: {
      sin: { tex: '\\dfrac{\\sqrt{3}}{2}', approx: 0.866, parts: { numer: 'opp', denom: 'hyp' } },
      cos: { tex: '\\dfrac{1}{2}', approx: 0.5, parts: { numer: 'adj', denom: 'hyp' } },
      tan: { tex: '\\sqrt{3}', approx: 1.732, parts: { numer: 'opp', denom: 'adj' } },
    },
    companion: 'equilateral-right',
    reason: '한 변의 길이가 2인 정삼각형을 절반으로 자른 모양입니다. 60°의 밑변은 정삼각형 한 변의 절반, 대변은 정삼각형의 높이(√3) 입니다.',
  },
}

export const ANGLE_ORDER: AngleDeg[] = [30, 45, 60]

export { SQRT2, SQRT3 }
