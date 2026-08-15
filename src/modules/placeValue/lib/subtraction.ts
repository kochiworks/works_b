import { EMPTY_DIGITS, toDigits } from './digits'
import type { PlaceDigits } from './digits'
import type { ColumnStage, ColumnState, OperationOutcome, PlaceKey } from './types'

function blankColumn(digitA: number, digitB: number): ColumnState {
  return { digitA, digitB, active: false, done: false }
}

/** 뺄셈: processes 일→십→백 (right to left). Whenever a place's own digit
 *  (after any borrow already taken from it) is smaller than what needs to be
 *  removed, it borrows a bundle from the next place up — breaking one
 *  10-bundle into 10 of the current place — exactly the reverse of 덧셈's
 *  carry. `carryIn` on a column here means "10 borrowed in from the left
 *  neighbor"; `lentTen` marks a column that had to lend one of its own
 *  bundles to its right neighbor. */
export function computeSubtraction(a: number, b: number): OperationOutcome {
  const A = toDigits(a)
  const B = toDigits(b)

  const columns: Record<PlaceKey, ColumnState> = {
    hundreds: blankColumn(A.hundreds, B.hundreds),
    tens: blankColumn(A.tens, B.tens),
    ones: blankColumn(A.ones, B.ones),
  }
  const stages: ColumnStage[] = [
    {
      variant: 'columns',
      columns: structuredClone(columns),
      blocksA: A,
      blocksB: B,
      blocksResult: { ...EMPTY_DIGITS },
      horizontalLines: [],
      caption: '처음 수와 빼는 수를 백 · 십 · 일 구슬 묶음으로 나타냈어요. 일의 자리부터 계산해요.',
    },
  ]

  const result: PlaceDigits = { ...EMPTY_DIGITS }
  const lines: string[] = []

  // 일의 자리
  let effOnes = A.ones
  const borrowToOnes = effOnes < B.ones ? 1 : 0
  if (borrowToOnes) effOnes += 10
  result.ones = effOnes - B.ones
  columns.ones = { ...columns.ones, resultDigit: result.ones, done: true }
  if (borrowToOnes) {
    columns.ones = { ...columns.ones, carryIn: 1 }
    columns.tens = { ...columns.tens, lentTen: true }
  }
  lines.push(
    borrowToOnes
      ? `일의 자리: ${A.ones}에서 ${B.ones}를 뺄 수 없어 십의 자리 묶음 1개를 풀어와요 → ${effOnes} - ${B.ones} = ${result.ones}`
      : `일의 자리: ${A.ones} - ${B.ones} = ${result.ones}`,
  )
  stages.push({
    variant: 'columns',
    place: 'ones',
    columns: structuredClone(columns),
    blocksA: A,
    blocksB: B,
    blocksResult: { ...result },
    horizontalLines: [...lines],
    caption: borrowToOnes
      ? `십의 자리 묶음 1개(10개)를 풀어 일의 자리로 가져왔어요.`
      : `일의 자리 계산을 마쳤어요.`,
  })

  // 십의 자리
  let effTens = A.tens - borrowToOnes
  const borrowToTens = effTens < B.tens ? 1 : 0
  if (borrowToTens) effTens += 10
  result.tens = effTens - B.tens
  columns.tens = { ...columns.tens, resultDigit: result.tens, done: true }
  if (borrowToTens) {
    columns.tens = { ...columns.tens, carryIn: 1 }
    columns.hundreds = { ...columns.hundreds, lentTen: true }
  }
  // The pre-add-back value (A.tens - borrowToOnes) can be -1 in the rare case
  // where 십의 자리 itself was 0 and had nothing to lend — phrase that case in
  // words instead of ever printing a negative number to a young learner.
  const tensHadNothingToLend = borrowToOnes && A.tens === 0
  let tensLine: string
  if (tensHadNothingToLend) {
    tensLine = `십의 자리: 0은 일의 자리에 10을 빌려줄 것도 없어서, 백의 자리 묶음 1개를 먼저 풀어와요 → ${effTens} - ${B.tens} = ${result.tens}`
  } else {
    const tensStart = borrowToOnes ? `${A.tens} - 1(빌려줌)` : `${A.tens}`
    const tensBeforeSecondBorrow = A.tens - borrowToOnes
    tensLine = borrowToTens
      ? `십의 자리: ${tensStart} = ${tensBeforeSecondBorrow}에서 ${B.tens}를 뺄 수 없어 백의 자리 묶음 1개를 풀어와요 → ${effTens} - ${B.tens} = ${result.tens}`
      : `십의 자리: ${tensStart} = ${tensBeforeSecondBorrow} → ${tensBeforeSecondBorrow} - ${B.tens} = ${result.tens}`
  }
  lines.push(tensLine)
  stages.push({
    variant: 'columns',
    place: 'tens',
    columns: structuredClone(columns),
    blocksA: A,
    blocksB: B,
    blocksResult: { ...result },
    horizontalLines: [...lines],
    caption: borrowToTens
      ? `백의 자리 묶음 1개(100개)를 풀어 십의 자리로 가져왔어요.`
      : `십의 자리 계산을 마쳤어요.`,
  })

  // 백의 자리
  const effHundreds = A.hundreds - borrowToTens
  result.hundreds = effHundreds - B.hundreds
  columns.hundreds = { ...columns.hundreds, resultDigit: result.hundreds, done: true }
  const hundredsStart = borrowToTens ? `${A.hundreds} - 1(빌려줌)` : `${A.hundreds}`
  lines.push(`백의 자리: ${hundredsStart} = ${effHundreds} → ${effHundreds} - ${B.hundreds} = ${result.hundreds}`)
  const value = result.hundreds * 100 + result.tens * 10 + result.ones
  stages.push({
    variant: 'columns',
    place: 'hundreds',
    columns: structuredClone(columns),
    blocksA: A,
    blocksB: B,
    blocksResult: { ...result },
    horizontalLines: [...lines],
    caption: `계산 완료! ${a} - ${b} = ${value}`,
  })

  return { value, stages }
}
