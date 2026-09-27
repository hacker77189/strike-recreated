// ---------------------------------------------------------------------------
// STRIKE Boss — Intro screen
// ---------------------------------------------------------------------------
import { motion } from 'framer-motion'
import { Swords, Timer, Coffee, Percent } from 'lucide-react'
import { floorPercent } from '../config.js'

export default function BossIntro({ config, onStart, onSkip }) {
  const seconds = Math.round(config.boss.durationMs / 1000)
  const floor = floorPercent(config.tiers)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="mx-auto flex max-w-md flex-col items-center px-6 text-center"
    >
      <span className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-300 shadow-[0_0_30px_rgba(177,75,255,0.35)]">
        <Swords size={30} />
      </span>

      <p className="mb-2 flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
        <Percent size={12} /> STRIKE discount challenge
      </p>
      <h2 className="font-display text-3xl text-silver sm:text-4xl">The Legacy Bug</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-neutral-300">
        Beat the bug to unlock your discount. Tap it fast to attack — chain hits for{' '}
        <span className="text-gold">combo multipliers</span>, grab{' '}
        <span className="text-amber-300">☕ power-ups</span>, and take it down before the timer runs
        out. The more damage you deal, the bigger the discount you win.
      </p>

      <div className="mt-6 grid w-full grid-cols-3 gap-3 text-left">
        <Stat icon={<Timer size={16} />} label={`${seconds}s`} sub="to win" />
        <Stat icon={<Coffee size={16} />} label="combos" sub="+ power-ups" />
        <Stat icon={<Percent size={16} />} label="???" sub="discount" />
      </div>

      <button
        onClick={onStart}
        className="mt-7 w-full rounded-xl bg-gradient-to-r from-gold to-goldsoft px-6 py-3 font-semibold text-black transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        Enter the Fight
      </button>
      <button
        onClick={onSkip}
        className="mt-3 rounded text-sm text-neutral-400 underline-offset-4 hover:text-neutral-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        Skip and just take {floor}% off
      </button>
    </motion.div>
  )
}

function Stat({ icon, label, sub }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <span className="flex items-center gap-1.5 text-gold">{icon}</span>
      <div className="mt-1.5 font-display text-lg text-white">{label}</div>
      <div className="text-[11px] uppercase tracking-wide text-neutral-500">{sub}</div>
    </div>
  )
}
