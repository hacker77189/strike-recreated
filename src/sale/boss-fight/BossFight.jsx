// ---------------------------------------------------------------------------
// STRIKE Boss — BountyBossFight (overlay orchestrator)
// ---------------------------------------------------------------------------
// Local phase machine: 'intro' → 'countdown' → 'fight' → 'result'. A fresh
// BossEngine is created per attempt. Body scroll is locked while open and
// restored exactly on close. onFinish(score, source) is the single hand-off to
// the sale store (called from the result screen / skip).
// ---------------------------------------------------------------------------
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { BossEngine } from './bossEngine.js'
import Countdown from './Countdown.jsx'
import BossIntro from './BossIntro.jsx'
import BossArena from './BossArena.jsx'
import BossResult from './BossResult.jsx'

export default function BossFight({ config, onFinish, onDismiss }) {
  const [phase, setPhase] = useState('intro')
  const [result, setResult] = useState({ score: 0, source: 'sprint', victory: false, damagePct: 0 })
  const closeRef = useRef(null)

  const engine = useMemo(() => new BossEngine(config.boss), [config])

  useEffect(() => {
    const body = document.body
    const prevOverflow = body.style.overflow
    const prevTouch = body.style.touchAction
    body.style.overflow = 'hidden'
    body.style.touchAction = 'none'
    return () => {
      body.style.overflow = prevOverflow
      body.style.touchAction = prevTouch
    }
  }, [])

  useEffect(() => {
    closeRef.current?.focus?.({ preventScroll: true })
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onDismiss?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDismiss])

  function handleFightFinish(score, source, snap) {
    setResult({
      score,
      source: 'sprint',
      victory: !!snap?.victory,
      damagePct: snap ? (snap.damageDealt / snap.maxHp) * 100 : 0,
    })
    setPhase('result')
  }

  function handleSkip() {
    setResult({ score: 0, source: 'skip', victory: false, damagePct: 0 })
    setPhase('result')
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Legacy Bug Boss Fight">
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
      />

      <motion.div
        className="relative flex h-[min(600px,90vh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <button
          ref={closeRef}
          onClick={onDismiss}
          aria-label="Close the fight"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <X size={18} />
        </button>

        <div className="flex flex-1 items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === 'intro' && (
              <BossIntro key="intro" config={config} onStart={() => setPhase('countdown')} onSkip={handleSkip} />
            )}

            {phase === 'countdown' && (
              <motion.div key="countdown" className="w-full" exit={{ opacity: 0 }}>
                <Countdown durationMs={config.countdownMs} onDone={() => setPhase('fight')} />
              </motion.div>
            )}

            {phase === 'fight' && (
              <motion.div key="fight" className="h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <BossArena engine={engine} onFinish={handleFightFinish} />
              </motion.div>
            )}

            {phase === 'result' && (
              <BossResult
                key="result"
                score={result.score}
                source={result.source}
                victory={result.victory}
                damagePct={result.damagePct}
                config={config}
                onClaim={() => onFinish?.(result.score, result.source)}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
