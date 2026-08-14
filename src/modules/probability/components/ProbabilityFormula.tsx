import { Katex } from './Katex'
import type { ProbabilityBreakdown } from '../lib/probability'

interface Props {
  eventLabel: string
  probability: ProbabilityBreakdown | null
}

/** Shows the textbook definition P(A) = n(A)/n(S) filled in with the current
 *  experiment's actual counts, tying the simulation back to the formula students
 *  see on the board. Unlike the 경우의 수 module's FormulaDisplay, there's no
 *  "정답 가리기" quiz toggle here — the point of this module is watching the
 *  experimental relative frequency arrive at this value on its own, so hiding it
 *  would work against the module rather than with it. */
export function ProbabilityFormula({ eventLabel, probability }: Props) {
  if (!probability) {
    return (
      <div className="formula-card">
        <p className="hint">사건을 하나 골라야 확률을 계산할 수 있습니다.</p>
      </div>
    )
  }

  const { favorable, total, simplified, decimal, percent } = probability

  const fractions = [`\\dfrac{n(A)}{n(S)}`, `\\dfrac{${favorable}}{${total}}`]
  if (simplified.den !== total) {
    fractions.push(`\\dfrac{${simplified.num}}{${simplified.den}}`)
  }
  const tex = `P(A) = ${fractions.join(' = ')} = ${decimal.toFixed(3)}\\ (${percent}\\%)`

  return (
    <div className="formula-card">
      <div className="formula-row">
        <Katex tex={tex} className="formula-notation" />
      </div>
      <p className="hint">사건 A: {eventLabel}</p>
    </div>
  )
}
