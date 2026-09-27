// ---------------------------------------------------------------------------
// STRIKE Sale — Phase 3: Reveal (tier-scaled lightning strike)
// ---------------------------------------------------------------------------
// A one-shot lightning bolt cracks from the top of the screen down to the
// target Membership card ([data-sale-target] — the Strike Ultra plan). Higher
// tiers strike harder (more forks, bigger flash). Purely decorative:
// pointer-events-none, and it gracefully no-ops / soft-fades under
// prefers-reduced-motion.
// ---------------------------------------------------------------------------
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// Build a jagged bolt (main path + optional forks) between two points.
function buildBolt(from, to, segments, forkCount) {
  const pts = [from]
  for (let i = 1; i < segments; i++) {
    const t = i / segments
    const x = from.x + (to.x - from.x) * t + (Math.random() - 0.5) * 90 * (1 - t * 0.4)
    const y = from.y + (to.y - from.y) * t
    pts.push({ x, y })
  }
  pts.push(to)
  const main = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')

  const forks = []
  for (let f = 0; f < forkCount; f++) {
    const idx = 1 + Math.floor(Math.random() * (pts.length - 2))
    const base = pts[idx]
    const len = 40 + Math.random() * 70
    const dir = Math.random() > 0.5 ? 1 : -1
    forks.push(
      `M ${base.x.toFixed(1)} ${base.y.toFixed(1)} L ${(base.x + dir * len).toFixed(1)} ${(base.y + len * 0.7).toFixed(1)}`,
    )
  }
  return { main, forks }
}

export default function Reveal({ percent, onDone, intensity = 1 }) {
  const reduced = useReducedMotion()
  const [geom, setGeom] = useState(null)

  useEffect(() => {
    const target = document.querySelector('[data-sale-target]')
    const vw = window.innerWidth
    const vh = window.innerHeight
    const to = target
      ? (() => {
          const r = target.getBoundingClientRect()
          return { x: r.left + r.width / 2, y: r.top + 24 }
        })()
      : { x: vw / 2, y: vh / 2 }
    const from = { x: to.x + (Math.random() - 0.5) * 120, y: -20 }

    const segments = Math.round(7 + intensity * 4)
    const forks = Math.round(intensity * 3)
    setGeom({ ...buildBolt(from, to, segments, forks), to, vw, vh })

    // Scroll the reward into view so the strike lands on something visible.
    target?.scrollIntoView?.({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })

    const id = setTimeout(() => onDone?.(), reduced ? 500 : 1500)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const strokeW = 2 + intensity * 1.5

  if (!geom) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[75]" aria-hidden="true">
      {/* screen flash, scaled by tier */}
      <AnimatePresence>
        <motion.div
          className="absolute inset-0 bg-gold"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduced ? [0, 0.12, 0] : [0, 0.35 * intensity, 0, 0.18 * intensity, 0] }}
          transition={{ duration: reduced ? 0.5 : 0.7, times: reduced ? [0, 0.5, 1] : undefined }}
        />
      </AnimatePresence>

      {!reduced && (
        <svg className="absolute inset-0 h-full w-full" width={geom.vw} height={geom.vh}>
          <defs>
            <filter id="bolt-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={3 + intensity * 2} result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.path
            d={geom.main}
            fill="none"
            stroke="#ffe9a8"
            strokeWidth={strokeW}
            strokeLinecap="round"
            filter="url(#bolt-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, times: [0, 0.35, 1] }}
          />
          {geom.forks.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="#ffd970"
              strokeWidth={strokeW * 0.6}
              strokeLinecap="round"
              filter="url(#bolt-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1], opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.5, delay: 0.15 }}
            />
          ))}
          {/* impact burst at the target */}
          <motion.circle
            cx={geom.to.x}
            cy={geom.to.y}
            r={10 + intensity * 10}
            fill="rgba(212,160,23,0.4)"
            filter="url(#bolt-glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.6, 2.2], opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ transformOrigin: `${geom.to.x}px ${geom.to.y}px` }}
          />
        </svg>
      )}
    </div>
  )
}
