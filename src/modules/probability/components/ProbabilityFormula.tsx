import type { ProbabilityBreakdown } from '../lib/probability'

interface Props {
  eventLabel: string
  probability: ProbabilityBreakdown | null
  hidden: boolean
  onToggleHidden: () => void
}

/** Shows the textbook definition P(A) = n(A)/n(S) filled in with the current
 *  experiment's actual counts, tying the simulation back to the formula students
 *  see on the board. Doubles as the "정답 가리기" quiz card, same convention as the
 *  경우의 수 module's FormulaDisplay. */
export function ProbabilityFormula({ eventLabel, probability, hidden, onToggleHidden }: Props) {
  if (!probability) {
    return (
      <div className="formula-card">
        <p className="hint">사건을 하나 골라야 확률을 계산할 수 있습니다.</p>
      </div>
    )
  }

  const { favorable, total, simplified, decimal, percent } = probability

  return (
    <div className="formula-card">
      <div className="formula-row">
        <span className="formula-notation">P(A)</span>
        <span className="formula-eq">=</span>
        <span className="formula-expression">
          n(A) / n(S) = {favorable} / {total}
        </span>
        <span className="formula-eq">=</span>
        <span className={hidden ? 'formula-value is-hidden' : 'formula-value'}>
          {simplified.den !== total ? (
            <>
              {simplified.num}/{simplified.den} ={' '}
            </>
          ) : null}
          {decimal.toFixed(3)} ({percent}%)
        </span>
      </div>
      <p className="hint">사건 A: {eventLabel}</p>
      <button
        type="button"
        className="quiz-toggle"
        onClick={onToggleHidden}
        title="학생들이 먼저 이론적 확률을 예상해보게 한 뒤 눌러서 확인해보세요."
      >
        {hidden ? '👀 정답 보기' : '🙈 정답 가리기'}
      </button>
    </div>
  )
}
