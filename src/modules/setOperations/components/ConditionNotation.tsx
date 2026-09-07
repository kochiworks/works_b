import { Katex } from './Katex'

interface Props {
  /** A condition that is pure mathematics, as KaTeX source. */
  tex?: string
  /** A condition written in Korean, e.g. "12의 약수". */
  text?: string
}

/**
 * 조건제시법, written as {x | …}. A Korean condition is laid out in HTML with
 * the variable set in KaTeX's own math font, because KaTeX's \text does not
 * carry Hangul and would fall back to a mismatched face mid-formula.
 */
export function ConditionNotation({ tex, text }: Props) {
  if (tex) return <Katex tex={`\\{x \\mid ${tex}\\}`} className="set-tex" />

  return (
    <span className="set-condition">
      <span className="set-brace">{'{'}</span>
      <span className="set-var">x</span>
      <span className="set-bar">|</span>
      {/* The variable and the particle that follows it are one word — "x는" —
          so they sit in their own gap-free group inside the spaced row. */}
      <span className="set-term">
        <span className="set-var">x</span>
        <span className="set-words">는 {text}</span>
      </span>
      <span className="set-brace">{'}'}</span>
    </span>
  )
}
