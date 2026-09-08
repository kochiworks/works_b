import { useCallback, useEffect, useState } from 'react'

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'veryFast'

export const SPEED_LABELS: Record<AnimationSpeed, string> = {
  slow: '느리게',
  normal: '보통',
  fast: '빠르게',
  veryFast: '매우 빠르게',
}

/** Milliseconds per step — a step here is a whole set being drawn, so this sits
 *  near 가로셈 · 세로셈 탐구기's 자리별 pace rather than 수 감각 익히기's
 *  bead-by-bead one. */
const SPEED_MS: Record<AnimationSpeed, number> = {
  slow: 2600,
  normal: 1600,
  fast: 900,
  veryFast: 450,
}

/**
 * Steps through a built-up expression by index, in the same shape the other
 * modules use. Starts fully revealed so the finished picture is what you see
 * on arrival; 처음부터 재생 replays the build for someone who wants to watch
 * each operand appear before the operation that uses it.
 *
 * `resetKey` is the chosen operation: two different operations can happen to
 * have the same number of steps, and without it switching between them would
 * leave the animation halfway through the new one.
 */
export function useStepAnimation(stepCount: number, resetKey: string) {
  const lastIndex = Math.max(0, stepCount - 1)
  const [rawIndex, setIndex] = useState(lastIndex)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<AnimationSpeed>('normal')

  // Clamped during render, not just in the effect below, so a switch to an
  // operation with fewer steps never shows an out-of-range index for a frame.
  const index = Math.min(rawIndex, lastIndex)

  useEffect(() => {
    setIndex(Math.max(0, stepCount - 1))
    setPlaying(false)
  }, [stepCount, resetKey])

  useEffect(() => {
    if (!playing) return
    if (index >= lastIndex) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => {
      setIndex((current) => Math.min(current + 1, lastIndex))
    }, SPEED_MS[speed])
    return () => clearTimeout(timer)
  }, [playing, index, speed, lastIndex])

  const playFromStart = useCallback(() => {
    setIndex(0)
    setPlaying(true)
  }, [])

  const pause = useCallback(() => setPlaying(false), [])

  const resume = useCallback(() => {
    setIndex((current) => (current >= lastIndex ? 0 : current))
    setPlaying(true)
  }, [lastIndex])

  const skipToEnd = useCallback(() => {
    setPlaying(false)
    setIndex(lastIndex)
  }, [lastIndex])

  const stepForward = useCallback(() => {
    setPlaying(false)
    setIndex((current) => Math.min(current + 1, lastIndex))
  }, [lastIndex])

  const stepBack = useCallback(() => {
    setPlaying(false)
    setIndex((current) => Math.max(current - 1, 0))
  }, [])

  return {
    index,
    total: lastIndex,
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
