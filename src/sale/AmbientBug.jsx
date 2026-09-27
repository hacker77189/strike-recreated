// ---------------------------------------------------------------------------
// STRIKE Sale — Phase 1: AmbientBug
// ---------------------------------------------------------------------------
// A little glitch/bug that wanders the page while phase === 'hunting'. Catching
// it (click, tap, Enter/Space) opens the Bounty Sprint. Fully keyboard- and
// screen-reader accessible; respects prefers-reduced-motion.
// ---------------------------------------------------------------------------
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Bug } from 'lucide-react'

const MARGIN = 28 // keep the bug away from the very edges
const SIZE = 52 // >= 44px hit target

function randomPoint(reduced) {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1024
  const h = typeof window !== 'undefined' ? window.innerHeight : 768
  // Keep it in the lower two-thirds so it doesn't collide with the fixed navbar.
  const top = reduced ? h * 0.62 : MARGIN + Math.random() * (h - SIZE - MARGIN * 2)
  const minTop = 96
  return {
    x: MARGIN + Math.random() * (w - SIZE - MARGIN * 2),
    y: Math.max(minTop, top),
  }
}

export default function AmbientBug({ onCatch }) {
  const reduced = useReducedMotion()
  const [pos, setPos] = useState(() => randomPoint(reduced))
  const [caught, setCaught] = useState(false)
  const [hint, setHint] = useState(true)
  const btnRef = useRef(null)

  // Roam to a new spot on an interval (skipped under reduced motion).
  useEffect(() => {
    if (caught || reduced) return
    const id = setInterval(() => setPos(randomPoint(false)), 1900)
    return () => clearInterval(id)
  }, [caught, reduced])

  // Drop the "catch me" hint after a moment.
  useEffect(() => {
    const id = setTimeout(() => setHint(false), 4200)
    return () => clearTimeout(id)
  }, [])

  // Nudge focus to the bug so keyboard users can find it.
  useEffect(() => {
    const id = setTimeout(() => btnRef.current?.focus?.({ preventScroll: true }), 400)
    return () => clearTimeout(id)
  }, [])

  function handleCatch() {
    if (caught) return
    setCaught(true)
    // Small squash beat before handing off to the sprint.
    setTimeout(() => onCatch?.(), 240)
  }

  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={handleCatch}
      aria-label="The Legacy Bug appeared — beat it to unlock your STRIKE discount"
      className="fixed z-[70] grid place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold"
      style={{ width: SIZE, height: SIZE, left: 0, top: 0 }}
      initial={false}
      animate={{
        x: pos.x,
        y: pos.y,
        scale: caught ? 0 : 1,
        rotate: caught ? 90 : 0,
        opacity: caught ? 0 : 1,
      }}
      transition={
        reduced
          ? { duration: 0.2 }
          : { type: 'spring', stiffness: 120, damping: 16, mass: 0.7 }
      }
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
    >
      <span
        className="absolute inset-0 rounded-full bg-gold/25 blur-md"
        aria-hidden="true"
      />
      <span
        className="relative grid h-11 w-11 place-items-center rounded-full border border-gold/50 bg-ink-800/90 text-gold shadow-[0_0_20px_rgba(212,160,23,0.5)]"
        aria-hidden="true"
      >
        <Bug size={22} className="animate-pulse" />
      </span>
      {hint && !caught && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-md bg-black/85 px-2 py-1 text-[11px] font-medium text-gold"
        >
          win a discount →
        </motion.span>
      )}
    </motion.button>
  )
}
