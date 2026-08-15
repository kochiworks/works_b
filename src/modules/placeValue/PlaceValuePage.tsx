import { AnimationControls } from './components/AnimationControls'
import { EquationDisplay } from './components/EquationDisplay'
import { HorizontalAlgorithm } from './components/HorizontalAlgorithm'
import { LongDivision } from './components/LongDivision'
import { OperandEditor } from './components/OperandEditor'
import { OperationSelector } from './components/OperationSelector'
import { PlaceValueBlocks } from './components/PlaceValueBlocks'
import { PresetScenarios } from './components/PresetScenarios'
import { VerticalColumns } from './components/VerticalColumns'
import { useStageAnimation } from './hooks/useStageAnimation'
import { usePlaceValueState } from './hooks/usePlaceValueState'
import { fromDigits } from './lib/digits'
import './PlaceValuePage.css'

const OPERATOR_SYMBOLS: Record<string, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
}

export function PlaceValuePage() {
  const { kind, setKind, config, values, outcome, setOperand, resetOperands, applyPreset } = usePlaceValueState()
  const anim = useStageAnimation(outcome.stages.length)
  const stage = outcome.stages[anim.index]

  return (
    <div className="place-value-page">
      <header className="page-intro">
        <h1>🔢 가로셈 · 세로셈 탐구기</h1>
        <p className="subtitle">
          수를 백 · 십 · 일 구슬 묶음으로 나타내고, 받아올림과 받아내림이 일어나는 순간을 가로셈과 세로셈으로 함께
          확인해보세요.
        </p>
      </header>

      <PresetScenarios onApply={(preset) => applyPreset(preset.config)} />

      <div className="explorer-layout">
        <div className="settings-column">
          <OperationSelector kind={kind} onChange={setKind} />
          <OperandEditor config={config} values={values} onChange={setOperand} onReset={resetOperands} />
        </div>

        <div className="result-column">
          <EquationDisplay config={config} values={values} outcome={outcome} />

          <section className="panel blocks-grid">
            <PlaceValueBlocks digits={stage.blocksA} value={values.a} label={`${values.a} · ${config.labels.a}`} />
            <PlaceValueBlocks digits={stage.blocksB} value={values.b} label={`${values.b} · ${config.labels.b}`} />
            <PlaceValueBlocks
              digits={stage.blocksResult}
              value={outcome.value}
              label={`${fromDigits(stage.blocksResult)} · ${config.labels.result}`}
            />
          </section>

          <section className="panel algorithms-grid">
            <div className="algorithm-block">
              <h2>세로셈</h2>
              {stage.variant === 'columns' ? (
                <VerticalColumns
                  columns={stage.columns}
                  operatorSymbol={OPERATOR_SYMBOLS[kind] ?? ''}
                  aValue={values.a}
                  bValue={values.b}
                  resultValue={outcome.value}
                  bIsSingleDigit={kind === 'multiplication'}
                />
              ) : (
                <LongDivision
                  dividend={values.a}
                  divisor={values.b}
                  quotientDigits={stage.quotientDigits}
                  quotientValue={outcome.value}
                  remainder={stage.remainder}
                  showRemainder={anim.index >= anim.total}
                />
              )}
            </div>
            <div className="algorithm-block">
              <h2>가로셈</h2>
              <HorizontalAlgorithm lines={stage.horizontalLines} />
            </div>
          </section>

          <p className="hint stage-caption">{stage.caption}</p>

          <AnimationControls
            index={anim.index}
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
