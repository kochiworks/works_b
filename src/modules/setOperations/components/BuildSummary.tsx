import { roster } from '../lib/types'
import type { BuildFeedback, Situation } from '../lib/situations'
import { ConditionNotation } from './ConditionNotation'
import { Katex } from './Katex'

interface Props {
  situation: Situation
  selected: number[]
  checked: boolean
  feedback: BuildFeedback
}

/** Both notations side by side: the condition given, the roster being built. */
export function BuildSummary({ situation, selected, checked, feedback }: Props) {
  return (
    <section className="panel">
      <div className="formula-card">
        <div className="formula-row">
          <span className="formula-tag">조건제시법</span>
          <span className="formula-expression--large">
            <ConditionNotation tex={situation.conditionTex} text={situation.conditionText} />
          </span>
        </div>
        <div className="formula-row">
          <span className="formula-tag">원소나열법</span>
          <span className="formula-expression--large">
            <Katex tex={`A = ${roster(selected)}`} />
          </span>
        </div>
        <div className="formula-row">
          <span className="formula-tag">원소의 개수</span>
          <Katex tex={`n(A) = ${selected.length}`} />
        </div>
      </div>

      {checked && (
        <p className={feedback.correct ? 'verdict is-correct' : 'verdict is-wrong'}>
          {feedback.correct ? (
            <>✅ 맞습니다. {situation.insight}</>
          ) : (
            <>
              ✏️ 다시 살펴봐요.
              {feedback.missing.length > 0 && <> 빠뜨린 원소: {feedback.missing.join(', ')}.</>}
              {feedback.extra.length > 0 && <> 잘못 넣은 원소: {feedback.extra.join(', ')}.</>}
            </>
          )}
        </p>
      )}
    </section>
  )
}
