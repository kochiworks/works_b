import { useCallback, useState } from 'react'
import { ANGLE_DATA } from '../lib/angleData'
import type { AngleDeg, RatioKind } from '../lib/types'

/**
 * All the simulator remembers: which special angle is on screen and which of
 * sin / cos / tan is currently highlighted. Both are small closed sets, so the
 * UI is two segmented controls rather than sliders — a slider would invite
 * "37°", which a 중3 can't evaluate without a table.
 */
export function useTrigRatioState() {
  const [angleDeg, setAngleDeg] = useState<AngleDeg>(30)
  const [ratio, setRatio] = useState<RatioKind>('sin')

  const selectAngle = useCallback((next: AngleDeg) => setAngleDeg(next), [])
  const selectRatio = useCallback((next: RatioKind) => setRatio(next), [])

  return {
    angleDeg,
    ratio,
    selectAngle,
    selectRatio,
    data: ANGLE_DATA[angleDeg],
  }
}
