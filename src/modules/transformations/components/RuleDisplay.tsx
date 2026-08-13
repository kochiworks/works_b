import { transformRuleText, transformSummary } from '../lib/transforms'
import { VERTEX_NAMES } from '../lib/types'
import type { Point, TransformParams } from '../lib/types'

interface Props {
  params: TransformParams
  points: Point[]
  transformedPoints: Point[]
  hidden: boolean
  onToggleHidden: () => void
}

export function RuleDisplay({ params, points, transformedPoints, hidden, onToggleHidden }: Props) {
  return (
    <section className="panel formula-card">
      <div className="formula-row">
        <span className="formula-notation">{transformSummary(params)}</span>
      </div>
      <div className="formula-row">
        <span className="formula-eq">규칙</span>
        <span className="formula-expression">{transformRuleText(params)}</span>
      </div>

      <div className="table-scroll">
        <table className="result-table">
          <thead>
            <tr>
              <th>꼭짓점</th>
              <th>이동 전</th>
              <th>이동 후</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p, i) => (
              <tr key={i}>
                <td className="row-index">{VERTEX_NAMES[i]}</td>
                <td>
                  ({p.x}, {p.y})
                </td>
                <td className={hidden ? 'coord-cell is-hidden' : 'coord-cell'}>
                  ({transformedPoints[i].x}, {transformedPoints[i].y})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        className="quiz-toggle"
        onClick={onToggleHidden}
        title="학생들이 먼저 이동 후 좌표를 예상해보게 한 뒤 눌러서 확인해보세요."
      >
        {hidden ? '👀 정답 보기' : '🙈 정답 가리기'}
      </button>
    </section>
  )
}
