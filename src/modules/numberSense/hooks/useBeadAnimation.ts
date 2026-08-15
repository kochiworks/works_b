import { useCallback, useEffect, useState } from 'react'

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'veryFast'

export const SPEED_LABELS: Record<AnimationSpeed, string> = {
  slow: '느리게',
  normal: '보통',
  fast: '빠르게',
  veryFast: '매우 빠르게',
}

/** Milliseconds per bead — a division board can need up to ~90 placements, so
 *  these are tuned faster than 도형의 이동's per-step timing (that animates a
 *  continuous move over a fixed 24 steps; this animates a variable, often much
 *  larger, count of discrete bead placements). */
const SPEED_MS: Record<AnimationSpeed, number> = {
  slow: 220,
  normal: 90,
  fast: 40,
  veryFast: 15,
}

/**
 * Steps through a bead board's placement list one bead at a time. Unlike the
 * 도형의 이동 module's animation (which always starts unmoved and needs a click
 * to play), this starts fully revealed — sliders should show their answer
 * immediately, the same way the 함수의 그래프 module's graph redraws instantly
 * when a coefficient changes. "처음부터 재생" is there for a student who wants to
 * watch the beads go down one by one, not a required first step.
 */
export function useBeadAnimation(totalSteps: number) {
  const [step, setStep] = useState(totalSteps)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<AnimationSpeed>('normal')

  // A new operand/operation means a new placement list — snap to "fully shown"
  // and stop any run in progress rather than let a stale animation keep going.
  useEffect(() => {
    setStep(totalSteps)
    setPlaying(false)
  }, [totalSteps])

  useEffect(() => {
    if (!playing) return
    if (step >= totalSteps) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => {
      setStep((current) => Math.min(current + 1, totalSteps))
    }, SPEED_MS[speed])
    return () => clearTimeout(timer)
  }, [playing, step, speed, totalSteps])

  const playFromStart = useCallback(() => {
    setStep(0)
    setPlaying(true)
  }, [])

  const pause = useCallback(() => setPlaying(false), [])

  const resume = useCallback(() => {
    setStep((current) => (current >= totalSteps ? 0 : current))
    setPlaying(true)
  }, [totalSteps])

  const skipToEnd = useCallback(() => {
    setPlaying(false)
    setStep(totalSteps)
  }, [totalSteps])

  const stepForward = useCallback(() => {
    setPlaying(false)
    setStep((current) => Math.min(current + 1, totalSteps))
  }, [totalSteps])

  const stepBack = useCallback(() => {
    setPlaying(false)
    setStep((current) => Math.max(current - 1, 0))
  }, [])

  return {
    step,
    total: totalSteps,
    playing,
    speed,
    setSpeed,
    playFromStart,
    pause,
    resume,
    skipToEnd,
    stepForward,
    stepBack,
  }
}
