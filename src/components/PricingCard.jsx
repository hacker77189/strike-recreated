import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'

export default function PricingCard({ plan, saleTarget = false }) {
  const [idx, setIdx] = useState(plan.defaultDuration ?? 0)
  // Show the banner while the image loads fine; if it 404s we fall back to the
  // plain text heading so the card is never left without a title.
  const [imgOk, setImgOk] = useState(!!plan.image)
  const active = plan.durations[idx]
  const isGold = plan.theme === 'gold'

  return (
    <motion.div
      {...(saleTarget ? { 'data-sale-target': '' } : {})}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className={`group relative flex flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:p-8
        ${isGold ? 'hover:ring-1 hover:ring-gold/50 hover:shadow-[0_20px_50px_rgba(212,160,23,0.18)]' : 'hover:ring-1 hover:ring-white/25 hover:shadow-black/40'}`}
      style={{ background: plan.cardGradient, border: `1px solid ${plan.cardBorder}` }}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#ffe9a8] to-[#d4a017] px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-black shadow-lg">
          {plan.badge}
        </span>
      )}

      {/* Full-bleed banner (breaks out of the card padding). */}
      {imgOk && (
        <div className="relative -mx-7 -mt-7 mb-5 overflow-hidden rounded-t-2xl sm:-mx-8 sm:-mt-8">
          <img
            src={plan.image}
            alt={`${plan.name} membership`}
            onError={() => setImgOk(false)}
            className="h-52 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 sm:h-60"
            loading="lazy"
          />
          {/* fade the bottom edge into the card body */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
      )}

      <div className="mb-2 flex items-center gap-2">
        <h3 className={imgOk ? 'sr-only' : `font-audiowide text-xl ${isGold ? 'text-gold-grad' : 'text-white'}`}>
          {plan.name}
        </h3>
      </div>
      <p className="min-h-[40px] text-[13.5px] leading-relaxed text-neutral-400">{plan.desc}</p>

      {/* Duration selector */}
      <div className="mt-5 grid grid-cols-3 gap-1.5 rounded-xl border border-white/8 bg-black/30 p-1">
        {plan.durations.map((d, i) => {
          const on = i === idx
          return (
            <button
              key={d.label}
              onClick={() => setIdx(i)}
              className={`relative rounded-lg px-2 py-2 text-[12.5px] font-medium transition-colors ${on ? 'text-black' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              {on && (
                <motion.span
                  layoutId={`dur-${plan.id}`}
                  className={`absolute inset-0 rounded-lg ${isGold ? 'bg-gradient-to-r from-[#ffe9a8] to-[#d4a017]' : 'bg-white'}`}
                  transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                />
              )}
              <span className="relative">{d.label}</span>
            </button>
          )
        })}
      </div>

      {/* Price (animates on duration change) */}
      <div className="mt-6 flex items-end gap-3">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={active.price}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex items-end gap-3"
          >
            <span className={`font-audiowide text-4xl ${isGold ? 'text-gold-grad' : 'text-white'}`}>₹{active.price}</span>
            <div className="mb-1 flex flex-col">
              <span className="text-[13px] text-neutral-500 line-through">₹{active.was}</span>
              <span className="text-[12px] font-semibold text-[#28c840]">{active.off} OFF</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Features */}
      <ul className="mt-6 flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-neutral-300">
            <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${isGold ? 'text-gold' : 'text-neutral-400'}`} strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        className={`group mt-7 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all
          ${isGold
            ? 'bg-gradient-to-r from-[#ffe9a8] to-[#d4a017] text-black hover:shadow-lg hover:shadow-[rgba(212,160,23,0.3)]'
            : 'bg-white text-black hover:shadow-lg hover:shadow-white/10'}`}
      >
        {plan.cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </motion.div>
  )
}
