import { Fragment } from 'react'
import { HOME_HREF } from '../lib/routes'

export interface Crumb {
  label: string
  icon?: string
  /** Omitted for the last crumb, which is the page you are already on. */
  href?: string
}

/**
 * Sticky top bar. The brand is always the way back to the subject gallery, and
 * the trail after it spells out subject › domain › activity so the reader can
 * jump back to any level of the tree from anywhere.
 */
export function SiteHeader({ trail }: { trail: Crumb[] }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href={HOME_HREF}>
          <span className="brand-mark" aria-hidden="true">
            🔬
          </span>
          <span className="brand-name">수학 탐구 놀이터</span>
        </a>

        {trail.length > 0 && (
          <nav className="crumbs" aria-label="현재 위치">
            {trail.map((crumb, index) => (
              <Fragment key={`${crumb.label}-${index}`}>
                <span className="crumb-sep" aria-hidden="true">
                  ›
                </span>
                {crumb.href ? (
                  <a className="crumb" href={crumb.href}>
                    {crumb.icon && <span aria-hidden="true">{crumb.icon}</span>} {crumb.label}
                  </a>
                ) : (
                  <span className="crumb is-current" aria-current="page">
                    {crumb.icon && <span aria-hidden="true">{crumb.icon}</span>} {crumb.label}
                  </span>
                )}
              </Fragment>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
