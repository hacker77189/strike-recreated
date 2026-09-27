import { motion } from 'framer-motion'
import { PLANS } from '../data/pricing.js'
import PricingCard from './PricingCard.jsx'

export default function Membership() {
  return (
    <section id="membership" className="relative overflow-hidden bg-[#050505] px-4 py-24">
      {/* soft gold glow behind the cards */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,160,23,0.12),transparent_70%)] blur-2xl" />

      <div className="relative mx-auto max-w-6xl text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-gold">The Strike Membership</p>
        <h2 className="mt-5 font-audiowide leading-tight">
          <span className="block text-[clamp(2.2rem,5vw,4rem)] text-white">Membership</span>
          <span className="block text-[clamp(1.8rem,4vw,3rem)] text-silver">Plans</span>
        </h2>
        <p className="mt-6 text-[17px] text-neutral-300">One focused investment in your engineering career.</p>
        <p className="mt-1 text-neutral-500">Every course. Present and future. Pay once, learn for your plan duration.</p>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-2">
        {PLANS.map((p) => (
          <PricingCard key={p.id} plan={p} saleTarget={p.id === 'ultra'} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative mt-10 text-center text-[13px] text-neutral-600"
      >
        Prices inclusive of GST · One-time payment · No renewals
      </motion.p>
    </section>
  )
}
