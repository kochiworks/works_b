import { useCallback, useEffect, useState } from 'react'

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'veryFast'

export const SPEED_LABELS: Record<AnimationSpeed, string> = {
  slow: '느리게',
  normal: '보통',
  fast: '빠르게',
  veryFast: '매우 빠르게',
}

/** Milliseconds between each newly-revealed case. */
const SPEED_MS: Record<AnimationSpeed, number> = {
  slow: 700,
  normal: 320,
  fast: 130,
  veryFast: 30,
}

/**
 * Drives a "build up from nothing" animation over `total` items (cases).
 * Defaults to fully revealed (so results show immediately as before); call
 * `playFromStart` to replay the build-up on demand.
 */
export function useCaseAnimation(total: number) {
  const [revealed, setRevealed] = useState(total)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<AnimationSpeed>('normal')

  // A new result set (different n/r/mode/options) always starts fully shown.
  useEffect(() => {
    setRevealed(total)
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

  return { revealed, total, playing, speed, setSpeed, playFromStart, pause, resume, skipToEnd }
}
