import { StepBeads } from './StepBeads'
import { buildStepChips } from '../lib/stepChips'
import { PLACE_LABELS } from '../lib/types'
import type { OperandValues, OperationKind, Stage } from '../lib/types'

interface Props {
  kind: OperationKind
  values: OperandValues
  stages: Stage[]
  /** How many stages have been revealed by the animation so far — stage 0
   *  (the initial "구슬 묶음으로 나타냈어요" setup) never gets its own row here,
   *  since it has no 자리 to summarize yet. */
  uptoIndex: number
}

/** One row per 자리 processed so far, each pairing that step's bead sequence
 *  with its own explanation sentence on the same line — replaces the older
 *  design where the block panels sat far above a plain scrolling list of
 *  sentences with no visual tie back to which beads they were describing. */
export function StepList({ kind, values, stages, uptoIndex }: Props) {
  const rows = stages
    .slice(1, uptoIndex + 1)
    .map((stage) => ({ stage, chips: buildStepChips(kind, values, stage) }))
    .filter((row): row is { stage: Stage; chips: NonNullable<ReturnType<typeof buildStepChips>> } => row.chips !== null)

  if (rows.length === 0) {
    return <p className="horizontal-empty">재생 버튼을 누르면 자리별 계산이 한 단계씩 이 자리에 나타나요.</p>
  }

  return (
    <div className="step-list">
      {rows.map(({ stage, chips }, index) => (
        <div key={stage.place} className={index === rows.length - 1 ? 'step-row is-latest' : 'step-row'}>
          <span className="step-row-place">{stage.place && PLACE_LABELS[stage.place]}</span>
          <StepBeads chips={chips} />
          <p className="step-row-text">{stage.horizontalLines.at(-1)}</p>
        </div>
      ))}
    </div>
  )
}
