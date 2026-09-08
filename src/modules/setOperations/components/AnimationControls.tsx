import { SPEED_LABELS } from '../hooks/useStepAnimation'
import type { AnimationSpeed } from '../hooks/useStepAnimation'

const SPEEDS: AnimationSpeed[] = ['slow', 'normal', 'fast', 'veryFast']

interface Props {
  index: number
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

/** Mirrors 수 감각 익히기 and 가로셈 · 세로셈 탐구기's controls — same
 *  play/pause/step/speed shape, driving the set-by-set build of an expression. */
export function AnimationControls({
  index,
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
  const finished = index >= total
  const pct = total > 0 ? Math.round((index / total) * 100) : 100

  return (
    <section className="panel animation-panel">
      <div className="panel-header">
        <h2>계산 과정 재생</h2>
        <span className="animation-count">
          {index + 1} / {total + 1} 단계
        </span>
      </div>
      <div className="animation-row">
        {playing ? (
          <button type="button" className="secondary-btn" onClick={onPause}>
            ⏸ 일시정지
          </button>
        ) : finished ? (
          <button type="button" className="secondary-btn" onClick={onPlayFromStart}>
            ▶ 처음부터 재생
          </button>
        ) : (
          <button type="button" className="secondary-btn" onClick={onResume}>
            ▶ {index <= 0 ? '재생' : '이어서 재생'}
          </button>
        )}
        <div className="step-group">
          <button type="button" className="step-btn" onClick={onStepBack} disabled={index <= 0}>
            ◀ 한 단계
          </button>
          <button type="button" className="step-btn" onClick={onStepForward} disabled={finished}>
            한 단계 ▶
          </button>
        </div>
        <button type="button" className="link-btn" onClick={onSkipToEnd} disabled={finished && !playing}>
          결과 보기
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
