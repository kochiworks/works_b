import type { Accent } from '../modules/registry'

interface Props {
  accent: Accent
  icon: string
  title: string
  subtitle: string
  description: string
  /** Link one level up, so every page below home has a visible way back. */
  back?: { label: string; href: string }
}

/** Heading block shared by the subject and domain pages. */
export function PageIntro({ accent, icon, title, subtitle, description, back }: Props) {
  return (
    <section className={`browse-intro accent-${accent}`}>
      {back && (
        <a className="browse-back" href={back.href}>
          <span aria-hidden="true">←</span> {back.label}
        </a>
      )}
      <div className="browse-intro-main">
        <div className="browse-intro-icon browse-icon">{icon}</div>
        <div className="browse-intro-heading">
          <h1 className="browse-intro-title">{title}</h1>
          <p className="browse-intro-subtitle">{subtitle}</p>
        </div>
      </div>
      <p className="browse-intro-description">{description}</p>
    </section>
  )
}
