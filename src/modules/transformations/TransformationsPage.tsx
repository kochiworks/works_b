import { useEffect, useState } from 'react'
import { AnimationControls } from './components/AnimationControls'
import { CircleEditor } from './components/CircleEditor'
import { CoordinateGrid } from './components/CoordinateGrid'
import { LineEditor } from './components/LineEditor'
import { QuadraticEditor } from './components/QuadraticEditor'
import { RuleDisplay } from './components/RuleDisplay'
import { ShapeSelector } from './components/ShapeSelector'
import { TransformControls } from './components/TransformControls'
import { VertexEditor } from './components/VertexEditor'
import { useAnimationProgress } from './hooks/useAnimationProgress'
import { useTransformState } from './hooks/useTransformState'
import { SHAPE_FAMILY, VERTEX_NAMES } from './lib/types'
import './TransformationsPage.css'

export function TransformationsPage() {
  const {
    shapeKind,
    setShapeKind,
    vertices,
    setVertexCoord,
    lineSlope,
    setLineSlope,
    lineIntercept,
    setLineIntercept,
    circleCenter,
    setCircleCenterCoord,
    circleRadius,
    setCircleRadius,
    quadA,
    setQuadA,
    quadVertex,
    setQuadVertexCoord,
    params,
    setTransformType,
    setDx,
    setDy,
    setAxis,
    setAngle,
    points,
    transformedPoints,
    pointsAtProgress,
    activeVertexIndex,
  } = useTransformState()

  const animation = useAnimationProgress()
  const [answerHidden, setAnswerHidden] = useState(true)

  // A revealed quiz answer shouldn't carry over to a new setup, and a half-finished
  // animation shouldn't either — both reset together whenever the shape, its
  // defining points, or the chosen transform changes.
  const isCircle = shapeKind === 'circle'
  useEffect(() => {
    animation.reset()
    setAnswerHidden(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeKind, points, params, circleRadius])

  const family = SHAPE_FAMILY[shapeKind]
  const animatedPoints = pointsAtProgress(animation.progress)
  const activeIndex = activeVertexIndex(animation.progress)

  return (
    <div className="transformations-page">
      <header className="page-intro">
        <h1>🔺 도형의 이동 탐색기</h1>
        <p className="subtitle">평행이동 · 대칭이동 · 회전이동으로 도형이 어떻게 움직이는지 직접 확인해보세요.</p>
      </header>

      <div className="explorer-layout">
        <div className="settings-column">
          <ShapeSelector shapeKind={shapeKind} onChange={setShapeKind} />

          {family === 'polygon' && <VertexEditor points={vertices} onChange={setVertexCoord} />}
          {shapeKind === 'line' && (
            <LineEditor
              slope={lineSlope}
              intercept={lineIntercept}
              onSlopeChange={setLineSlope}
              onInterceptChange={setLineIntercept}
            />
          )}
          {isCircle && (
            <CircleEditor
              center={circleCenter}
              radius={circleRadius}
              onCenterChange={setCircleCenterCoord}
              onRadiusChange={setCircleRadius}
            />
          )}
          {shapeKind === 'quadratic' && (
            <QuadraticEditor a={quadA} vertex={quadVertex} onAChange={setQuadA} onVertexChange={setQuadVertexCoord} />
          )}

          <TransformControls
            shapeKind={shapeKind}
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
            shapeKind={shapeKind}
            params={params}
            points={points}
            transformedPoints={transformedPoints}
            circleRadius={circleRadius}
            quadA={quadA}
            quadVertex={quadVertex}
            hidden={answerHidden}
            onToggleHidden={() => setAnswerHidden((prev) => !prev)}
          />

          <AnimationControls
            step={animation.step}
            total={animation.total}
            playing={animation.playing}
            speed={animation.speed}
            onSpeedChange={animation.setSpeed}
            onPlayFromStart={animation.playFromStart}
            onPause={animation.pause}
            onResume={animation.resume}
            onSkipToEnd={animation.skipToEnd}
            onStepForward={animation.stepForward}
            onStepBack={animation.stepBack}
          />
          {family === 'polygon' && points.length > 1 && (
            <p className="hint sequential-hint">
              ▶ 재생하면 {VERTEX_NAMES.slice(0, points.length).join(' → ')} 순서로 꼭짓점이 하나씩 이동합니다 — 같은 규칙이
              점마다 그대로 적용되는 과정을 확인해보세요.
            </p>
          )}

          <section className="panel grid-panel">
            <div className="legend">
              <span className="legend-item">
                <span className="legend-dot legend-dot--original" /> 이동 전
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-dot--transformed" /> 이동 중 · 이동 후
              </span>
            </div>
            <div className="grid-scroll">
              <CoordinateGrid
                shapeKind={shapeKind}
                points={points}
                animatedPoints={animatedPoints}
                radius={isCircle ? circleRadius : undefined}
                activeIndex={activeIndex}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
