import { useEffect, useMemo, useState } from 'react'
import { AnimationControls } from './components/AnimationControls'
import { EventSelector } from './components/EventSelector'
import { ExperimentSelector } from './components/ExperimentSelector'
import { ExperimentSettings } from './components/ExperimentSettings'
import { FrequencyChart } from './components/FrequencyChart'
import { PresetScenarios } from './components/PresetScenarios'
import { ProbabilityFormula } from './components/ProbabilityFormula'
import { ResultSummary } from './components/ResultSummary'
import { TrialCountControl } from './components/TrialCountControl'
import { TrialLog } from './components/TrialLog'
import { TRIAL_COUNT_DEFAULT, useSimulationRun } from './hooks/useSimulationRun'
import { useTrialAnimation } from './hooks/useTrialAnimation'
import { useProbabilityState } from './hooks/useProbabilityState'
import { relativeFrequencySeries } from './lib/probability'
import './ProbabilityPage.css'

export function ProbabilityPage() {
  const {
    kind,
    setKind,
    coinCount,
    setCoinCount,
    diceCount,
    setDiceCount,
    ballGroups,
    setBallGroupCount,
    renameBallGroup,
    sampleSpace,
    eventOptions,
    eventId,
    setEventId,
    selectedEvent,
    probability,
    applyPreset,
  } = useProbabilityState()

  const [trialCount, setTrialCount] = useState(TRIAL_COUNT_DEFAULT)
  const [answerHidden, setAnswerHidden] = useState(true)
  const { trials, reroll } = useSimulationRun(sampleSpace, trialCount)
  const animation = useTrialAnimation(trials.length)

  // A revealed answer, and a half-finished simulation, shouldn't carry over to a new
  // setup — whether that's a preset click or a manual tweak to the experiment/event.
  useEffect(() => {
    setAnswerHidden(true)
  }, [kind, coinCount, diceCount, ballGroups, eventId])

  // The trial batch itself (a fresh useSimulationRun draw, whether from a settings
  // change or an explicit reroll) always starts the build-up animation over.
  useEffect(() => {
    animation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trials])

  const handleReroll = () => {
    reroll()
  }

  const frequencySeries = useMemo(
    () => (selectedEvent ? relativeFrequencySeries(trials, selectedEvent) : []),
    [trials, selectedEvent],
  )
  const hits = useMemo(
    () => (selectedEvent ? trials.slice(0, animation.revealed).filter(selectedEvent.matches).length : 0),
    [trials, animation.revealed, selectedEvent],
  )

  return (
    <div className="probability-page">
      <header className="page-intro">
        <h1>🎯 확률 탐구기</h1>
        <p className="subtitle">동전 · 주사위 · 공 뽑기를 반복 시행하며 실험적 확률이 이론적 확률에 가까워지는 과정을 관찰해보세요.</p>
      </header>

      <PresetScenarios onApply={(preset) => applyPreset(preset.config)} />

      <div className="explorer-layout">
        <div className="settings-column">
          <ExperimentSelector kind={kind} onChange={setKind} />
          <ExperimentSettings
            kind={kind}
            coinCount={coinCount}
            onCoinCountChange={setCoinCount}
            diceCount={diceCount}
            onDiceCountChange={setDiceCount}
            ballGroups={ballGroups}
            onBallGroupCountChange={setBallGroupCount}
            onBallGroupRename={renameBallGroup}
          />
          <EventSelector options={eventOptions} eventId={eventId} onChange={setEventId} />
          <TrialCountControl trialCount={trialCount} onChange={setTrialCount} onReroll={handleReroll} />
        </div>

        <div className="result-column">
          <ProbabilityFormula
            eventLabel={selectedEvent?.label ?? '—'}
            probability={probability}
            hidden={answerHidden}
            onToggleHidden={() => setAnswerHidden((prev) => !prev)}
          />

          {selectedEvent && (
            <ResultSummary
              revealed={animation.revealed}
              hits={hits}
              theoreticalProbability={probability?.decimal ?? 0}
              hidden={answerHidden}
            />
          )}

          <section className="panel">
            <h2>시행 기록</h2>
            {trials.length > 0 && selectedEvent && (
              <AnimationControls
                revealed={animation.revealed}
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
            )}
            {selectedEvent ? (
              <TrialLog trials={trials} revealed={animation.revealed} event={selectedEvent} />
            ) : (
              <p className="hint">사건을 하나 고르면 시행 결과가 여기에 나타납니다.</p>
            )}
          </section>

          {selectedEvent && probability && (
            <section className="panel">
              <h2>상대도수의 변화 (큰 수의 법칙)</h2>
              <p className="hint">
                시행을 거듭할수록 초록색 선(상대도수)이 보라색 점선(이론적 확률) 근처로 모여드는 모습을 확인해보세요.
              </p>
              <FrequencyChart
                series={frequencySeries}
                revealed={animation.revealed}
                total={trials.length}
                theoreticalProbability={probability.decimal}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
