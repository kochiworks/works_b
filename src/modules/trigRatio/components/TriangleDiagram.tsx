import type { AngleData, RatioKind, SideId } from '../lib/types'

interface Pt {
  x: number
  y: number
}

const TARGET = 240
const PAD = 46

/** Stroke colour per side — kept identical to the words in the ratio readout so
 *  "대변 ÷ 빗변" and the two lit-up edges are obviously the same two things. */
const SIDE_COLOR: Record<SideId, string> = {
  opp: '#f2794f',
  adj: '#2f95d8',
  hyp: '#7c5cf0',
}

const PLAIN_LEN: Record<string, string> = {
  '1': '1',
  '2': '2',
  '\\sqrt{2}': '√2',
  '\\sqrt{3}': '√3',
}

interface Props {
  data: AngleData
  ratio: RatioKind
}

/**
 * The right triangle drawn exactly to scale, with its mirror image dashed
 * alongside so the two together form the 정삼각형 / 정사각형 the exact ratios
 * come from. Only the two sides of the chosen ratio are bold: "why is
 * sin 30° = 1/2" is then answered by looking — the bold 대변 spans one unit, the
 * bold 빗변 spans two (its midpoint tick), and the dashed mirror shows the 대변
 * is exactly half of the whole figure's side.
 */
