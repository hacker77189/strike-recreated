import { motion, AnimatePresence } from 'framer-motion'
import { Zap, X } from 'lucide-react'

/**
 * Slim announcement / sale strip that sits above the navbar (fixed, 36px tall).
 * Controlled by the parent so the Navbar can offset itself precisely and slide
 * up when the banner is dismissed. This is also the anchor Part 2 grows into.
 */
export default function SaleBanner({ open, onClose, onOpenPlayground }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: -36, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -36, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-x-0 top-0 z-[60] flex h-9 items-center justify-center
                     border-b border-[rgba(212,160,23,0.25)]
                     bg-[linear-gradient(90deg,rgba(10,8,0,0.95),rgba(28,18,0,0.95),rgba(10,8,0,0.95))]
                     px-4 text-[12px] sm:text-[13px]"
        >
          <div className="flex items-center gap-2 text-neutral-300">
            <Zap className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
            <span className="hidden sm:inline">Strike Sale is live —</span>
            <button
              onClick={onOpenPlayground}
              className="font-semibold text-gold underline-offset-4 hover:underline"
            >
              explore the live code editor
            </button>
          </div>
          <button
            aria-label="Dismiss announcement"
            onClick={onClose}
            className="absolute right-3 text-neutral-500 transition-colors hover:text-neutral-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
