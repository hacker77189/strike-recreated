// ---------------------------------------------------------------------------
// STRIKE Sale — Countdown (3 · 2 · 1 · GO)
// ---------------------------------------------------------------------------
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export default function Countdown({ durationMs, onDone }) {
  const reduced = useReducedMotion()
  const steps = ['3', '2', '1', 'GO']
  const [i, setI] = useState(0)

  useEffect(() => {
    const per = durationMs / steps.length
    const id = setInterval(() => {
      setI((prev) => {
        if (prev + 1 >= steps.length) {
          clearInterval(id)
          // let "GO" show briefly, then hand off
          setTimeout(() => onDone?.(), per * 0.7)
          return prev
        }
        return prev + 1
      })
    }, per)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMs])

  const label = steps[i]
  return (
    <div className="grid place-items-center py-16" aria-hidden="true">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={label}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.8 }}
          transition={{ duration: 0.28 }}
          className={`font-display ${
            label === 'GO' ? 'text-gold' : 'text-silver'
          } text-7xl sm:text-8xl drop-shadow-[0_0_30px_rgba(212,160,23,0.4)]`}
        >
          {label}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
