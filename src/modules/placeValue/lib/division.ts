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

  for (let i = 0; i < PLACE_ORDER.length; i++) {
    const place = PLACE_ORDER[i]
    const isLastPlace = i === PLACE_ORDER.length - 1
    const priorRemainder = remainder
    const digit = D[place]
    const brought = priorRemainder * 10 + digit
    const quotientDigit = Math.floor(brought / divisor)
    const newRemainder = brought % divisor
    quotientDigits[place] = quotientDigit
    resultSoFar[place] = quotientDigit
    bringDowns.push({ place, digit, priorRemainder, brought, quotientDigit, remainder: newRemainder })

    lines.push(
      priorRemainder > 0
        ? `${PLACE_LABELS[place]}: 나머지 ${priorRemainder}에 ${digit}를 내려써서 ${brought} → ${brought} ÷ ${divisor} = ${quotientDigit} ... ${newRemainder}`
        : `${PLACE_LABELS[place]}: ${digit} ÷ ${divisor} = ${quotientDigit} ... ${newRemainder}`,
    )

    let caption: string
    if (quotientDigit === 0 && priorRemainder === 0) {
      caption = `${PLACE_LABELS[place]} 숫자 ${digit}는 ${divisor}보다 작아서 몫은 0이고, 다음 자리로 그대로 내려가요.`
    } else if (priorRemainder > 0) {
      caption = `앞에서 남은 ${priorRemainder}를 이 자리로 내려와 ${digit}와 합쳐 ${brought}를 만들고 ${divisor}묶음씩 ${quotientDigit}번 나누었어요.`
    } else {
      caption = `${digit}를 ${divisor}묶음씩 ${quotientDigit}번 나누었어요.`
    }

    remainder = newRemainder

    if (isLastPlace) {
      const value = resultSoFar.hundreds * 100 + resultSoFar.tens * 10 + resultSoFar.ones
      caption = remainder > 0 ? `계산 완료! ${dividend} ÷ ${divisor} = ${value} 나머지 ${remainder}` : `계산 완료! ${dividend} ÷ ${divisor} = ${value}`
    }

    stages.push({
      variant: 'longDivision',
      place,
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
  return { value, remainder, stages }
}
