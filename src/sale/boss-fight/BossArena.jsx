// ---------------------------------------------------------------------------
// STRIKE Boss — BossArena (the fight playfield)
// ---------------------------------------------------------------------------
// Tap/click/keyboard the boss to attack; catch floating power-ups & shards for
// bonuses. Health bar, combo meter and timer up top; floating damage numbers
// and a crit screen-shake for juice. Fully keyboard-playable and reduced-motion
// aware. All animation is transform/opacity only.
// ---------------------------------------------------------------------------
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Coffee, Bird, Zap } from 'lucide-react'
import { useBossLoop } from './useBossLoop.js'
import Boss from './Boss.jsx'

const DROP_META = {
  coffee: { Icon: Coffee, ring: 'border-amber-400/70 text-amber-300', glow: 'rgba(251,191,36,0.5)' },
  duck: { Icon: Bird, ring: 'border-cyan-400/70 text-cyan-300', glow: 'rgba(34,211,238,0.5)' },
  shard: { Icon: Zap, ring: 'border-gold/70 text-gold', glow: 'rgba(212,160,23,0.5)' },
}

// Deterministic scatter for a drop id, biased to the top band so drops don't
// bury the boss (which sits lower-centre).
function dropPos(id, arena) {
  const phi = 0.6180339887498949
  const gx = (id * phi) % 1
  const gy = ((id * phi * 2.3) % 1) * 0.5 // top ~half
  const pad = 46
  const x = pad + gx * (Math.max(arena.width, 120) - pad * 2)
  const y = pad + gy * (Math.max(arena.height, 120) - pad * 2)
  return { x, y }
}

