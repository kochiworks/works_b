import type { OperationStep } from '../lib/steps'
import { Katex } from './Katex'

interface Props {
  steps: OperationStep[]
  /** Shared index across both sides; a shorter side holds on its last step. */
  index: number
  /** Shown above the trail when two sides are being compared. */
  heading?: string
}

/**
 * The whole sequence for one side, with everything up to the current step
 * filled in and the rest still waiting — so the order the picture was built in
 * stays on screen instead of vanishing as the animation moves on.
 */
export function StepTrail({ steps, index, heading }: Props) {
  const current = Math.min(index, steps.length - 1)

  return (
    <div className="step-trail">
      {heading && (
        <p className="step-trail-heading">
          <Katex tex={heading} />
        </p>
      )}
      <ol className="step-trail-list">
        {steps.map((step, i) => {
          const state = i < current ? 'is-done' : i === current ? 'is-current' : 'is-waiting'
          return (
            <li key={step.tex} className={`step-trail-item ${state}`}>
              <span className="step-trail-index">{i + 1}</span>
              <Katex tex={step.tex} className="step-trail-tex" />
            </li>
          )
        })}
      </ol>
      <p className="step-trail-caption">{steps[current]?.caption}</p>
    </div>
  )
}
