import { HOME_HREF } from '../lib/routes'

/** Shown for an address that no longer matches anything in the registry. */
export function NotFoundPage({ path }: { path: string }) {
  return (
    <div className="browse">
      <section className="browse-missing">
        <p className="browse-missing-mark" aria-hidden="true">
          🧭
        </p>
        <h1 className="browse-missing-title">페이지를 찾을 수 없습니다</h1>
        <p className="browse-missing-description">
          <code>#/{path}</code> 주소에 해당하는 활동이 없습니다. 활동이 다른 영역으로 옮겨졌거나 주소가 잘못
          입력되었을 수 있습니다.
        </p>
        <a className="browse-missing-link" href={HOME_HREF}>
          교과 전체 보기 →
        </a>
      </section>
    </div>
  )
}