export default function BossArena({ engine, onFinish }) {
  const reduced = useReducedMotion()
  const arenaRef = useRef(null)
  const bossBtnRef = useRef(null)
  const [floats, setFloats] = useState([])
  const [shakeKey, setShakeKey] = useState(0)
  const [bossXY, setBossXY] = useState({ x: 0, y: 0 })
  const hitKeyRef = useRef(0)
  const floatIdRef = useRef(0)

  const boss = useBossLoop(engine, { active: true, onFinish })

  // Jump the boss to a fresh random spot inside the arena (whole sprite kept
  // in-bounds). Used both by the idle wander timer and on every landed hit.
  const moveBoss = useCallback(() => {
    const rect = arenaRef.current?.getBoundingClientRect()
    const w = rect?.width || 320
    const h = rect?.height || 320
    const rangeX = Math.max(0, w / 2 - 118)
    const rangeY = Math.max(0, h / 2 - 118)
    setBossXY({
      x: (Math.random() * 2 - 1) * rangeX,
      y: (Math.random() * 2 - 1) * rangeY,
    })
  }, [])

  // The boss roams the arena so it isn't a static tap target. If left alone it
  // drifts to a new spot on an interval (faster once enraged). It stays centred
  // when the fight isn't running or the user prefers reduced motion.
  useEffect(() => {
    if (reduced || boss.status !== 'running') return
    moveBoss()
    const id = setInterval(moveBoss, boss.enraged ? 620 : 1050)
    return () => clearInterval(id)
  }, [reduced, boss.status, boss.enraged, moveBoss])

  // Re-centre for the intro / defeat pose whenever the fight isn't running.
  useEffect(() => {
    if (boss.status !== 'running') setBossXY({ x: 0, y: 0 })
  }, [boss.status])

  const addFloat = useCallback((x, y, text, crit) => {
    const id = ++floatIdRef.current
    setFloats((f) => [...f.slice(-8), { id, x, y, text, crit }])
    setTimeout(() => setFloats((f) => f.filter((n) => n.id !== id)), 750)
  }, [])

  const arenaRect = () => arenaRef.current?.getBoundingClientRect()

  const handleAttack = useCallback(
    (e) => {
      const res = boss.attack()
      if (!res) return
      hitKeyRef.current += 1
      const rect = arenaRect()
      let x = rect ? rect.width / 2 : 120
      let y = rect ? rect.height / 2 : 120
      if (rect && e && e.clientX != null && e.detail !== 0) {
        x = e.clientX - rect.left
        y = e.clientY - rect.top
      }
      addFloat(x, y, res.crit ? `CRIT ${res.damage}` : `${res.damage}`, res.crit)
      if (res.crit && !reduced) setShakeKey((k) => k + 1)
      // One hit per location: the bug jumps away the instant it's struck, so you
      // have to chase it rather than spam a single spot. (Kept still under
      // reduced motion for accessibility.)
      if (!reduced) moveBoss()
    },
    [boss, addFloat, reduced, moveBoss],
  )

  const handleCollect = useCallback(
    (drop) => {
      const res = boss.collect(drop.id)
      if (!res) return
      const rect = arenaRect()
      const p = dropPos(drop.id, { width: rect?.width || 300, height: rect?.height || 300 })
      const label = res.type === 'coffee' ? 'FRENZY!' : `+${res.damage}`
      addFloat(p.x, p.y, label, false)
    },
    [boss, addFloat],
  )

  const arena = useMemo(() => {
    const r = arenaRef.current?.getBoundingClientRect()
    return { width: r?.width || 320, height: r?.height || 320 }
  }, [boss.activeDrops])

  const comboText = boss.combo > 1 ? `x${boss.comboMultiplier.toFixed(1)}` : ''

  return (
    <div className="flex h-full flex-col">
      {/* HUD */}
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-neutral-300">
          Legacy Bug {boss.enraged && <span className="text-red-400">· ENRAGED</span>}
        </span>
        <span className="flex items-center gap-3">
          {boss.frenzyActive && <span className="text-amber-300">☕ FRENZY</span>}
          {comboText && <span className="font-display text-gold">{comboText}</span>}
          <span className="font-display text-lg tabular-nums text-silver">{boss.secondsLeft}s</span>
        </span>
      </div>

      {/* Health bar */}
      <div className="mb-3 h-3 w-full overflow-hidden rounded-full border border-white/10 bg-black/50">
        <motion.div
          className={`h-full origin-left ${boss.enraged ? 'bg-red-500' : 'bg-gradient-to-r from-fuchsia-500 to-purple-400'}`}
          style={{ width: '100%' }}
          animate={{ transform: `scaleX(${Math.max(0, boss.hpPct)})` }}
          transition={{ duration: 0.15 }}
        />
      </div>

      {/* Arena */}
      <motion.div
        ref={arenaRef}
        key={shakeKey}
        animate={reduced ? {} : { x: [0, -6, 5, -3, 0], y: [0, 3, -4, 2, 0] }}
        transition={{ duration: 0.22 }}
        className="relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(177,75,255,0.10),transparent_65%)]"
      >
        <span aria-live="polite" className="sr-only">
          {boss.status === 'running' ? 'Fight started. Tap the Legacy Bug to attack!' : ''}
        </span>

        {/* Boss (attack target) — roams the arena */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.button
            ref={bossBtnRef}
            type="button"
            onClick={handleAttack}
            aria-label="Attack the Legacy Bug"
            className="pointer-events-auto rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold"
            animate={{ x: bossXY.x, y: bossXY.y }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: 'spring', stiffness: 130, damping: 15, mass: 0.8 }
            }
          >
            <Boss
              hpPct={boss.hpPct}
              enraged={boss.enraged}
              defeated={boss.status === 'finished' && boss.victory}
              hitKey={hitKeyRef.current}
              reduced={reduced}
            />
          </motion.button>
        </div>

        {/* Drops */}
        <AnimatePresence>
          {boss.activeDrops.map((d) => {
            const meta = DROP_META[d.type]
            const p = dropPos(d.id, arena)
            const Icon = meta.Icon
            return (
              <motion.button
                key={d.id}
                type="button"
                onClick={() => handleCollect(d)}
                aria-label={d.type === 'coffee' ? 'Grab coffee for frenzy mode' : d.type === 'duck' ? 'Grab the rubber duck for burst damage' : 'Grab a glitch shard for bonus damage'}
                className={`absolute grid h-12 w-12 place-items-center rounded-full border bg-ink-800/90 ${meta.ring} outline-none focus-visible:ring-2 focus-visible:ring-gold`}
                style={{ left: p.x, top: p.y, marginLeft: -24, marginTop: -24, boxShadow: `0 0 16px ${meta.glow}` }}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: [0, -6, 0] }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
                transition={{ y: { duration: 1.4, repeat: Infinity }, default: { duration: 0.2 } }}
                whileTap={{ scale: 0.8 }}
              >
                <Icon size={22} />
              </motion.button>
            )
          })}
        </AnimatePresence>

        {/* Floating damage numbers */}
        <AnimatePresence>
          {floats.map((n) => (
            <motion.span
              key={n.id}
              className={`pointer-events-none absolute font-display ${n.crit ? 'text-red-400 text-2xl' : 'text-gold text-lg'}`}
              style={{ left: n.x, top: n.y }}
              initial={{ opacity: 1, y: 0, scale: n.crit ? 1.3 : 1 }}
              animate={{ opacity: 0, y: -46 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              {n.text}
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="mt-2 text-center text-xs text-neutral-500">
        Tap the bug fast to build combos · grab drops for bonuses
      </p>
    </div>
  )
}
