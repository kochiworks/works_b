import type { ReactNode } from 'react'

/** A stacked fraction — numerator over a rule over denominator — instead of a
 *  same-line "a/b", matching how a fraction actually appears in a textbook. */
export function Frac({ num, den }: { num: ReactNode; den: ReactNode }) {
  return (
    <span className="math-frac">
      <span className="math-frac-num">{num}</span>
      <span className="math-frac-den">{den}</span>
    </span>
  )
}

/** A radical sign whose vinculum (the overline) actually spans the radicand, rather
 *  than a plain "√(...)" in running text. */
export function Radical({ children }: { children: ReactNode }) {
  return (
    <span className="math-radical">
      <span className="math-radical-sign">√</span>
      <span className="math-radicand">{children}</span>
    </span>
  )
}
