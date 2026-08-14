import katex from 'katex'
import 'katex/dist/katex.min.css'

interface Props {
  tex: string
  className?: string
}

/** Renders a LaTeX string via KaTeX — module-local copy (each module bundles its own
 *  KaTeX import rather than sharing one across modules), matching the site's
 *  "duplicate small pieces instead of coupling modules together" convention. */
export function Katex({ tex, className }: Props) {
  const html = katex.renderToString(tex, { throwOnError: false, strict: 'ignore' })
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
