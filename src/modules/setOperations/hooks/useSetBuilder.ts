import { useCallback, useMemo, useState } from 'react'
import { SITUATIONS, gradeSelection } from '../lib/situations'
import type { BuildFeedback, Situation } from '../lib/situations'

export interface SetBuilderState {
  situation: Situation
  situationId: string
  chooseSituation: (id: string) => void
  selected: number[]
  toggle: (value: number) => void
  clear: () => void
  revealAnswer: () => void
  checked: boolean
  check: () => void
  feedback: BuildFeedback
}

/** Step 1: picking the elements that match a described situation. */
export function useSetBuilder(initialId: string = SITUATIONS[0].id): SetBuilderState {
  const [situationId, setSituationId] = useState(initialId)
  const [picked, setPicked] = useState<number[]>([])
  const [checked, setChecked] = useState(false)

  const situation = useMemo(
    () => SITUATIONS.find((s) => s.id === situationId) ?? SITUATIONS[0],
    [situationId],
  )

  // A new situation brings its own candidates, so nothing from the previous
  // one should stay selected — and its verdict should not stay on screen.
  const chooseSituation = useCallback((id: string) => {
    setSituationId(id)
    setPicked([])
    setChecked(false)
  }, [])

  const toggle = useCallback((value: number) => {
    setChecked(false)
    setPicked((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }, [])

  const clear = useCallback(() => {
    setPicked([])
    setChecked(false)
  }, [])

  const revealAnswer = useCallback(() => {
    setPicked([...situation.answer])
    setChecked(true)
  }, [situation])

  const selected = useMemo(() => [...picked].sort((a, b) => a - b), [picked])
  const feedback = useMemo(() => gradeSelection(situation, selected), [situation, selected])

  return {
    situation,
    situationId,
    chooseSituation,
    selected,
    toggle,
    clear,
    revealAnswer,
    checked,
    check: () => setChecked(true),
    feedback,
  }
}
