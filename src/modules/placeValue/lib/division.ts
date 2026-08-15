import { EMPTY_DIGITS, toDigits } from './digits'
import type { PlaceDigits } from './digits'
import type { DivisionBringDown, LongDivisionStage, OperationOutcome, PlaceKey } from './types'
import { PLACE_LABELS, PLACE_ORDER } from './types'

/** 나눗셈 (여러 자리 수 ÷ 한 자리 수): unlike the other three operations, long
 *  division processes 백→십→일 (left to right) — at each place, the leftover
 *  remainder from the place before is "brought down" and combined with the
 *  current digit before dividing again. The B panel just shows the divisor's
 *  own (single-digit) ones bundle. */
export function computeDivision(dividend: number, divisor: number): OperationOutcome {
  const D = toDigits(dividend)
  const DIV = toDigits(divisor)

  const stages: LongDivisionStage[] = [
    {
      variant: 'longDivision',
      quotientDigits: {},
      bringDowns: [],
      remainder: 0,
      blocksA: D,
      blocksB: DIV,
      blocksResult: { ...EMPTY_DIGITS },
      horizontalLines: [],
      caption: `${dividend}를 ${divisor}로 나눠요. 백의 자리부터 순서대로 계산해요.`,
    },
  ]

  let remainder = 0
  const quotientDigits: Partial<Record<PlaceKey, number>> = {}
  const bringDowns: DivisionBringDown[] = []
  const lines: string[] = []
  const resultSoFar: PlaceDigits = { ...EMPTY_DIGITS }

  for (const place of PLACE_ORDER) {
    const digit = D[place]
    const brought = remainder * 10 + digit
    const quotientDigit = Math.floor(brought / divisor)
    const newRemainder = brought % divisor
    quotientDigits[place] = quotientDigit
    resultSoFar[place] = quotientDigit
    bringDowns.push({ place, digit, brought, quotientDigit, remainder: newRemainder })

    lines.push(
      remainder > 0
        ? `${PLACE_LABELS[place]}: 나머지 ${remainder}에 ${digit}를 내려써서 ${brought} → ${brought} ÷ ${divisor} = ${quotientDigit} ... ${newRemainder}`
        : `${PLACE_LABELS[place]}: ${digit} ÷ ${divisor} = ${quotientDigit} ... ${newRemainder}`,
    )

    let caption: string
    if (quotientDigit === 0 && remainder === 0) {
      caption = `${PLACE_LABELS[place]} 숫자 ${digit}는 ${divisor}보다 작아서 몫은 0이고, 다음 자리로 그대로 내려가요.`
    } else if (remainder > 0) {
      caption = `앞에서 남은 ${remainder}를 이 자리로 내려와 ${digit}와 합쳐 ${brought}를 만들고 ${divisor}묶음씩 ${quotientDigit}번 나누었어요.`
    } else {
      caption = `${digit}를 ${divisor}묶음씩 ${quotientDigit}번 나누었어요.`
    }

    remainder = newRemainder
    stages.push({
      variant: 'longDivision',
      quotientDigits: { ...quotientDigits },
      bringDowns: [...bringDowns],
      remainder,
      blocksA: D,
      blocksB: DIV,
      blocksResult: { ...resultSoFar },
      horizontalLines: [...lines],
      caption,
    })
  }

  const value = resultSoFar.hundreds * 100 + resultSoFar.tens * 10 + resultSoFar.ones
  lines.push(remainder > 0 ? `${dividend} ÷ ${divisor} = ${value} ⋯ ${remainder}` : `${dividend} ÷ ${divisor} = ${value}`)
  stages.push({
    variant: 'longDivision',
    quotientDigits: { ...quotientDigits },
    bringDowns: [...bringDowns],
    remainder,
    blocksA: D,
    blocksB: DIV,
    blocksResult: { ...resultSoFar },
    horizontalLines: [...lines],
    caption:
      remainder > 0
        ? `계산 완료! ${dividend} ÷ ${divisor} = ${value} 나머지 ${remainder}`
        : `계산 완료! ${dividend} ÷ ${divisor} = ${value}`,
  })

  return { value, remainder, stages }
}
