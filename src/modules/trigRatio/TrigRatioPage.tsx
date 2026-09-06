import { AngleSelector } from './components/AngleSelector'
import { RatioReadout } from './components/RatioReadout'
import { RatioSelector } from './components/RatioSelector'
import { RatioTable } from './components/RatioTable'
import { TriangleDiagram } from './components/TriangleDiagram'
import { useTrigRatioState } from './hooks/useTrigRatioState'
import './TrigRatioPage.css'

export function TrigRatioPage() {
  const { angleDeg, ratio, selectAngle, selectRatio, data } = useTrigRatioState()

  return (
    <div className="trig-page">
      <header className="page-intro">
        <h1>📐 삼각비 탐구기</h1>
        <p className="subtitle">
          직각삼각형의 예각을 특수각으로 바꿔 가며, sin · cos · tan 의 값이 왜 그렇게 되는지 삼각형에서 바로 확인해보세요.
        </p>
      </header>

      <div className="explorer-layout">
        <div className="settings-column">
          <AngleSelector angleDeg={angleDeg} onChange={selectAngle} />
          <RatioSelector ratio={ratio} data={data} onChange={selectRatio} />
        </div>

        <div className="result-column">
          <RatioReadout data={data} ratio={ratio} />

          <section className="panel trig-figure-panel">
            <div className="legend trig-legend">
              <span className="legend-item">
                <span className="legend-dot legend-dot--opp" /> 대변(높이)
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-dot--adj" /> 밑변
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-dot--hyp" /> 빗변
              </span>
            </div>
            <div className="trig-figure-scroll">
              <TriangleDiagram data={data} ratio={ratio} />
            </div>
            <p className="trig-reason">{data.reason}</p>
          </section>

          <RatioTable angleDeg={angleDeg} ratio={ratio} />
        </div>
      </div>
    </div>
  )
}
