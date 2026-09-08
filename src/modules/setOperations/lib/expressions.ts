import { allRegions } from './regions'
import { emptyMembership, project } from './types'
import type { Membership, SetName } from './types'

/**
 * A set expression as a tree. Only evaluation runs on the tree — the notation
 * shown on screen is a hand-written TeX string stored beside it, so that the
 * screen matches the textbook's own parenthesising rather than whatever a
 * generic printer would produce.
 */
export type SetExpr =
  | { kind: 'set'; name: SetName }
  | { kind: 'universe' }
  | { kind: 'union'; left: SetExpr; right: SetExpr }
  | { kind: 'intersect'; left: SetExpr; right: SetExpr }
  | { kind: 'difference'; left: SetExpr; right: SetExpr }
  | { kind: 'complement'; of: SetExpr }

export const setOf = (name: SetName): SetExpr => ({ kind: 'set', name })
export const union = (left: SetExpr, right: SetExpr): SetExpr => ({ kind: 'union', left, right })
export const intersect = (left: SetExpr, right: SetExpr): SetExpr => ({ kind: 'intersect', left, right })
export const difference = (left: SetExpr, right: SetExpr): SetExpr => ({ kind: 'difference', left, right })
export const complement = (of: SetExpr): SetExpr => ({ kind: 'complement', of })

/** Whether an element with this membership belongs to the expression's set. */
export function evaluate(expr: SetExpr, membership: Membership): boolean {
  switch (expr.kind) {
    case 'set':
      return membership[expr.name]
    case 'universe':
      return true
    case 'union':
      return evaluate(expr.left, membership) || evaluate(expr.right, membership)
    case 'intersect':
      return evaluate(expr.left, membership) && evaluate(expr.right, membership)
    case 'difference':
      return evaluate(expr.left, membership) && !evaluate(expr.right, membership)
    case 'complement':
      return !evaluate(expr.of, membership)
  }
}

/** The elements of U that belong to the expression's set. */
export function elementsOf(
  expr: SetExpr,
  universe: number[],
  membership: Record<number, Membership>,
  setCount: 2 | 3,
): number[] {
  return universe.filter((value) =>
    evaluate(expr, project(membership[value] ?? emptyMembership(), setCount)),
  )
}

/**
 * Which regions of the diagram the expression covers. Every region is tested
 * with a stand-in element that belongs to exactly that combination of sets, so
 * the shading is the expression's own shape and does not depend on which
 * elements happen to be placed where.
 */
export function shadedRegions(expr: SetExpr, setCount: 2 | 3): Membership[] {
  return allRegions(setCount).filter((region) => evaluate(expr, region))
}

/** Whether two expressions cover exactly the same regions — the law itself. */
export function sameRegions(left: SetExpr, right: SetExpr, setCount: 2 | 3): boolean {
  return allRegions(setCount).every((region) => evaluate(left, region) === evaluate(right, region))
}

/**
 * Whether an expression needs brackets when it stands as one operand of
 * another. A set and a complement already read as one thing — Aᶜ ∩ Bᶜ needs no
 * brackets — while a union, intersection or difference has to be grouped, which
 * is how the textbook writes (A ∩ B) ∪ (A ∩ C).
 */
function isCompound(expr: SetExpr): boolean {
  return expr.kind === 'union' || expr.kind === 'intersect' || expr.kind === 'difference'
}

/** KaTeX source for an expression, bracketed the way the textbook writes it. */
export function texOf(expr: SetExpr): string {
  const operand = (child: SetExpr): string => (isCompound(child) ? `(${texOf(child)})` : texOf(child))
  switch (expr.kind) {
    case 'set':
      return expr.name
    case 'universe':
      return 'U'
    case 'union':
      return `${operand(expr.left)} \\cup ${operand(expr.right)}`
    case 'intersect':
      return `${operand(expr.left)} \\cap ${operand(expr.right)}`
    case 'difference':
      return `${operand(expr.left)} - ${operand(expr.right)}`
    case 'complement':
      return `${operand(expr.of)}^{c}`
  }
}

/** The same notation in plain characters, for prose that names a step. */
export function labelOf(expr: SetExpr): string {
  const operand = (child: SetExpr): string => (isCompound(child) ? `(${labelOf(child)})` : labelOf(child))
  switch (expr.kind) {
    case 'set':
      return expr.name
    case 'universe':
      return 'U'
    case 'union':
      return `${operand(expr.left)} ∪ ${operand(expr.right)}`
    case 'intersect':
      return `${operand(expr.left)} ∩ ${operand(expr.right)}`
    case 'difference':
      return `${operand(expr.left)} − ${operand(expr.right)}`
    case 'complement':
      return `${operand(expr.of)}ᶜ`
  }
}
