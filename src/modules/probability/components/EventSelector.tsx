import type { EventOption } from '../lib/types'

interface Props {
  options: EventOption[]
  eventId: string
  onChange: (id: string) => void
}

export function EventSelector({ options, eventId, onChange }: Props) {
  return (
    <section className="panel">
      <h2>관심 있는 사건</h2>
      {options.length === 0 ? (
        <p className="hint">공을 1개 이상 넣어야 사건을 고를 수 있습니다.</p>
      ) : (
        <div className="mode-tabs event-tabs">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={option.id === eventId ? 'mode-tab active' : 'mode-tab'}
              onClick={() => onChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
