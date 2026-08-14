import { useCallback, useEffect, useState } from 'react'

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'veryFast'

export const SPEED_LABELS: Record<AnimationSpeed, string> = {
  slow: '느리게',
  normal: '보통',
  fast: '빠르게',
  veryFast: '매우 빠르게',
}

/** Milliseconds per step; STEP_COUNT steps make up the whole transform, so e.g.
 *  'normal' completes the full move in STEP_COUNT * 45 ≈ 1.1s. */
const SPEED_MS: Record<AnimationSpeed, number> = {
  slow: 100,
  normal: 45,
  fast: 22,
  veryFast: 10,
}

export const STEP_COUNT = 24

/**
 * Drives a "watch it move" animation over STEP_COUNT discrete steps, mirroring the
 * combinatorics module's build-up animation (revealed/total, play/pause/step/speed)
 * but over a continuous [0, 1] transform progress instead of a count of items.
 * Always starts at step 0 (shape sitting at its original position) — call `reset`
 * whenever the shape or transform changes so a finished animation doesn't linger.
 */
export function useAnimationProgress() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<AnimationSpeed>('normal')

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

  const reset = useCallback(() => {
    setStep(0)
    setPlaying(false)
  }, [])

  return {
    step,
    total: STEP_COUNT,
    progress: step / STEP_COUNT,
    playing,
    speed,
    setSpeed,
    playFromStart,
    pause,
    resume,
    skipToEnd,
    stepForward,
    stepBack,
    reset,
  }
}