export function TriangleDiagram({ data, ratio }: Props) {
  const { opp, adj, hyp } = data
  const theta = (data.deg * Math.PI) / 180

  // math-space vertices: A = 예각, C = 직각, B = 나머지 (y up)
  const A: Pt = { x: 0, y: 0 }
  const C: Pt = { x: adj, y: 0 }
  const B: Pt = { x: adj, y: opp }

  const companion = buildCompanion(data, A, B, C)

  const allPts = [A, B, C, ...companion.poly]
  const minX = Math.min(...allPts.map((p) => p.x))
  const maxX = Math.max(...allPts.map((p) => p.x))
  const minY = Math.min(...allPts.map((p) => p.y))
  const maxY = Math.max(...allPts.map((p) => p.y))
  const spanX = maxX - minX
  const spanY = maxY - minY
  const U = TARGET / Math.max(spanX, spanY)

  const W = spanX * U + PAD * 2
  const H = spanY * U + PAD * 2
  const s = (p: Pt): Pt => ({ x: PAD + (p.x - minX) * U, y: PAD + (maxY - p.y) * U })

  const As = s(A)
  const Bs = s(B)
  const Cs = s(C)
  const G: Pt = { x: (As.x + Bs.x + Cs.x) / 3, y: (As.y + Bs.y + Cs.y) / 3 }

  const parts = data.ratios[ratio].parts
  const lit: Record<SideId, boolean> = {
    opp: parts.numer === 'opp' || parts.denom === 'opp',
    adj: parts.numer === 'adj' || parts.denom === 'adj',
    hyp: parts.numer === 'hyp' || parts.denom === 'hyp',
  }

  const sides: { id: SideId; from: Pt; to: Pt }[] = [
    { id: 'opp', from: C, to: B },
    { id: 'adj', from: A, to: C },
    { id: 'hyp', from: A, to: B },
  ]

  // angle arc + label at A
  const r = 32
  const arcStart: Pt = { x: As.x + r, y: As.y }
  const arcEnd: Pt = { x: As.x + r * Math.cos(theta), y: As.y - r * Math.sin(theta) }
  const arcLabel: Pt = {
    x: As.x + Math.cos(theta / 2) * (r + 16),
    y: As.y - Math.sin(theta / 2) * (r + 16),
  }

  const m = 12 // right-angle marker size at C

  return (
    <svg
      className="trig-svg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${data.deg}도 예각을 가진 직각삼각형`}
    >
      {/* --- mirror image (behind): original + mirror = the whole figure --- */}
      <polygon
        points={companion.poly.map((p) => `${s(p).x},${s(p).y}`).join(' ')}
        fill="#8b7cf6"
        fillOpacity={0.07}
      />
      {companion.dashed.map(([p, q, len], i) => {
        const ps = s(p)
        const qs = s(q)
        const mid = { x: (ps.x + qs.x) / 2, y: (ps.y + qs.y) / 2 }
        const labelPos = pushFrom(mid, G, 16)
        return (
          <g key={`dash-${i}`}>
            <line x1={ps.x} y1={ps.y} x2={qs.x} y2={qs.y} stroke="#b6ade4" strokeWidth={1.6} strokeDasharray="6 5" />
            {len && (
              <text x={labelPos.x} y={labelPos.y} className="trig-svg__dash-len" textAnchor="middle" dominantBaseline="middle">
                {len}
              </text>
            )}
          </g>
        )
      })}

      {/* --- the triangle itself --- */}
      <polygon points={[As, Cs, Bs].map((p) => `${p.x},${p.y}`).join(' ')} fill="#fbf9ff" />

      {sides.map(({ id, from, to }) => {
        const fs = s(from)
        const ts = s(to)
        const on = lit[id]
        return (
          <line
            key={id}
            x1={fs.x}
            y1={fs.y}
            x2={ts.x}
            y2={ts.y}
            stroke={SIDE_COLOR[id]}
            strokeOpacity={on ? 1 : 0.26}
            strokeWidth={on ? 6 : 2.5}
            strokeLinecap="round"
          />
        )
      })}

      {/* midpoint tick on the hypotenuse when it is 2 units — the "빗변은 2칸" cue */}
      {sides.map(({ id, from, to }) => {
        const L = id === 'opp' ? opp : id === 'adj' ? adj : hyp
        if (Math.abs(L - Math.round(L)) > 1e-6 || L < 2) return null
        const fs = s(from)
        const ts = s(to)
        const mid = { x: (fs.x + ts.x) / 2, y: (fs.y + ts.y) / 2 }
        const dx = ts.x - fs.x
        const dy = ts.y - fs.y
        const len = Math.hypot(dx, dy)
        const nx = -dy / len
        const ny = dx / len
        return (
          <line
            key={`tick-${id}`}
            x1={mid.x - nx * 6}
            y1={mid.y - ny * 6}
            x2={mid.x + nx * 6}
            y2={mid.y + ny * 6}
            stroke={SIDE_COLOR[id]}
            strokeOpacity={lit[id] ? 1 : 0.4}
            strokeWidth={2.4}
          />
        )
      })}

      {/* side-length labels */}
      {sides.map(({ id, from, to }) => {
        const fs = s(from)
        const ts = s(to)
        const mid = { x: (fs.x + ts.x) / 2, y: (fs.y + ts.y) / 2 }
        const off =
          id === 'opp'
            ? { x: 18, y: 5 }
            : id === 'adj'
              ? { x: 0, y: 22 }
              : { x: (-adj / hyp) * 22, y: (-opp / hyp) * 22 }
        return (
          <text
            key={`len-${id}`}
            x={mid.x + off.x}
            y={mid.y + off.y}
            className={lit[id] ? 'trig-svg__len trig-svg__len--on' : 'trig-svg__len'}
            fill={SIDE_COLOR[id]}
            fillOpacity={lit[id] ? 1 : 0.5}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {PLAIN_LEN[data.sideTex[id]] ?? data.sideTex[id]}
          </text>
        )
      })}

      {/* angle arc + label at A */}
      <path
        d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 0 0 ${arcEnd.x} ${arcEnd.y}`}
        fill="none"
        stroke="#2c2a3d"
        strokeWidth={1.6}
      />
      <text x={arcLabel.x} y={arcLabel.y} className="trig-svg__angle" textAnchor="middle" dominantBaseline="middle">
        {data.deg}°
      </text>

      {/* right-angle marker at C */}
      <polyline
        points={`${Cs.x - m},${Cs.y} ${Cs.x - m},${Cs.y - m} ${Cs.x},${Cs.y - m}`}
        fill="none"
        stroke="#8b86a5"
        strokeWidth={1.4}
      />

      {/* vertices */}
      {[
        { p: As, label: 'A', dx: -15, dy: 7 },
        { p: Bs, label: 'B', dx: 13, dy: 1 },
        { p: Cs, label: 'C', dx: 13, dy: 15 },
      ].map(({ p, label, dx, dy }) => (
        <g key={label}>
          <circle cx={p.x} cy={p.y} r={3.2} fill="#2c2a3d" />
          <text x={p.x + dx} y={p.y + dy} className="trig-svg__vertex" textAnchor="middle" dominantBaseline="middle">
            {label}
          </text>
        </g>
      ))}
    </svg>
  )
}

function pushFrom(p: Pt, from: Pt, px: number): Pt {
  const dx = p.x - from.x
  const dy = p.y - from.y
  const len = Math.hypot(dx, dy) || 1
  return { x: p.x + (dx / len) * px, y: p.y + (dy / len) * px }
}

interface Companion {
  /** The mirror triangle's three vertices, for the faint fill. */
  poly: Pt[]
  /** The mirror triangle's two outer edges, each with the length to label it. */
  dashed: [Pt, Pt, string?][]
}

/**
 * The mirror image of triangle ABC across the side that turns it into a whole
 * regular figure: across 밑변 for 30°, across 빗변 for 45°, across 대변 for 60°.
 * Drawn dashed so "half of a 정삼각형 / 정사각형" is visible, not just asserted.
 */
function buildCompanion(data: AngleData, A: Pt, B: Pt, C: Pt): Companion {
  switch (data.companion) {
    case 'equilateral-down': {
      // mirror B across 밑변 AC (the x-axis): whole 정삼각형 is A-B-B'
      const Bp: Pt = { x: C.x, y: -B.y }
      return {
        poly: [A, C, Bp],
        dashed: [
          [A, Bp, '2'],
          [C, Bp, '1'],
        ],
      }
    }
    case 'equilateral-right': {
      // mirror A across 대변 BC (the vertical leg): whole 정삼각형 is A-B-A'
      const Ap: Pt = { x: 2 * C.x, y: 0 }
      return {
        poly: [C, B, Ap],
        dashed: [
          [B, Ap, '2'],
          [C, Ap, '1'],
        ],
      }
    }
    case 'square':
    default: {
      // mirror C across 빗변 AB: whole 정사각형 is A-C-B-C'
      const Cp: Pt = { x: 0, y: 1 }
      return {
        poly: [A, B, Cp],
        dashed: [
          [B, Cp, '1'],
          [A, Cp, '1'],
        ],
      }
    }
  }
}
