import { SITUATIONS } from '../lib/situations'

interface Props {
  situationId: string
  onChange: (id: string) => void
}

export function SituationSelector({ situationId, onChange }: Props) {
  return (
    <section className="panel">
      <h2>상황 선택</h2>
      <div className="mode-tabs">
        {SITUATIONS.map((situation) => (
          <button
            key={situation.id}
            type="button"
            className={situation.id === situationId ? 'mode-tab active' : 'mode-tab'}
            onClick={() => onChange(situation.id)}
          >
            {situation.label}
          </button>
        ))}
      </div>
    </section>
  )
}
