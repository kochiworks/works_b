import { useEffect, useState } from 'react'
import { ShapeSelector } from './components/ShapeSelector'
import { VertexEditor } from './components/VertexEditor'
import { TransformControls } from './components/TransformControls'
import { CoordinateGrid } from './components/CoordinateGrid'
import { RuleDisplay } from './components/RuleDisplay'
import { useTransformState } from './hooks/useTransformState'
import './TransformationsPage.css'

export function TransformationsPage() {
  const {
    shapeKind,
    setShapeKind,
    points,
    setPointCoord,
    params,
    setTransformType,
    setDx,
    setDy,
    setAxis,
    setAngle,
    transformedPoints,
  } = useTransformState()

  const [answerHidden, setAnswerHidden] = useState(true)

  // A new shape, moved vertex, or new transform choice re-hides the answer, same
  // reasoning as the combinatorics module: a revealed answer shouldn't carry over
  // to a new setup.
  useEffect(() => {
    setAnswerHidden(true)
  }, [shapeKind, points, params])

  return (
    <div className="transformations-page">
      <header className="page-intro">
        <h1>🔺 도형의 이동 탐색기</h1>
        <p className="subtitle">평행이동 · 대칭이동 · 회전이동으로 도형이 어떻게 움직이는지 직접 확인해보세요.</p>
      </header>

      <div className="explorer-layout">
        <div className="settings-column">
          <ShapeSelector shapeKind={shapeKind} onChange={setShapeKind} />
          <VertexEditor points={points} onChange={setPointCoord} />
          <TransformControls
            params={params}
            onTypeChange={setTransformType}
            onDxChange={setDx}
            onDyChange={setDy}
            onAxisChange={setAxis}
            onAngleChange={setAngle}
          />
        </div>

        <div className="result-column">
          <RuleDisplay
            params={params}
            points={points}
            transformedPoints={transformedPoints}
            hidden={answerHidden}
            onToggleHidden={() => setAnswerHidden((prev) => !prev)}
          />

          <section className="panel grid-panel">
            <div className="legend">
              <span className="legend-item">
                <span className="legend-dot legend-dot--original" /> 이동 전
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-dot--transformed" /> 이동 후
              </span>
            </div>
            <div className="grid-scroll">
              <CoordinateGrid
                shapeKind={shapeKind}
                points={points}
                transformedPoints={transformedPoints}
                hidden={answerHidden}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
