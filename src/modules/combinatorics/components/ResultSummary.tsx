import { ENUMERATE_LIMIT } from '../lib/generators'
import type { GenerateResult } from '../lib/generators'

interface Props {
  result: GenerateResult
  hasOptions: boolean
  /** Shares the "정답 가리기" state with FormulaDisplay so the total doesn't give the
   *  answer away while the formula's value is still hidden. */
  hidden: boolean
}

export function ResultSummary({ result, hasOptions, hidden }: Props) {
  const { baseTotal, poolTotal, enumerated, cases } = result

  return (
    <section className="panel result-summary">
      <div className={hidden ? 'totals-row is-hidden' : 'totals-row'}>
        <div className="total-figure">
          <span className="total-label">전체 경우의 수</span>
          <span className="total-number">{baseTotal.toLocaleString('ko-KR')}가지</span>
        </div>

        {hasOptions && (
          <div className="total-figure total-figure--conditioned">
            <span className="total-label">조건 적용 후</span>
            {enumerated ? (
              <span className="total-number">
                {cases.length.toLocaleString('ko-KR')}가지{' '}
                <small>(전체 {baseTotal.toLocaleString('ko-KR')}가지 중)</small>
              </span>
            ) : (
              <span className="total-number total-number--muted">계산 불가 (결과가 너무 많음)</span>
            )}
          </div>
        )}
      </div>

      {!enumerated && (
        <p className="warning">
          나열 대상이 {poolTotal.toLocaleString('ko-KR')}가지로 표시 한도({ENUMERATE_LIMIT.toLocaleString('ko-KR')}
          가지)를 넘어 표·수형도를 그리지 않습니다. n 또는 r을 줄여주세요.
        </p>
      )}
    </section>
  )
}
