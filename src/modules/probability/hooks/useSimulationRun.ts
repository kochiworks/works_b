import { useCallback, useEffect, useState } from 'react'
import { runTrials } from '../lib/probability'
import type { Outcome } from '../lib/types'

export const TRIAL_COUNT_MIN = 10
export const TRIAL_COUNT_MAX = 300
export const TRIAL_COUNT_STEP = 10
export const TRIAL_COUNT_DEFAULT = 60

/** Generates one batch of `trialCount` random trials from the current sample space
 *  and keeps it stable across re-renders — a fresh batch is only drawn when the
 *  sample space or trial count changes, or when the student explicitly asks for a
 *  new run via `reroll` (e.g. after watching one simulation converge, try again and
 *  see a different — but similarly-converging — path). */
export function useSimulationRun(sampleSpace: Outcome[], trialCount: number) {
  const [trials, setTrials] = useState<Outcome[]>(() => runTrials(sampleSpace, trialCount))

  useEffect(() => {
    setTrials(runTrials(sampleSpace, trialCount))
    // sampleSpace is a freshly-computed array each render it changes, so this only
    // reruns when its identity actually changes (useMemo upstream) or trialCount does.
  }, [sampleSpace, trialCount])

  const reroll = useCallback(() => {
    setTrials(runTrials(sampleSpace, trialCount))
  }, [sampleSpace, trialCount])

  return { trials, reroll }
}
