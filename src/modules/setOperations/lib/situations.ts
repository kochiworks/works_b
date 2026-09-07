/**
 * Step 1 asks the reader to turn a described situation into a set by picking
 * its elements. Each situation carries both notations: the condition it is
 * stated in, and the roster the picking should end up producing.
 */
export interface Situation {
  id: string
  label: string
  /** The situation in words, as a teacher would say it. */
  prompt: string
  /** 조건제시법 written in Korean, e.g. "12의 약수". */
  conditionText?: string
  /** 조건제시법 that is pure mathematics, given as KaTeX source. */
  conditionTex?: string
  /** The numbers offered for picking, in display order. */
  candidates: number[]
  /** The elements that actually belong to the set. */
  answer: number[]
  /** Shown once the set is correct, to name the idea behind it. */
  insight: string
}

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i)

export const SITUATIONS: Situation[] = [
  {
    id: 'divisors-12',
    label: '12의 약수',
    prompt: '12를 나누어떨어지게 하는 자연수를 모두 고르세요.',
    conditionText: '12의 약수',
    candidates: range(1, 12),
    answer: [1, 2, 3, 4, 6, 12],
    insight: '12 = 1×12 = 2×6 = 3×4 이므로 약수는 짝을 이루어 6개가 됩니다.',
  },
  {
    id: 'multiples-4',
    label: '20 이하의 4의 배수',
    prompt: '20보다 크지 않은 4의 배수를 모두 고르세요.',
    conditionText: '20 이하의 4의 배수',
    candidates: range(1, 20),
    answer: [4, 8, 12, 16, 20],
    insight: '4씩 커지는 수열이므로 20 ÷ 4 = 5, 곧 원소가 5개입니다.',
  },
  {
    id: 'primes-20',
    label: '20 이하의 소수',
    prompt: '1과 자기 자신만을 약수로 갖는 수를 모두 고르세요.',
    conditionText: '20 이하의 소수',
    candidates: range(1, 20),
    answer: [2, 3, 5, 7, 11, 13, 17, 19],
    insight: '1은 약수가 하나뿐이라 소수가 아니고, 2는 유일한 짝수 소수입니다.',
  },
  {
    id: 'odd-10',
    label: '10 이하의 홀수',
    prompt: '2로 나누어떨어지지 않는 수를 모두 고르세요.',
    conditionText: '10 이하의 홀수',
    candidates: range(1, 10),
    answer: [1, 3, 5, 7, 9],
    insight: '교과서의 “100 이하의 홀수”도 같은 방식이지만, 원소가 50개라 나열하기보다 조건으로 나타내는 편이 낫습니다.',
  },
  {
    id: 'quadratic-roots',
    label: '(x−3)(x−5)=0의 해',
    prompt: '방정식을 만족시키는 수를 모두 고르세요.',
    conditionTex: '(x-3)(x-5)=0',
    candidates: range(1, 10),
    answer: [3, 5],
    insight: '두 일차식의 곱이 0이 되려면 둘 중 하나가 0이어야 하므로 해는 3과 5뿐입니다.',
  },
  {
    id: 'abs-le-3',
    label: '|x| ≤ 3인 정수',
    prompt: '절댓값이 3보다 크지 않은 정수를 모두 고르세요.',
    conditionTex: '|x| \\le 3,\\ x \\in \\mathbb{Z}',
    candidates: range(-5, 5),
    answer: [-3, -2, -1, 0, 1, 2, 3],
    insight: '0을 가운데 두고 좌우로 3칸씩이므로 원소는 3 + 1 + 3 = 7개입니다.',
  },
  {
    id: 'dice',
    label: '주사위의 눈',
    prompt: '주사위 한 개를 던질 때 나올 수 있는 눈의 수를 모두 고르세요.',
    conditionText: '주사위 한 개를 던져 나오는 눈의 수',
    candidates: range(1, 10),
    answer: [1, 2, 3, 4, 5, 6],
    insight: '실제 상황에서도 집합을 만들 수 있습니다. 여기서는 이 집합이 곧 전체집합이 됩니다.',
  },
]

export interface BuildFeedback {
  correct: boolean
  /** Answer elements the reader has not picked yet. */
  missing: number[]
  /** Picked elements that do not belong. */
  extra: number[]
}

export function gradeSelection(situation: Situation, selected: number[]): BuildFeedback {
  const picked = new Set(selected)
  const answer = new Set(situation.answer)
  const missing = situation.answer.filter((v) => !picked.has(v))
  const extra = selected.filter((v) => !answer.has(v)).sort((a, b) => a - b)
  return { correct: missing.length === 0 && extra.length === 0, missing, extra }
}
