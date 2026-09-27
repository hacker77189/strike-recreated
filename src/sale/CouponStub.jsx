// ---------------------------------------------------------------------------
// STRIKE Sale — CouponStub (the locked reward)
// ---------------------------------------------------------------------------
// Persistent coupon once phase === 'claimed'. A dockable pill at the bottom of
// the screen with copy-to-clipboard, a live expiry countdown, and a dismiss
// button. Reads the locked tier + expiry from the store; it never resolves
// discounts itself. Once the countdown hits zero the offer is shown expired and
// the code can no longer be copied/redeemed.
// ---------------------------------------------------------------------------
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, Ticket, Clock, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useSaleSnapshot, useSaleActions } from './react.jsx'
import { offerExpiresAt } from './config.js'

function formatRemaining(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

export default function CouponStub() {
  const snap = useSaleSnapshot()
  const { config } = useSaleActions()
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  // Resolve the absolute expiry: prefer the persisted value, fall back to
  // (claimedAt + window) for any older snapshot saved before expiry existed.
  const expiresAt =
    snap.expiresAt ?? offerExpiresAt(snap.claimedAt, config)

  // One 1s ticker while the offer is live; it stops itself at expiry.
  useEffect(() => {
    if (!expiresAt || Date.now() >= expiresAt) {
      setNow(Date.now())
      return
    }
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (t >= expiresAt) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  if (snap.phase !== 'claimed' || !snap.tier || dismissed) return null
  const { code, percent, label } = snap.tier

  const remaining = expiresAt != null ? expiresAt - now : null
  const expired = remaining != null && remaining <= 0

  async function copy() {
    if (expired) return
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      /* clipboard blocked — the code is still visible to copy manually */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const urgent = !expired && remaining != null && remaining <= 60_000

  return (
    <div className="fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className={`pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border bg-ink-900/95 shadow-[0_12px_50px_rgba(0,0,0,0.5)] backdrop-blur ${
          expired ? 'border-white/10 opacity-95' : 'border-gold/30'
        }`}
      >
        {/* Header row: expand/collapse toggle + dismiss (separate buttons so we
            never nest interactive elements). */}
        <div className="flex items-center">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex flex-1 items-center gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-lg ${
                expired ? 'bg-white/5 text-neutral-500' : 'bg-gold/15 text-gold'
              }`}
            >
              <Ticket size={18} />
            </span>
            <span className="flex-1">
              <span className="block text-[11px] uppercase tracking-wide text-neutral-500">
                {expired ? `${label} · expired` : `${label} · unlocked`}
              </span>
              <span
                className={`font-display text-lg ${
                  expired ? 'text-neutral-500 line-through' : 'text-gold'
                }`}
              >
                {percent}% OFF
              </span>
            </span>
            {/* Live countdown / expired badge */}
            {expired ? (
              <span className="rounded-md bg-red-500/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-400">
                Expired
              </span>
            ) : (
              remaining != null && (
                <span
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-semibold tabular-nums ${
                    urgent ? 'bg-red-500/15 text-red-300' : 'bg-white/5 text-neutral-300'
                  }`}
                  aria-label={`Offer expires in ${formatRemaining(remaining)}`}
                >
                  <Clock size={13} />
                  {formatRemaining(remaining)}
                </span>
              )
            )}
            <span className="ml-1 text-neutral-500">
              {open ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss this offer"
            className="mr-2 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-neutral-500 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <X size={16} />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {expired ? (
                <div className="border-t border-white/10 px-4 py-3 text-center">
                  <p className="text-sm text-neutral-400">
                    This offer has expired and can no longer be redeemed.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
                    <code className="flex-1 rounded-lg border border-dashed border-gold/40 bg-black/40 px-3 py-2 text-center font-mono text-base tracking-[0.15em] text-white">
                      {code}
                    </code>
                    <button
                      onClick={copy}
                      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-gold to-goldsoft px-3.5 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="px-4 pb-3 text-center text-[11px] text-neutral-500">
                    Apply at checkout on any STRIKE Plus or Ultra membership.
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
