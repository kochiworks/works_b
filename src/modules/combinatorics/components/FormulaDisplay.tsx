import { formulaBreakdown } from '../lib/formulas'
import type { Mode } from '../lib/types'

interface Props {
  mode: Mode
  n: number
  r: number
  hidden: boolean
  onToggleHidden: () => void
}

/** Shows the textbook symbol (₅P₃ style) and the arithmetic behind it, tying the
 *  simulation back to the notation students see on the board / in the textbook.
 *  This is also where students derive the final count, so the "정답 가리기" toggle
 *  that blurs the resulting value lives right here. */
export function FormulaDisplay({ mode, n, r, hidden, onToggleHidden }: Props) {
  const { symbol, expression, value } = formulaBreakdown(mode, n, r)

  return (
    <div className="formula-card">
      <div className="formula-row">
        <span className="formula-notation">
          <sub>{n}</sub>
          <span className="formula-symbol">{symbol}</span>
          <sub>{r}</sub>
        </span>
        <span className="formula-eq">=</span>
        <span className={hidden ? 'formula-expression is-hidden' : 'formula-expression'}>{expression}</span>
        <span className="formula-eq">=</span>
        <span className={hidden ? 'formula-value is-hidden' : 'formula-value'}>
          {value.toLocaleString('ko-KR')}
        </span>
      </div>
      <button
        type="button"
        className="quiz-toggle"
        onClick={onToggleHidden}
        title="학생들이 먼저 예상해보게 한 뒤 눌러서 확인해보세요."
      >
        {hidden ? '👀 정답 보기' : '🙈 정답 가리기'}
      </button>
    </div>
  )
}
