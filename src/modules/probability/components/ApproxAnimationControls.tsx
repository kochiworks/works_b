import { SPEED_LABELS } from '../hooks/useNormalApproxAnimation'
import type { AnimationSpeed } from '../hooks/useNormalApproxAnimation'

const SPEEDS: AnimationSpeed[] = ['slow', 'normal', 'fast', 'veryFast']

interface Props {
  currentN: number
  targetN: number
  step: number
  total: number
  playing: boolean
  speed: AnimationSpeed
  onSpeedChange: (speed: AnimationSpeed) => void
  onPlayFromStart: () => void
  onPause: () => void
  onResume: () => void
  onSkipToEnd: () => void
  onStepForward: () => void
  onStepBack: () => void
}

/** Same play/pause/step/speed shape as the module's other AnimationControls, but
 *  worded for "sweep the sample size n" instead of "reveal one more trial". */
export function ApproxAnimationControls({
  currentN,
  targetN,
  step,
  total,
  playing,
  speed,
  onSpeedChange,
  onPlayFromStart,
  onPause,
  onResume,
  onSkipToEnd,
  onStepForward,
  onStepBack,
}: Props) {
  const finished = step >= total
  const pct = total > 0 ? Math.round((step / total) * 100) : 100

  return (
    <div className="animation-panel">
      <div className="animation-row">
        {playing ? (
          <button type="button" className="secondary-btn" onClick={onPause}>
            ⏸ 일시정지
          </button>
        ) : finished ? (
          <button type="button" className="secondary-btn" onClick={onPlayFromStart}>
            ▶ n = 4부터 다시 재생
          </button>
        ) : step <= 0 ? (
          <button type="button" className="secondary-btn" onClick={onResume}>
            ▶ 재생
          </button>
        ) : (
          <button type="button" className="secondary-btn" onClick={onResume}>
            ▶ 이어서 재생
          </button>
        )}
        <div className="step-group">
          <button type="button" className="step-btn" onClick={onStepBack} disabled={step <= 0}>
            ◀ n 줄이기
          </button>
          <button type="button" className="step-btn" onClick={onStepForward} disabled={finished}>
            n 늘리기 ▶
          </button>
        </div>
        <button type="button" className="link-btn" onClick={onSkipToEnd} disabled={finished && !playing}>
          n = {targetN.toLocaleString('ko-KR')}로 바로 가기
        </button>
        <div className="speed-group">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              className={s === speed ? 'speed-btn active' : 'speed-btn'}
              onClick={() => onSpeedChange(s)}
            >
              {SPEED_LABELS[s]}
            </button>
          ))}
        </div>
        <span className="animation-progress-label">n = {currentN.toLocaleString('ko-KR')}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
