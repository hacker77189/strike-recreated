// ---------------------------------------------------------------------------
// STRIKE Boss — the "Legacy Bug" monster (pure SVG)
// ---------------------------------------------------------------------------
// Presentational only. Props drive its mood: hp fraction, enrage, defeat, and
// a `hitKey` that bumps on every hit to fire a quick recoil. Animations are
// transform/opacity only.
// ---------------------------------------------------------------------------
import { motion } from 'framer-motion'

export default function Boss({ hpPct = 1, enraged = false, defeated = false, hitKey = 0, reduced = false }) {
  const bodyFill = defeated ? '#3a3a3f' : enraged ? '#7a1020' : '#2a1030'
  const bodyStroke = defeated ? '#555' : enraged ? '#ff3b5c' : '#b14bff'
  const eyeFill = defeated ? '#555' : enraged ? '#ff5470' : '#5fe0ff'
  const glow = enraged ? 'rgba(255,59,92,0.55)' : 'rgba(177,75,255,0.5)'

  return (
    <motion.div
      className="relative"
      animate={
        reduced || defeated
          ? {}
          : { y: [0, -8, 0], rotate: enraged ? [-2, 2, -2] : [-1, 1, -1] }
      }
      transition={{ duration: enraged ? 0.6 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* recoil on hit */}
      <motion.div
        key={hitKey}
        initial={reduced ? {} : { scale: 1 }}
        animate={reduced ? {} : { scale: [1, 0.9, 1.04, 1], rotate: [0, -3, 2, 0] }}
        transition={{ duration: 0.22 }}
      >
        <motion.div
          animate={defeated ? { scale: 0.6, opacity: 0.25, rotate: 24 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg viewBox="0 0 200 200" className="h-32 w-32 sm:h-40 sm:w-40" style={{ filter: `drop-shadow(0 0 26px ${glow})` }}>
            {/* legs */}
            {[-1, 1].map((s) =>
              [0, 1, 2].map((i) => (
                <line
                  key={`${s}-${i}`}
                  x1={100} y1={110 + i * 16}
                  x2={100 + s * (60 + i * 6)} y2={90 + i * 26}
                  stroke={bodyStroke} strokeWidth="5" strokeLinecap="round" opacity="0.8"
                />
              )),
            )}
            {/* antennae */}
            <line x1="86" y1="60" x2="72" y2="26" stroke={bodyStroke} strokeWidth="4" strokeLinecap="round" />
            <line x1="114" y1="60" x2="128" y2="26" stroke={bodyStroke} strokeWidth="4" strokeLinecap="round" />
            <circle cx="72" cy="24" r="5" fill={eyeFill} />
            <circle cx="128" cy="24" r="5" fill={eyeFill} />

            {/* body */}
            <ellipse cx="100" cy="118" rx="52" ry="46" fill={bodyFill} stroke={bodyStroke} strokeWidth="3" />
            {/* head */}
            <circle cx="100" cy="78" r="34" fill={bodyFill} stroke={bodyStroke} strokeWidth="3" />

            {/* eyes — narrow & angry when enraged */}
            <g>
              <ellipse cx="88" cy="76" rx="9" ry={enraged ? 4 : 8} fill={eyeFill} />
              <ellipse cx="112" cy="76" rx="9" ry={enraged ? 4 : 8} fill={eyeFill} />
              <circle cx="88" cy="76" r="3" fill="#0b0410" />
              <circle cx="112" cy="76" r="3" fill="#0b0410" />
            </g>
            {/* angry brows when enraged */}
            {enraged && !defeated && (
              <>
                <line x1="78" y1="64" x2="96" y2="70" stroke="#ff3b5c" strokeWidth="3" strokeLinecap="round" />
                <line x1="122" y1="64" x2="104" y2="70" stroke="#ff3b5c" strokeWidth="3" strokeLinecap="round" />
              </>
            )}
            {/* mandibles / mouth */}
            <path
              d={defeated ? 'M86 96 q14 -8 28 0' : 'M84 92 q16 14 32 0'}
              fill="none" stroke={bodyStroke} strokeWidth="3" strokeLinecap="round"
            />

            {/* glitchy code-shard motif on the body */}
            <text x="100" y="128" textAnchor="middle" fontFamily="monospace" fontSize="20" fill={bodyStroke} opacity="0.7">
              {'</>'}
            </text>
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
