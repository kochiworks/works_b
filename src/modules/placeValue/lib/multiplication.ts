import { EMPTY_DIGITS, toDigits } from './digits'
import type { PlaceDigits } from './digits'
import type { ColumnStage, ColumnState, OperationOutcome, PlaceKey } from './types'

function blankColumn(digitA: number, digitB: number): ColumnState {
  return { digitA, digitB, active: false, done: false }
}

/** 곱셈 (여러 자리 수 × 한 자리 수): each place of the multiplicand is
 *  multiplied by the single-digit multiplier, carrying into the next place
 *  exactly like 덧셈's carry — this is the standard 세로 곱셈 algorithm for a
 *  one-digit multiplier. The "B" block panel just shows the multiplier's own
 *  (single-digit) ones bundle. */
export function computeMultiplication(a: number, m: number): OperationOutcome {
  const A = toDigits(a)
  const M = toDigits(m) // m is single-digit, so M.hundreds = M.tens = 0

  const columns: Record<PlaceKey, ColumnState> = {
    hundreds: blankColumn(A.hundreds, 0),
    tens: blankColumn(A.tens, 0),
    ones: blankColumn(A.ones, m),
  }
  const stages: ColumnStage[] = [
    {
      variant: 'columns',
      columns: structuredClone(columns),
      blocksA: A,
      blocksB: M,
      blocksResult: { ...EMPTY_DIGITS },
      horizontalLines: [],
      caption: `${a}를 백 · 십 · 일 구슬 묶음으로 나타냈어요. 일의 자리부터 ${m}를 곱해요.`,
    },
  ]

  const result: PlaceDigits = { ...EMPTY_DIGITS }
  const lines: string[] = []

  // 일의 자리
  const prodOnes = A.ones * m
  const carryToTens = Math.floor(prodOnes / 10)
  result.ones = prodOnes % 10
  columns.ones = { ...columns.ones, resultDigit: result.ones, done: true }
  if (carryToTens) columns.tens = { ...columns.tens, carryIn: carryToTens }
  lines.push(
    carryToTens
      ? `일의 자리: ${A.ones} × ${m} = ${prodOnes} → ${result.ones}를 쓰고, ${carryToTens * 10}을 십의 자리로 받아올림`
      : `일의 자리: ${A.ones} × ${m} = ${result.ones}`,
  )
  stages.push({
    variant: 'columns',
    place: 'ones',
    columns: structuredClone(columns),
    blocksA: A,
    blocksB: M,
    blocksResult: { ...result },
    horizontalLines: [...lines],
    caption: carryToTens ? `일의 자리 곱이 10을 넘어 그만큼 십의 자리로 올라가요.` : `일의 자리 계산을 마쳤어요.`,
  })

  // 십의 자리
  const prodTens = A.tens * m + carryToTens
  const carryToHundreds = Math.floor(prodTens / 10)
  result.tens = prodTens % 10
  columns.tens = { ...columns.tens, resultDigit: result.tens, done: true }
  if (carryToHundreds) columns.hundreds = { ...columns.hundreds, carryIn: carryToHundreds }
  const tensCarryTerm = carryToTens ? ` + ${carryToTens}(받아올림)` : ''
  lines.push(
    carryToHundreds
      ? `십의 자리: ${A.tens} × ${m}${tensCarryTerm} = ${prodTens} → ${result.tens}를 쓰고, ${carryToHundreds * 100}을 백의 자리로 받아올림`
      : `십의 자리: ${A.tens} × ${m}${tensCarryTerm} = ${result.tens}`,
  )
  stages.push({
    variant: 'columns',
    place: 'tens',
    columns: structuredClone(columns),
    blocksA: A,
    blocksB: M,
    blocksResult: { ...result },
    horizontalLines: [...lines],
    caption: carryToHundreds
      ? `십의 자리 곱이 100을 넘어 그만큼 백의 자리로 올라가요.`
      : `십의 자리 계산을 마쳤어요.`,
  })

  // 백의 자리
  const prodHundreds = A.hundreds * m + carryToHundreds
  result.hundreds = prodHundreds
  columns.hundreds = { ...columns.hundreds, resultDigit: result.hundreds, done: true }
  const hundredsCarryTerm = carryToHundreds ? ` + ${carryToHundreds}(받아올림)` : ''
  lines.push(`백의 자리: ${A.hundreds} × ${m}${hundredsCarryTerm} = ${result.hundreds}`)
  const value = result.hundreds * 100 + result.tens * 10 + result.ones
  stages.push({
    variant: 'columns',
    place: 'hundreds',
    columns: structuredClone(columns),
    blocksA: A,
    blocksB: M,
    blocksResult: { ...result },
    horizontalLines: [...lines],
    caption: `계산 완료! ${a} × ${m} = ${value}`,
  })

  return { value, stages }
}
