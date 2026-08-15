import { useCallback, useMemo, useState } from 'react'
import { OPERATION_CONFIGS, computeResult, defaultOperandValues, sanitizeOperandPair } from '../lib/operationConfigs'
import type { OperandKey, OperandValues, OperationKind } from '../lib/types'

export interface NumberSensePreset {
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

/**
 * Mirrors the 함수의 그래프 module's useFunctionState: each operation keeps its
 * own a/b values in `valuesByKind`, so switching from 덧셈 to 나눗셈 and back
 * doesn't discard what the student had set on 덧셈.
 */
export function useNumberSenseState() {
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

  const applyPreset = useCallback((preset: NumberSensePreset) => {
    setKindState(preset.kind)
    setValuesByKind((prev) => ({ ...prev, [preset.kind]: sanitizeOperandPair(preset.kind, preset.values) }))
  }, [])

  const values = valuesByKind[kind]
  const result = useMemo(() => computeResult(kind, values), [kind, values])

  return {
    kind,
    setKind,
    config: OPERATION_CONFIGS[kind],
    values,
    result,
    setOperand,
    resetOperands,
    applyPreset,
  }
}
