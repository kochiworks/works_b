import { useCallback, useEffect, useState } from 'react'

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'veryFast'

export const SPEED_LABELS: Record<AnimationSpeed, string> = {
  slow: '느리게',
  normal: '보통',
  fast: '빠르게',
  veryFast: '매우 빠르게',
}

/** Milliseconds between each newly-revealed cell. */
const SPEED_MS: Record<AnimationSpeed, number> = {
  slow: 1300,
  normal: 700,
  fast: 260,
  veryFast: 60,
}

/**
 * Drives a "build up from nothing" animation over `total` cells (one item within one
 * case, so a row with r columns takes r steps). Every new result set starts at step 0
 * (nothing revealed yet) rather than jumping straight to the finished result; call
 * `playFromStart`/`resume` to animate, or `stepForward`/`stepBack` to advance one cell
 * at a time by hand, or `skipToEnd` to jump straight to the full result.
 */
export function useCaseAnimation(total: number) {
  const [revealed, setRevealed] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<AnimationSpeed>('normal')

  // A new result set (different n/r/mode/options) always starts from step 0.
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
  }
}
