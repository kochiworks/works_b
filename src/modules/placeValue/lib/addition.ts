import { EMPTY_DIGITS, toDigits } from './digits'
import type { PlaceDigits } from './digits'
import type { ColumnStage, ColumnState, OperationOutcome, PlaceKey } from './types'

function blankColumn(digitA: number, digitB: number): ColumnState {
  return { digitA, digitB, active: false, done: false }
}

/** 덧셈: processes 일→십→백 (right to left), carrying 1 into the next place
 *  whenever a place's sum reaches 10 — the standard 세로셈 algorithm. Each
 *  stage's 결과 block panel only grows (never regroups away), since addition
 *  never needs to break a bundle open the way 뺄셈 does. */
export function computeAddition(a: number, b: number): OperationOutcome {
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
      caption: '두 수를 백 · 십 · 일 구슬 묶음으로 나타냈어요. 일의 자리부터 계산해요.',
    },
  ]

  const result: PlaceDigits = { ...EMPTY_DIGITS }
  const lines: string[] = []

  // 일의 자리
  const sumOnes = A.ones + B.ones
  const carryToTens = sumOnes >= 10 ? 1 : 0
  result.ones = sumOnes % 10
  columns.ones = { ...columns.ones, resultDigit: result.ones, active: false, done: true }
  if (carryToTens) columns.tens = { ...columns.tens, carryIn: carryToTens }
  lines.push(
    carryToTens
      ? `일의 자리: ${A.ones} + ${B.ones} = ${sumOnes} → ${result.ones}를 쓰고, 10개를 십의 자리로 받아올림`
      : `일의 자리: ${A.ones} + ${B.ones} = ${result.ones}`,
  )
  stages.push({
    variant: 'columns',
    columns: structuredClone(columns),
    blocksA: A,
    blocksB: B,
    blocksResult: { ...result },
    horizontalLines: [...lines],
    caption: carryToTens
      ? `일의 자리에서 10개가 모여 구슬 10개짜리 묶음 1개가 되어 십의 자리로 올라가요.`
      : `일의 자리 계산을 마쳤어요.`,
  })

  // 십의 자리
  const sumTens = A.tens + B.tens + carryToTens
  const carryToHundreds = sumTens >= 10 ? 1 : 0
  result.tens = sumTens % 10
  columns.tens = { ...columns.tens, resultDigit: result.tens, active: false, done: true }
  if (carryToHundreds) columns.hundreds = { ...columns.hundreds, carryIn: carryToHundreds }
  const tensCarryTerm = carryToTens ? ' + 1(받아올림)' : ''
  lines.push(
    carryToHundreds
      ? `십의 자리: ${A.tens} + ${B.tens}${tensCarryTerm} = ${sumTens} → ${result.tens}를 쓰고, 100개를 백의 자리로 받아올림`
      : `십의 자리: ${A.tens} + ${B.tens}${tensCarryTerm} = ${result.tens}`,
  )
  stages.push({
    variant: 'columns',
    columns: structuredClone(columns),
    blocksA: A,
    blocksB: B,
    blocksResult: { ...result },
    horizontalLines: [...lines],
    caption: carryToHundreds
      ? `십의 자리에서 10개 묶음이 10개 모여 100개짜리 묶음 1개가 되어 백의 자리로 올라가요.`
      : `십의 자리 계산을 마쳤어요.`,
  })

  // 백의 자리
  const sumHundreds = A.hundreds + B.hundreds + carryToHundreds
  result.hundreds = sumHundreds
  columns.hundreds = { ...columns.hundreds, resultDigit: result.hundreds, active: false, done: true }
  lines.push(
    `백의 자리: ${A.hundreds} + ${B.hundreds}${carryToHundreds ? ' + 1(받아올림)' : ''} = ${result.hundreds}`,
  )
  const value = result.hundreds * 100 + result.tens * 10 + result.ones
  lines.push(`${a} + ${b} = ${value}`)
  stages.push({
    variant: 'columns',
    columns: structuredClone(columns),
    blocksA: A,
    blocksB: B,
    blocksResult: { ...result },
    horizontalLines: [...lines],
    caption: `계산 완료! ${a} + ${b} = ${value}`,
  })

  return { value, stages }
}
