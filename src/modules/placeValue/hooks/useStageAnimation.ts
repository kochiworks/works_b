import { useCallback, useEffect, useState } from 'react'

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'veryFast'

export const SPEED_LABELS: Record<AnimationSpeed, string> = {
  slow: '느리게',
  normal: '보통',
  fast: '빠르게',
  veryFast: '매우 빠르게',
}

/** Milliseconds per stage — each stage here is a whole 자리 (place), not a
 *  single bead, so this is much slower per step than 수 감각 익히기's
 *  useBeadAnimation (which flips one bead at a time). */
const SPEED_MS: Record<AnimationSpeed, number> = {
  slow: 2400,
  normal: 1400,
  fast: 800,
  veryFast: 400,
}

/**
 * Steps through a computed outcome's `stages` array by index — unlike 수 감각
 * 익히기's bead-by-bead animation, each stage here is already a complete
 * snapshot (built by addition.ts/subtraction.ts/etc.), so "advancing" just
 * means picking the next index, no incremental placement merge needed.
 * Starts fully revealed (last stage) so operand sliders show their answer
 * immediately; "처음부터 재생" replays from stage 0 for a student who wants to
 * watch the 자리별 calculation unfold.
 */
export function useStageAnimation(stageCount: number) {
  const lastIndex = Math.max(0, stageCount - 1)
  const [rawIndex, setIndex] = useState(lastIndex)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<AnimationSpeed>('normal')

  // Different operations have different stage counts (나눗셈 has one more than
  // 덧셈/뺄셈/곱셈), so switching kinds can leave `rawIndex` pointing past the
  // end of the *new* stages array for one render — before the effect below
  // gets a chance to correct it. Clamping here, during render, means every
  // consumer always sees a valid index immediately, not just after the
  // effect fires on the next tick.
  const index = Math.min(rawIndex, lastIndex)

  useEffect(() => {
    setIndex(Math.max(0, stageCount - 1))
    setPlaying(false)
  }, [stageCount])

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
