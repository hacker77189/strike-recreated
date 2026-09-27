import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Spotlight from './Spotlight.jsx'

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 * i },
  }),
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4 pb-20 pt-40 sm:pt-44"
    >
      <Spotlight />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          custom={0}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[12px] text-neutral-300 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Powered by Coder Army
        </motion.div>

        <h1 className="font-audiowide text-[clamp(2.4rem,7vw,5.25rem)] leading-[1.05] tracking-tight">
          <motion.span variants={fade} initial="hidden" animate="show" custom={1} className="block text-white">
            Take control of <span className="text-white/40">your</span>
          </motion.span>
          <motion.span variants={fade} initial="hidden" animate="show" custom={2} className="block text-white">
            Future With <span className="text-orange-grad">Strike</span>
          </motion.span>
        </h1>

        <motion.p
          variants={fade}
          initial="hidden"
          animate="show"
          custom={3}
          className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed sm:text-[17px]"
          style={{ color: '#ccccdd' }}
        >
          Master DSA, System Design &amp; AI with interactive coding environments.
        </motion.p>

        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          custom={4}
          className="mt-9 flex items-center justify-center gap-3"
        >
          <a
            href="#courses"
            onClick={(e) => { e.preventDefault(); document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="group flex items-center gap-2 rounded-full bg-orange-grad px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-orange"
          >
            Join Us
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#playground"
            onClick={(e) => { e.preventDefault(); document.querySelector('#playground')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-medium text-neutral-200 backdrop-blur transition-colors hover:bg-white/10"
          >
            Try the Editor
          </a>
        </motion.div>
      </div>
    </section>
  )
}
