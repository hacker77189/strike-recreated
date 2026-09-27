// ---------------------------------------------------------------------------
// STRIKE Boss — useBossLoop
// ---------------------------------------------------------------------------
// Single rAF loop driving a BossEngine. Re-renders only when something visible
// actually changes (status, displayed second, damage/score, combo, frenzy,
// enrage, or the set of catchable drops). Pauses the engine on document.hidden.
// attack()/collect() return the engine result so the UI can spawn floating
// feedback at the pointer without the engine knowing about geometry.
// ---------------------------------------------------------------------------
import { useCallback, useEffect, useRef, useState } from 'react'

function signature(snap) {
  const sec = Math.ceil(snap.timeLeftMs / 1000)
  const drops = snap.activeDrops.map((d) => d.id).join(',')
  return `${snap.status}|${sec}|${snap.damageDealt}|${snap.combo}|${snap.frenzyActive}|${snap.enraged}|${drops}`
}

export function useBossLoop(engine, { active, onFinish }) {
  const [view, setView] = useState(() => engine.getSnapshot())
  const rafRef = useRef(0)
  const sigRef = useRef('')
  const finishedRef = useRef(false)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  const push = useCallback((snap) => {
    setView({ ...snap, secondsLeft: Math.ceil(snap.timeLeftMs / 1000) })
  }, [])

  useEffect(() => {
    if (!active) return
    if (engine.status === 'idle') engine.start()

    const frame = (now) => {
      const snap = engine.tick(now)
      const sig = signature(snap)
      if (sig !== sigRef.current) {
        sigRef.current = sig
        push(snap)
      }
      if (snap.status === 'finished') {
        if (!finishedRef.current) {
          finishedRef.current = true
          onFinishRef.current?.(snap.score, 'sprint', snap)
        }
        return
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    const onVis = () => (document.hidden ? engine.pause() : engine.resume())
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [active, engine, push])

  const attack = useCallback(() => {
    const res = engine.attack()
    if (res) push(engine.getSnapshot())
    return res
  }, [engine, push])

  const collect = useCallback(
    (id) => {
      const res = engine.collect(id)
      if (res) push(engine.getSnapshot())
      return res
    },
    [engine, push],
  )

  return { ...view, attack, collect }
}
