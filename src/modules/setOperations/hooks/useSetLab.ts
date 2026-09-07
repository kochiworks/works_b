import { useCallback, useMemo, useState } from 'react'
import { UNIVERSE_MAX, UNIVERSE_MIN, emptyMembership } from '../lib/types'
import type { Membership, SetName } from '../lib/types'

/** A named arrangement of the universe into sets, used by presets. */
export interface MembershipSpec {
  universeSize?: number
  A: number[]
  B: number[]
  C?: number[]
}

/**
 * Eight elements arranged so that every one of the three-set diagram's eight
 * regions holds exactly one — the clearest starting picture for reading a Venn
 * diagram, and it doubles as a sensible two-set example.
 */
export const DEFAULT_SPEC: MembershipSpec = {
  universeSize: 8,
  A: [2, 5, 6, 8],
  B: [3, 5, 7, 8],
  C: [4, 6, 7, 8],
}

function buildMembership(spec: MembershipSpec, size: number): Record<number, Membership> {
  const membership: Record<number, Membership> = {}
  for (let value = 1; value <= size; value++) {
    membership[value] = {
      A: spec.A.includes(value),
      B: spec.B.includes(value),
      C: (spec.C ?? []).includes(value),
    }
  }
  return membership
}

export interface SetLabState {
  universeSize: number
  universe: number[]
  membership: Record<number, Membership>
  setUniverseSize: (size: number) => void
  toggle: (value: number, name: SetName) => void
  clearSets: () => void
  applySpec: (spec: MembershipSpec) => void
  elementsOf: (name: SetName) => number[]
}

/** Steps 2 and 3 share one universe, so the sets you build carry across them. */
export function useSetLab(): SetLabState {
  const [universeSize, setSize] = useState(DEFAULT_SPEC.universeSize ?? 8)
  const [membership, setMembership] = useState<Record<number, Membership>>(() =>
    buildMembership(DEFAULT_SPEC, DEFAULT_SPEC.universeSize ?? 8),
  )

  const universe = useMemo(
    () => Array.from({ length: universeSize }, (_, i) => i + 1),
    [universeSize],
  )

  // Growing the universe keeps what is already arranged and starts the new
  // elements outside every set; shrinking simply stops showing the tail.
  const setUniverseSize = useCallback((size: number) => {
    const clamped = Math.min(Math.max(Math.round(size), UNIVERSE_MIN), UNIVERSE_MAX)
    setSize(clamped)
    setMembership((prev) => {
      const next: Record<number, Membership> = {}
      for (let value = 1; value <= clamped; value++) next[value] = prev[value] ?? emptyMembership()
      return next
    })
  }, [])

  const toggle = useCallback((value: number, name: SetName) => {
    setMembership((prev) => {
      const current = prev[value] ?? emptyMembership()
      return { ...prev, [value]: { ...current, [name]: !current[name] } }
    })
  }, [])

  const clearSets = useCallback(() => {
    setMembership((prev) => {
      const next: Record<number, Membership> = {}
      for (const key of Object.keys(prev)) next[Number(key)] = emptyMembership()
      return next
    })
  }, [])

  const applySpec = useCallback((spec: MembershipSpec) => {
    const size = Math.min(Math.max(spec.universeSize ?? 8, UNIVERSE_MIN), UNIVERSE_MAX)
    setSize(size)
    setMembership(buildMembership(spec, size))
  }, [])

  const elementsOf = useCallback(
    (name: SetName) => universe.filter((value) => membership[value]?.[name]),
    [universe, membership],
  )

  return { universeSize, universe, membership, setUniverseSize, toggle, clearSets, applySpec, elementsOf }
}
