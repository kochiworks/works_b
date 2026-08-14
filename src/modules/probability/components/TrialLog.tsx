import { usePrevious } from '../hooks/usePrevious'
import type { EventOption, Outcome } from '../lib/types'

/** Above this many newly-revealed trials in one render (e.g. clicking "전체 보기" on a
 *  large batch), skip the per-tile mount animation — same reasoning as the 경우의 수
 *  module's result table: firing a CSS animation on hundreds of tiles at once is what
 *  causes jank, not the DOM size itself. */
const ANIMATE_JUMP_THRESHOLD = 30

interface Props {
  trials: Outcome[]
  revealed: number
  event: EventOption
}

export function TrialLog({ trials, revealed, event }: Props) {
  const previousRevealed = usePrevious(revealed)
  const animate = Math.abs(revealed - previousRevealed) <= ANIMATE_JUMP_THRESHOLD

  if (trials.length === 0) {
    return <p className="hint">시행 결과가 여기에 하나씩 나타납니다.</p>
  }

  return (
    <div className="trial-log-scroll">
      <div className="trial-log-grid">
        {trials.slice(0, revealed).map((trial, index) => {
          const hit = event.matches(trial)
          return (
            <span
              key={index}
              className={`trial-tile ${hit ? 'is-hit' : 'is-miss'}${animate ? ' cell-enter' : ''}`}
              title={`${index + 1}번째 시행: ${trial.label}${hit ? ' (사건 A 발생)' : ''}`}
            >
              {trial.color && <span className="trial-tile-swatch" style={{ background: trial.color }} />}
              {trial.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
