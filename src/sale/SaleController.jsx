// ---------------------------------------------------------------------------
// STRIKE Sale — SaleController (top-level orchestrator)
// ---------------------------------------------------------------------------
// Owns the transient UI state that isn't persisted: whether the boss-fight
// overlay is open and whether the reveal is currently playing. Reads the
// persisted phase from the store and renders the right piece of the experience:
//
//   idle     → (auto-starts the hunt shortly after load)
//   hunting  → AmbientBug  → [tap] → BossFight → claim()
//   claimed  → Reveal (once) → CouponStub (persistent)
// ---------------------------------------------------------------------------
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useSaleActions, useSaleSelector } from './react.jsx'
import { ceilingPercent, floorPercent } from './config.js'
import AmbientBug from './AmbientBug.jsx'
import BossFight from './boss-fight/BossFight.jsx'
import Reveal from './Reveal.jsx'
import CouponStub from './CouponStub.jsx'

function intensityFor(percent, tiers) {
  const lo = floorPercent(tiers)
  const hi = ceilingPercent(tiers)
  if (hi === lo) return 1
  const t = (percent - lo) / (hi - lo) // 0..1
  return 0.7 + t * 0.9 // 0.7 .. 1.6
}

export default function SaleController() {
  const { startHunt, claim, config } = useSaleActions()
  const phase = useSaleSelector((s) => s.phase)
  const claimedPercent = useSaleSelector((s) => s.tier?.percent ?? null)

  const [fightOpen, setFightOpen] = useState(false)
  const [showReveal, setShowReveal] = useState(false)
  // If the page loads already 'claimed' (persisted from a past visit), treat the
  // reveal as already played — only show it for a claim made this session.
  const revealedRef = useRef(phase === 'claimed')

  // Kick off the hunt automatically a beat after load (discoverability).
  useEffect(() => {
    if (phase !== 'idle') return
    const id = setTimeout(() => startHunt(), 1200)
    return () => clearTimeout(id)
  }, [phase, startHunt])

  // When a coupon is locked, play the reveal exactly once.
  useEffect(() => {
    if (phase === 'claimed' && !revealedRef.current) {
      revealedRef.current = true
      setFightOpen(false)
      setShowReveal(true)
    }
  }, [phase])

  function handleFinish(score, source) {
    // Single, non-speculative claim. The store enforces write-once.
    claim(score, source)
    // phase flips to 'claimed' → the effect above starts the reveal.
  }

  return (
    <>
      {phase === 'hunting' && !fightOpen && (
        <AmbientBug onCatch={() => setFightOpen(true)} />
      )}

      <AnimatePresence>
        {fightOpen && phase !== 'claimed' && (
          <BossFight
            config={config}
            onFinish={handleFinish}
            onDismiss={() => setFightOpen(false)}
          />
        )}
      </AnimatePresence>

      {showReveal && claimedPercent != null && (
        <Reveal
          percent={claimedPercent}
          intensity={intensityFor(claimedPercent, config.tiers)}
          onDone={() => setShowReveal(false)}
        />
      )}

      <CouponStub />
    </>
  )
}
