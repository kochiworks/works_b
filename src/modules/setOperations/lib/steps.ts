import { labelOf, texOf } from './expressions'
import type { SetExpr } from './expressions'

export interface OperationStep {
  /** Notation for what the diagram shows at this step. */
  tex: string
  /** The set drawn at this step. */
  expr: SetExpr
  /** One line naming what this step adds to the picture. */
  caption: string
}

/**
 * The order a side is built in, read off its own expression tree: the innermost
 * bracket is worked out first, then the operation that uses it, so
 * A ∩ (B ∪ C) becomes B ∪ C → A ∩ (B ∪ C) — the way the calculation is
 * actually written out, without restating the sets it starts from.
 *
 * The exception is an expression that is a single operation, where there is no
 * order to show. There the operands are the story, so A ∪ B is built as
 * A → B → A ∪ B and Aᶜ as A → Aᶜ.
 */
export function buildSteps(expr: SetExpr, finalTex?: string): OperationStep[] {
  const operations = operationNodes(expr)
  const nodes = operations.length <= 1 ? [...leafOperands(expr), ...operations] : operations

  const seen = new Set<string>()
  const steps = nodes
    .map((node) => ({ tex: texOf(node), expr: node, caption: captionFor(node) }))
    // A sub-expression that both halves use — the A ∩ B of (A ∩ B) ∪ (A ∩ C)
    // were it to appear twice — is drawn once, not again for the second half.
    .filter((step) => {
      if (seen.has(step.tex)) return false
      seen.add(step.tex)
      return true
    })

  // The last step is the side's own headline, so it keeps the curated notation.
  if (finalTex && steps.length > 0) steps[steps.length - 1] = { ...steps[steps.length - 1], tex: finalTex }
  return steps
}

/** Every operation in the expression, innermost bracket first. */
function operationNodes(expr: SetExpr): SetExpr[] {
  switch (expr.kind) {
    case 'set':
    case 'universe':
      return []
    case 'complement':
      return [...operationNodes(expr.of), expr]
    case 'union':
    case 'intersect':
    case 'difference':
      return [...operationNodes(expr.left), ...operationNodes(expr.right), expr]
  }
}

/** The plain sets an expression is built from, left to right. */
function leafOperands(expr: SetExpr): SetExpr[] {
  switch (expr.kind) {
    case 'set':
    case 'universe':
      return [expr]
    case 'complement':
      return leafOperands(expr.of)
    case 'union':
    case 'intersect':
    case 'difference':
      return [...leafOperands(expr.left), ...leafOperands(expr.right)]
  }
}

/**
 * Captions put the notation first and a colon after it, so no Korean particle
 * ever has to agree with a name that changes from A to (A ∪ B)ᶜ.
 */
function captionFor(expr: SetExpr): string {
  const label = labelOf(expr)
  switch (expr.kind) {
    case 'set':
      return `집합 ${label} : 여기에 속하는 부분을 칠합니다.`
    case 'universe':
      return `전체집합 ${label} : 모든 원소를 칠합니다.`
    case 'union':
      return `합집합 ${label} : 둘 중 어느 하나에라도 속하면 칠합니다.`
    case 'intersect':
      return `교집합 ${label} : 둘 다에 속하는 부분만 남깁니다.`
    case 'difference':
      return `차집합 ${label} : 앞의 집합에서 뒤의 집합에 속하는 부분을 덜어냅니다.`
    case 'complement':
      return `여집합 ${label} : 전체집합 U에서 칠해져 있던 부분을 뒤집습니다.`
  }
}
