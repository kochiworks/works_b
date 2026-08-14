import { CategorySelector } from './components/CategorySelector'
import { CoefficientEditor } from './components/CoefficientEditor'
import { EquationDisplay } from './components/EquationDisplay'
import { FunctionGraph } from './components/FunctionGraph'
import { KindSelector } from './components/KindSelector'
import { PresetScenarios } from './components/PresetScenarios'
import { useFunctionState } from './hooks/useFunctionState'
import { computeAsymptotes } from './lib/asymptotes'
import './FunctionsPage.css'

export function FunctionsPage() {
  const { category, setCategory, kind, setKind, config, values, setCoefficient, resetCoefficients, applyPreset } =
    useFunctionState()

  const asymptotes = computeAsymptotes(kind, values)

  return (
    <div className="functions-page">
      <header className="page-intro">
        <h1>📈 함수의 그래프 탐구기</h1>
        <p className="subtitle">계수를 조절하며 다항함수 · 유리함수 · 무리함수 · 지수함수 · 로그함수 · 삼각함수의 그래프가 실시간으로 바뀌는 모습을 관찰해보세요.</p>
      </header>

      <PresetScenarios onApply={(preset) => applyPreset(preset.config)} />

      <div className="explorer-layout">
        <div className="settings-column">
          <CategorySelector category={category} onChange={setCategory} />
          <KindSelector category={category} kind={kind} onChange={setKind} />
          <CoefficientEditor config={config} values={values} onChange={setCoefficient} onReset={resetCoefficients} />
        </div>

        <div className="result-column">
          <EquationDisplay config={config} values={values} />

          <section className="panel grid-panel">
            {(asymptotes.vertical.length > 0 || asymptotes.horizontal.length > 0) && (
              <div className="legend">
                <span className="legend-item">
                  <span className="legend-dot legend-dot--curve" /> 그래프
                </span>
                <span className="legend-item">
                  <span className="legend-dot legend-dot--asymptote" /> 점근선
                </span>
              </div>
            )}
            <div className="grid-scroll">
              <FunctionGraph config={config} values={values} asymptotes={asymptotes} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
