import { SPEED_LABELS } from '../hooks/useAnimationProgress'
import type { AnimationSpeed } from '../hooks/useAnimationProgress'

const SPEEDS: AnimationSpeed[] = ['slow', 'normal', 'fast', 'veryFast']

interface Props {
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

export function AnimationControls({
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
    <section className="panel animation-panel">
      <div className="animation-row">
        {playing ? (
          <button type="button" className="secondary-btn" onClick={onPause}>
            ⏸ 일시정지
          </button>
        ) : finished ? (
          <button type="button" className="secondary-btn" onClick={onPlayFromStart}>
            ▶ 처음부터 재생
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
            ◀ 한 칸
          </button>
          <button type="button" className="step-btn" onClick={onStepForward} disabled={finished}>
            한 칸 ▶
          </button>
        </div>
        <button type="button" className="link-btn" onClick={onSkipToEnd} disabled={finished && !playing}>
          전체 보기
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
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </section>
  )
}
