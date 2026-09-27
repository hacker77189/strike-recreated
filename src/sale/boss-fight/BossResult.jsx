// ---------------------------------------------------------------------------
// STRIKE Boss — Result screen
// ---------------------------------------------------------------------------
import { motion } from 'framer-motion'
import { Trophy, Skull, ArrowRight } from 'lucide-react'
import { tierForScore, toNextTier } from '../tiers.js'
import { floorTier } from '../config.js'

export default function BossResult({ score, source, victory, damagePct, config, onClaim }) {
  const tiers = config.tiers
  const tier = source === 'skip' ? floorTier(tiers) : tierForScore(score, tiers)
  const next = source === 'skip' ? null : toNextTier(score, tiers)
  const won = source !== 'skip' && victory

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-md flex-col items-center px-6 text-center"
    >
      <span aria-live="polite" className="sr-only">
        Fight over. You earned {tier.percent} percent off as a {tier.label}.
      </span>

      <motion.span
        initial={{ scale: 0.4, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-gold/40 bg-gold/10 text-gold shadow-[0_0_30px_rgba(212,160,23,0.4)]"
      >
        {won ? <Trophy size={30} /> : <Skull size={30} />}
      </motion.span>

      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">{tier.label}</p>
      <h2 className="mt-1 font-display text-5xl text-gold sm:text-6xl">{tier.percent}% OFF</h2>
      <p className="mt-3 text-[15px] text-neutral-300">
        {source === 'skip'
          ? 'You took the guaranteed reward — no fight required.'
          : won
            ? 'Legacy Bug defeated! Flawless work.'
            : `You dealt ${Math.round(damagePct)}% damage before time ran out.`}
      </p>

      {next && (
        <p className="mt-2 text-xs text-neutral-500">
          A bit more damage would have unlocked {next.tier.percent}% ({next.tier.label}).
        </p>
      )}

      <button
        onClick={onClaim}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-goldsoft px-6 py-3 font-semibold text-black transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        Claim {tier.percent}% off <ArrowRight size={18} />
      </button>
    </motion.div>
  )
}
