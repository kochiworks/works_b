import type { StepChip } from '../lib/stepChips'

interface Props {
  chips: StepChip[]
}

/** Renders one stage's bead sequence — small dot clusters (≤9 dots, sized up
 *  from the dense block-panel dots so a lone digit's worth is still easy to
 *  count at a glance) interleaved with operator symbols and
 *  carry/borrow/remainder badges. */
export function StepBeads({ chips }: Props) {
  return (
    <div className="step-beads">
      {chips.map((chip, index) => {
        if (chip.kind === 'symbol') {
          return (
            <span key={index} className="step-symbol">
              {chip.text}
            </span>
          )
        }
        if (chip.kind === 'badge') {
          return (
            <span key={index} className={`step-badge step-badge--${chip.tone}`}>
              {chip.text}
            </span>
          )
        }
        return (
          <span key={index} className="step-dot-cluster">
            {Array.from({ length: chip.count }, (_, i) => (
              <span key={i} className={`step-dot step-dot--${chip.place}`} />
            ))}
            {chip.count === 0 && <span className="step-dot-zero">0</span>}
          </span>
        )
      })}
    </div>
  )
}
