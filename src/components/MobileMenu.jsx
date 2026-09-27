import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { NAV_LINKS } from '../data/navigation.js'

/**
 * Full-width slide-down mobile menu. Rendered under the navbar and animated
 * with AnimatePresence so it mounts/unmounts cleanly.
 */
export default function MobileMenu({ open, active, onSelect, onClose, topOffset = 44 }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ top: topOffset + 68 }}
            className="fixed inset-x-4 z-50 rounded-2xl border border-zinc-800 bg-ink-900/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((link, i) => {
                const isActive = active === link.id
                return (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i }}
                  >
                    <a
                      href={link.href}
                      onClick={onSelect(link)}
                      className={`flex items-center justify-between rounded-xl px-3 py-3 text-[15px] transition-colors
                        ${isActive ? 'bg-white/5 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'}`}
                    >
                      {link.label}
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </a>
                  </motion.li>
                )
              })}
            </ul>

            <a
              href="#membership"
              onClick={(e) => { e.preventDefault(); onClose(); document.querySelector('#membership')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-black"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
