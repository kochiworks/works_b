import { AnimationControls } from './components/AnimationControls'
import { BeadBoard } from './components/BeadBoard'
import { BeadLegend } from './components/BeadLegend'
import { EquationDisplay } from './components/EquationDisplay'
import { OperandEditor } from './components/OperandEditor'
import { OperationSelector } from './components/OperationSelector'
import { PresetScenarios } from './components/PresetScenarios'
import { useBeadAnimation } from './hooks/useBeadAnimation'
import { useNumberSenseState } from './hooks/useNumberSenseState'
import { boardAtStep } from './lib/beadBoard'
import './NumberSensePage.css'

export function NumberSensePage() {
  const { kind, setKind, config, values, result, setOperand, resetOperands, applyPreset } = useNumberSenseState()
  const anim = useBeadAnimation(result.placements.length)
  const board = boardAtStep(result, anim.step)

  return (
    <div className="number-sense-page">
      <header className="page-intro">
        <h1>🧮 수 감각 익히기</h1>
        <p className="subtitle">
          10알 교구(원목 수셈판)로 덧셈 · 뺄셈 · 곱셈 · 나눗셈의 원리를 직접 조작하며 눈으로 확인해보세요.
        </p>
      </header>

      <PresetScenarios onApply={(preset) => applyPreset(preset.config)} />

      <div className="explorer-layout">
        <div className="settings-column">
          <OperationSelector kind={kind} onChange={setKind} />
          <OperandEditor config={config} values={values} onChange={setOperand} onReset={resetOperands} />
        </div>

        <div className="result-column">
          <EquationDisplay config={config} values={values} result={result} />

          <section className="panel grid-panel">
            <BeadLegend kind={kind} />
            <div className="bead-board-scroll">
              <BeadBoard board={board} />
            </div>
          </section>

          <AnimationControls
            step={anim.step}
            total={anim.total}
            playing={anim.playing}
            speed={anim.speed}
            onSpeedChange={anim.setSpeed}
            onPlayFromStart={anim.playFromStart}
            onPause={anim.pause}
            onResume={anim.resume}
            onSkipToEnd={anim.skipToEnd}
            onStepForward={anim.stepForward}
            onStepBack={anim.stepBack}
          />
        </div>
      </div>
    </div>
  )
}
