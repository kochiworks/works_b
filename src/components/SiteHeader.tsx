interface Props {
  /** When set, shows a breadcrumb for the current module next to the brand. */
  moduleTitle?: string
  moduleIcon?: string
}

export function SiteHeader({ moduleTitle, moduleIcon }: Props) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href="#/">
          <span className="brand-mark">🔬</span>
          <span className="brand-name">수학 탐구 놀이터</span>
        </a>
        {moduleTitle && (
          <>
            <span className="crumb-sep" aria-hidden="true">
              ›
            </span>
            <span className="crumb-current">
              {moduleIcon} {moduleTitle}
            </span>
          </>
        )}
      </div>
    </header>
  )
}
