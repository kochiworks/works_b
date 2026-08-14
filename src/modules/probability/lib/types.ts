export type ExperimentKind = 'coin' | 'dice' | 'ball'

export const EXPERIMENT_LABELS: Record<ExperimentKind, string> = {
  coin: '동전 던지기',
  dice: '주사위 굴리기',
  ball: '공 뽑기',
}

export const EXPERIMENT_DESCRIPTIONS: Record<ExperimentKind, string> = {
  coin: '동전 여러 개를 동시에 던져 나오는 면을 관찰합니다.',
  dice: '주사위 여러 개를 동시에 굴려 나오는 눈의 수를 관찰합니다.',
  ball: '주머니에서 공을 하나 꺼내 색을 확인하고 다시 넣습니다 (복원추출).',
}

/** One result of a single trial — a coin toss, a dice roll, a ball draw. `meta` carries
 *  whatever numeric/string facts about it an event predicate might need to check
 *  (e.g. a dice roll's sum, a coin toss's heads count), kept generic so every
 *  experiment kind can share the same downstream UI (TrialLog, FrequencyChart, ...). */
export interface Outcome {
  id: string
  label: string
  /** Ball experiment only — used for the swatch color in the trial log. */
  color?: string
  meta: Record<string, number | string>
}

/** A named event (사건) — a subset of the sample space, defined as a predicate over
 *  outcomes rather than an explicit list, so it stays correct if the sample space is
 *  regenerated (e.g. the coin count changes). */
export interface EventOption {
  id: string
  label: string
  matches: (outcome: Outcome) => boolean
}
