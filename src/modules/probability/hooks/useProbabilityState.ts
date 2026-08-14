import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BALL_GROUP_COUNT_MAX,
  BALL_GROUP_COUNT_MIN,
  COIN_COUNT_MAX,
  COIN_COUNT_MIN,
  DEFAULT_BALL_GROUPS,
  DICE_COUNT_MAX,
  DICE_COUNT_MIN,
  ballEventOptions,
  ballSampleSpace,
  coinEventOptions,
  coinSampleSpace,
  diceEventOptions,
  diceSampleSpace,
} from '../lib/experiments'
import type { BallGroup } from '../lib/experiments'
import { computeProbability } from '../lib/probability'
import type { EventOption, ExperimentKind, Outcome } from '../lib/types'

export interface ProbabilityPreset {
  kind: ExperimentKind
  coinCount?: number
  diceCount?: number
  ballGroups?: BallGroup[]
  eventId: string
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function useProbabilityState() {
  const [kind, setKindState] = useState<ExperimentKind>('coin')
  const [coinCount, setCoinCountState] = useState(2)
  const [diceCount, setDiceCountState] = useState(1)
  const [ballGroups, setBallGroups] = useState<BallGroup[]>(DEFAULT_BALL_GROUPS)
  const [eventId, setEventId] = useState('at-least-one-head')

  const setKind = useCallback((next: ExperimentKind) => setKindState(next), [])
  const setCoinCount = useCallback((count: number) => setCoinCountState(clamp(count, COIN_COUNT_MIN, COIN_COUNT_MAX)), [])
  const setDiceCount = useCallback((count: number) => setDiceCountState(clamp(count, DICE_COUNT_MIN, DICE_COUNT_MAX)), [])

  const setBallGroupCount = useCallback((id: string, count: number) => {
    setBallGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, count: clamp(count, BALL_GROUP_COUNT_MIN, BALL_GROUP_COUNT_MAX) } : g)),
    )
  }, [])
  const renameBallGroup = useCallback((id: string, label: string) => {
    setBallGroups((prev) => prev.map((g) => (g.id === id ? { ...g, label } : g)))
  }, [])

  const sampleSpace = useMemo<Outcome[]>(() => {
    switch (kind) {
      case 'coin':
        return coinSampleSpace(coinCount)
      case 'dice':
        return diceSampleSpace(diceCount)
      case 'ball':
        return ballSampleSpace(ballGroups)
    }
  }, [kind, coinCount, diceCount, ballGroups])

  const eventOptions = useMemo<EventOption[]>(() => {
    switch (kind) {
      case 'coin':
        return coinEventOptions(coinCount)
      case 'dice':
        return diceEventOptions(diceCount)
      case 'ball':
        return ballEventOptions(ballGroups)
    }
  }, [kind, coinCount, diceCount, ballGroups])

  // Whenever the experiment/settings change, the previously-selected event id may no
  // longer exist (e.g. switching from dice to coin) — fall back to the first option.
  useEffect(() => {
    if (!eventOptions.some((option) => option.id === eventId)) {
      setEventId(eventOptions[0]?.id ?? '')
    }
    // eventId is intentionally excluded — this effect only reacts to eventOptions changing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventOptions])

  const selectedEvent = eventOptions.find((option) => option.id === eventId) ?? eventOptions[0]
  const probability = useMemo(
    () => (selectedEvent ? computeProbability(sampleSpace, selectedEvent) : null),
    [sampleSpace, selectedEvent],
  )

  const applyPreset = useCallback((preset: ProbabilityPreset) => {
    setKindState(preset.kind)
    if (preset.coinCount) setCoinCountState(preset.coinCount)
    if (preset.diceCount) setDiceCountState(preset.diceCount)
    if (preset.ballGroups) setBallGroups(preset.ballGroups)
    setEventId(preset.eventId)
  }, [])

  return {
    kind,
    setKind,
    coinCount,
    setCoinCount,
    diceCount,
    setDiceCount,
    ballGroups,
    setBallGroupCount,
    renameBallGroup,
    sampleSpace,
    eventOptions,
    eventId,
    setEventId,
    selectedEvent,
    probability,
    applyPreset,
  }
}
