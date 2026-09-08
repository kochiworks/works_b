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
 * The order a side is built in, read off its own expression tree: every
 * operand is drawn before the operation that uses it, so (A ∪ B)ᶜ becomes
 * A → B → A ∪ B → (A ∪ B)ᶜ.
 *
 * Two rules keep the sequence from restating the obvious. A bare set drawn
 * only to be complemented straight away is dropped, so Aᶜ ∩ Bᶜ becomes
 * Aᶜ → Bᶜ → Aᶜ ∩ Bᶜ rather than A → Aᶜ → B → Bᶜ → Aᶜ ∩ Bᶜ. And a set that
 * appears in more than one place is drawn only the first time, so the A of
 * (A ∩ B) ∪ (A ∩ C) does not come round twice.
 */
export function buildSteps(expr: SetExpr, finalTex?: string): OperationStep[] {
  const seen = new Set<string>()
  const steps = postOrder(expr, true)
    .map((node) => ({ tex: texOf(node), expr: node, caption: captionFor(node) }))
    // A set that both halves of the expression use — the A in
    // (A ∩ B) ∪ (A ∩ C) — is drawn once, not again for the second half.
    .filter((step) => {
      if (seen.has(step.tex)) return false
      seen.add(step.tex)
      return true
    })

  // The last step is the side's own headline, so it keeps the curated notation.
  if (finalTex && steps.length > 0) steps[steps.length - 1] = { ...steps[steps.length - 1], tex: finalTex }
  return steps
}

/** Operands first, then the operation — minus the leaves a complement swallows. */
function postOrder(expr: SetExpr, isRoot: boolean): SetExpr[] {
  switch (expr.kind) {
    case 'set':
    case 'universe':
      return [expr]
    case 'complement': {
      // A bare set about to be complemented is not worth its own step — unless
      // the complement is the whole point, as in the operation Aᶜ, where seeing
      // A first is exactly what makes the flip readable.
      const bare = expr.of.kind === 'set' || expr.of.kind === 'universe'
      const inner = bare && !isRoot ? [] : postOrder(expr.of, false)
      return [...inner, expr]
    }
    case 'union':
    case 'intersect':
    case 'difference':
      return [...postOrder(expr.left, false), ...postOrder(expr.right, false), expr]
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
