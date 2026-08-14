import { useCallback, useState } from 'react'
import { FUNCTION_CONFIGS, defaultCoefficientValues, sanitizeCoefficient } from '../lib/functionConfigs'
import { CATEGORY_KINDS } from '../lib/types'
import type { CoefficientKey, CoefficientValues, FunctionCategory, FunctionKind } from '../lib/types'

export interface FunctionPreset {
  category: FunctionCategory
  kind: FunctionKind
  values: CoefficientValues
}

function initialValuesByKind(): Record<FunctionKind, CoefficientValues> {
  const values = {} as Record<FunctionKind, CoefficientValues>
  for (const kind of Object.keys(FUNCTION_CONFIGS) as FunctionKind[]) {
    values[kind] = defaultCoefficientValues(kind)
  }
  return values
}

/**
 * Each function kind keeps its own coefficient values in `valuesByKind` — switching
 * from, say, 이차함수 to 사인함수 and back preserves whatever the student had set on
 * 이차함수, the same "don't discard work when switching kinds" convention as the
 * 도형의 이동 module's per-shape-kind state.
 */
export function useFunctionState() {
  const [category, setCategoryState] = useState<FunctionCategory>('polynomial')
  const [kind, setKindState] = useState<FunctionKind>('linear')
  const [valuesByKind, setValuesByKind] = useState<Record<FunctionKind, CoefficientValues>>(initialValuesByKind)

  const setCategory = useCallback((next: FunctionCategory) => {
    setCategoryState(next)
    setKindState(CATEGORY_KINDS[next][0])
  }, [])

  const setKind = useCallback((next: FunctionKind) => {
    setKindState(next)
  }, [])

  const setCoefficient = useCallback(
    (key: CoefficientKey, value: number) => {
      const spec = FUNCTION_CONFIGS[kind].coefficients.find((s) => s.key === key)
      if (!spec) return
      const sanitized = sanitizeCoefficient(spec, value)
      setValuesByKind((prev) => ({ ...prev, [kind]: { ...prev[kind], [key]: sanitized } }))
    },
    [kind],
  )

  const resetCoefficients = useCallback(() => {
    setValuesByKind((prev) => ({ ...prev, [kind]: defaultCoefficientValues(kind) }))
  }, [kind])

  const applyPreset = useCallback((preset: FunctionPreset) => {
    setCategoryState(preset.category)
    setKindState(preset.kind)
    setValuesByKind((prev) => ({ ...prev, [preset.kind]: { ...defaultCoefficientValues(preset.kind), ...preset.values } }))
  }, [])

  return {
    category,
    setCategory,
    kind,
    setKind,
    config: FUNCTION_CONFIGS[kind],
    values: valuesByKind[kind],
    setCoefficient,
    resetCoefficients,
    applyPreset,
  }
}
