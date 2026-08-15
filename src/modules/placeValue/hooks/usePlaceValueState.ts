import { useCallback, useMemo, useState } from 'react'
import { OPERATION_CONFIGS, defaultOperandValues, sanitizeOperandPair } from '../lib/operationConfigs'
import type { OperandKey, OperandValues, OperationKind } from '../lib/types'

export interface PlaceValuePreset {
  kind: OperationKind
  values: OperandValues
}

function initialValuesByKind(): Record<OperationKind, OperandValues> {
  const values = {} as Record<OperationKind, OperandValues>
  for (const kind of Object.keys(OPERATION_CONFIGS) as OperationKind[]) {
    values[kind] = defaultOperandValues(kind)
  }
  return values
}

/** Mirrors 수 감각 익히기's useNumberSenseState: each operation keeps its own
 *  a/b values, so switching tabs doesn't discard what the student had set. */
export function usePlaceValueState() {
  const [kind, setKindState] = useState<OperationKind>('addition')
  const [valuesByKind, setValuesByKind] = useState<Record<OperationKind, OperandValues>>(initialValuesByKind)

  const setKind = useCallback((next: OperationKind) => {
    setKindState(next)
  }, [])

  const setOperand = useCallback(
    (key: OperandKey, value: number) => {
      setValuesByKind((prev) => {
        const candidate = { ...prev[kind], [key]: value }
        return { ...prev, [kind]: sanitizeOperandPair(kind, candidate) }
      })
    },
    [kind],
  )

  const resetOperands = useCallback(() => {
    setValuesByKind((prev) => ({ ...prev, [kind]: defaultOperandValues(kind) }))
  }, [kind])

  const applyPreset = useCallback((preset: PlaceValuePreset) => {
    setKindState(preset.kind)
    setValuesByKind((prev) => ({ ...prev, [preset.kind]: sanitizeOperandPair(preset.kind, preset.values) }))
  }, [])

  const values = valuesByKind[kind]
  const config = OPERATION_CONFIGS[kind]
  const outcome = useMemo(() => config.compute(values.a, values.b), [config, values])

  return {
    kind,
    setKind,
    config,
    values,
    outcome,
    setOperand,
    resetOperands,
    applyPreset,
  }
}
