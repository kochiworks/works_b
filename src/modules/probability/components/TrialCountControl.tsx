import { TRIAL_COUNT_MAX, TRIAL_COUNT_MIN, TRIAL_COUNT_STEP } from '../hooks/useSimulationRun'

interface Props {
  trialCount: number
  onChange: (count: number) => void
  onReroll: () => void
}

export function TrialCountControl({ trialCount, onChange, onReroll }: Props) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>시행 횟수 ({trialCount.toLocaleString('ko-KR')}번)</h2>
        <button type="button" className="link-btn" onClick={onReroll}>
          🔀 다시 시행하기
        </button>
      </div>
      <input
        type="range"
        min={TRIAL_COUNT_MIN}
        max={TRIAL_COUNT_MAX}
        step={TRIAL_COUNT_STEP}
        value={trialCount}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <p className="hint">
        시행 횟수는 {TRIAL_COUNT_MIN}~{TRIAL_COUNT_MAX}번 사이에서 고를 수 있습니다. 늘릴수록 상대도수가 이론적
        확률에 더 가까워지는 모습을 볼 수 있습니다.
      </p>
    </section>
  )
}
