import type { CoefficientValues, FunctionKind } from './types'

export interface AsymptoteLines {
  vertical: number[]
  horizontal: number[]
}

const NONE: AsymptoteLines = { vertical: [], horizontal: [] }

/** Dashed guide lines to draw behind the curve, for the function kinds that have a
 *  simple, nameable asymptote — ties the "점근선" mentioned in featuresText to
 *  something visible on the graph instead of just a sentence. */
export function computeAsymptotes(kind: FunctionKind, values: CoefficientValues): AsymptoteLines {
  switch (kind) {
    case 'rational':
      return { vertical: [values.p ?? 1], horizontal: [values.q ?? 0] }
    case 'exponential':
      return { vertical: [], horizontal: [values.q ?? 0] }
    case 'logarithmic':
      return { vertical: [values.p ?? 0], horizontal: [] }
    case 'tangent': {
      const b = values.b ?? 1
      const p = values.p ?? 0
      const vertical: number[] = []
      for (let k = -8; k <= 8; k++) {
        const x = p + (Math.PI / 2 + k * Math.PI) / b
        if (x >= -9 && x <= 9) vertical.push(x)
      }
      return { vertical, horizontal: [] }
    }
    default:
      return NONE
  }
}
