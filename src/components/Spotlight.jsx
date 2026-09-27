import { useEffect, useRef } from 'react'

/**
 * Hero atmospheric layer:
 *  - two large, blurred, rotated light beams flanking the hero
 *  - a cursor-follow "reveal" layer: hidden brand artwork that only shows
 *    within ~240px of the pointer, via a radial CSS mask driven by --mx/--my.
 *
 * We recreate the STRIKE reveal artwork with CSS/SVG only (no copyrighted
 * image asset): a faint dot grid + oversized Audiowide wordmark.
 *
 * Pointer updates are throttled with requestAnimationFrame and skipped on
 * small screens for performance.
 */
export default function Spotlight() {
  const rootRef = useRef(null)
  const frame = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(max-width: 768px)').matches) return

    const root = rootRef.current
    if (!root) return

    const onMove = (e) => {
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        frame.current = 0
        const rect = root.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        root.style.setProperty('--mx', `${x}px`)
        root.style.setProperty('--my', `${y}px`)
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Atmospheric beams */}
      <div className="beam beam-left animate-beam" />
      <div className="beam beam-right animate-beam" style={{ animationDelay: '2s' }} />

      {/* Base soft glow */}
      <div className="hero-glow absolute inset-0" />

      {/* Cursor-reveal artwork (masked to the pointer) */}
      <div className="spotlight-reveal absolute inset-0">
        {/* dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        {/* oversized brand wordmark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-audiowide select-none text-[22vw] leading-none tracking-[0.1em] text-white/70">
            STRIKE
          </span>
        </div>
      </div>
    </div>
  )
}
