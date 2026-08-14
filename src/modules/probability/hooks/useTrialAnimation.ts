import { useCallback, useEffect, useState } from 'react'

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'veryFast'

export const SPEED_LABELS: Record<AnimationSpeed, string> = {
  slow: '느리게',
  normal: '보통',
  fast: '빠르게',
  veryFast: '매우 빠르게',
}

/** Milliseconds between each newly-revealed trial. */
const SPEED_MS: Record<AnimationSpeed, number> = {
  slow: 500,
  normal: 220,
  fast: 90,
  veryFast: 25,
}

/**
 * Drives a "build up from nothing" animation over `total` trials, mirroring the
 * combinatorics module's cell-by-cell reveal — every new trial batch starts at step 0
 * (nothing revealed yet) so students watch each trial land one at a time instead of
 * seeing the whole simulation's result all at once. `playFromStart`/`resume` animate,
 * `stepForward`/`stepBack` advance one trial at a time by hand, `skipToEnd` jumps
 * straight to the full batch of trials.
 */
export function useTrialAnimation(total: number) {
  const [revealed, setRevealed] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<AnimationSpeed>('normal')

  // A new trial batch (different experiment/event/trial count, or a reroll) always
  // starts from step 0.
  useEffect(() => {
    setRevealed(0)
    setPlaying(false)
  }, [total])

  useEffect(() => {
    if (!playing) return
    if (revealed >= total) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => {
      setRevealed((current) => Math.min(current + 1, total))
    }, SPEED_MS[speed])
    return () => clearTimeout(timer)
  }, [playing, revealed, total, speed])

  const playFromStart = useCallback(() => {
    setRevealed(0)
    setPlaying(true)
  }, [])

  const pause = useCallback(() => setPlaying(false), [])

  const resume = useCallback(() => {
    setRevealed((current) => (current >= total ? 0 : current))
    setPlaying(true)
  }, [total])

  const skipToEnd = useCallback(() => {
    setPlaying(false)
    setRevealed(total)
  }, [total])

  const stepForward = useCallback(() => {
    setPlaying(false)
    setRevealed((current) => Math.min(current + 1, total))
  }, [total])

  const stepBack = useCallback(() => {
    setPlaying(false)
    setRevealed((current) => Math.max(current - 1, 0))
  }, [])

  const reset = useCallback(() => {
    setRevealed(0)
    setPlaying(false)
  }, [])

  return {
    revealed,
    total,
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
