import { useCallback, useEffect, useMemo, useState } from 'react'

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'veryFast'

export const SPEED_LABELS: Record<AnimationSpeed, string> = {
  slow: '느리게',
  normal: '보통',
  fast: '빠르게',
  veryFast: '매우 빠르게',
}

const SPEED_MS: Record<AnimationSpeed, number> = {
  slow: 500,
  normal: 260,
  fast: 110,
  veryFast: 30,
}

export const STEP_COUNT = 24
/** Smallest n the sweep starts from — small enough that the binomial bars are
 *  visibly chunky/discrete, not so small the shape is degenerate. */
const START_N = 4

/**
 * Animates the sample size n used by the normal-approximation chart, sweeping it
 * from a small starting value up to the current trial count so a student can watch
 * the discrete binomial bars visibly tighten around the smooth normal curve as n
 * grows, instead of only ever seeing one static snapshot. n is stepped
 * *geometrically* rather than linearly — e.g. 4, 6, 9, 14, 21, 32, ... — so the
 * animation spends its steps where the shape is still visibly changing (small n)
 * rather than burning most of them on an already-converged tail (n in the hundreds).
 *
 * Defaults to already showing the target n in full (step = STEP_COUNT) so the chart
 * looks the same as a static one until the student explicitly presses play; moving
 * the trial-count slider just re-snaps to the new target rather than auto-replaying.
 */
export function useNormalApproxAnimation(targetN: number) {
  const [step, setStep] = useState(STEP_COUNT)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<AnimationSpeed>('normal')

  useEffect(() => {
    setStep(STEP_COUNT)
    setPlaying(false)
  }, [targetN])

  useEffect(() => {
    if (!playing) return
    if (step >= STEP_COUNT) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => {
      setStep((current) => Math.min(current + 1, STEP_COUNT))
    }, SPEED_MS[speed])
    return () => clearTimeout(timer)
  }, [playing, step, speed])

  const playFromStart = useCallback(() => {
    setStep(0)
    setPlaying(true)
  }, [])

  const pause = useCallback(() => setPlaying(false), [])

  const resume = useCallback(() => {
    setStep((current) => (current >= STEP_COUNT ? 0 : current))
    setPlaying(true)
  }, [])

  const skipToEnd = useCallback(() => {
    setPlaying(false)
    setStep(STEP_COUNT)
  }, [])

  const stepForward = useCallback(() => {
    setPlaying(false)
    setStep((current) => Math.min(current + 1, STEP_COUNT))
  }, [])

  const stepBack = useCallback(() => {
    setPlaying(false)
    setStep((current) => Math.max(current - 1, 0))
  }, [])

  const currentN = useMemo(() => {
    const start = Math.min(START_N, targetN)
    if (targetN <= start) return targetN
    const ratio = step / STEP_COUNT
    const n = Math.round(start * (targetN / start) ** ratio)
    return Math.min(Math.max(n, start), targetN)
  }, [step, targetN])

  return {
    step,
    total: STEP_COUNT,
    playing,
    speed,
    setSpeed,
    playFromStart,
    pause,
    resume,
    skipToEnd,
    stepForward,
    stepBack,
    currentN,
    atTarget: currentN === targetN,
  }
}
