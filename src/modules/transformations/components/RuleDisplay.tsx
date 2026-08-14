import { Katex } from './Katex'
import { circleEquationTex, lineEquationTex, quadraticEquationTex, transformQuadratic } from '../lib/equationShapes'
import { transformRuleTex, transformSummary } from '../lib/transforms'
import { VERTEX_NAMES } from '../lib/types'
import type { Point, ShapeKind, TransformParams } from '../lib/types'

interface Props {
  shapeKind: ShapeKind
  params: TransformParams
  points: Point[]
  transformedPoints: Point[]
  circleRadius: number
  quadA: number
  quadVertex: Point
  hidden: boolean
  onToggleHidden: () => void
}

export function RuleDisplay({
  shapeKind,
  params,
  points,
  transformedPoints,
  circleRadius,
  quadA,
  quadVertex,
  hidden,
  onToggleHidden,
}: Props) {
  const isPolygon = shapeKind === 'point' || shapeKind === 'segment' || shapeKind === 'triangle' || shapeKind === 'quad'
  const quadAfter = shapeKind === 'quadratic' ? transformQuadratic(quadA, quadVertex, params) : null

  return (
    <section className="panel formula-card">
      <div className="formula-row">
        <span className="formula-notation">{transformSummary(params)}</span>
      </div>
      <div className="formula-row">
        <span className="formula-eq">규칙</span>
        <Katex tex={transformRuleTex(params)} className="formula-expression" />
      </div>

      {shapeKind === 'line' && (
        <EquationCompare
          before={lineEquationTex(points[0], points[1])}
          after={lineEquationTex(transformedPoints[0], transformedPoints[1])}
          hidden={hidden}
        />
      )}

      {shapeKind === 'circle' && (
        <EquationCompare
          before={circleEquationTex(points[0], circleRadius)}
          after={circleEquationTex(transformedPoints[0], circleRadius)}
          hidden={hidden}
        />
      )}

      {quadAfter && (
        <EquationCompare
          before={quadraticEquationTex(quadA, quadVertex)}
          after={quadraticEquationTex(quadAfter.a, quadAfter.vertex)}
          hidden={hidden}
        />
      )}

      {isPolygon && (
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
      )}

      <button
        type="button"
        className="quiz-toggle"
        onClick={onToggleHidden}
        title="학생들이 먼저 이동 후 좌표(또는 방정식)를 예상해보게 한 뒤 눌러서 확인해보세요."
      >
        {hidden ? '👀 정답 보기' : '🙈 정답 가리기'}
      </button>
    </section>
  )
}

function EquationCompare({ before, after, hidden }: { before: string; after: string; hidden: boolean }) {
  return (
    <div className="equation-compare">
      <div className="equation-compare-row">
        <span className="equation-compare-label">이동 전</span>
        <Katex tex={before} className="equation-compare-value" />
      </div>
      <div className="equation-compare-row">
        <span className="equation-compare-label">이동 후</span>
        <Katex tex={after} className={hidden ? 'equation-compare-value is-hidden' : 'equation-compare-value'} />
      </div>
    </div>
  )
}
