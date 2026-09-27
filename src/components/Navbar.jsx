import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { NAV_LINKS, BRAND } from '../data/navigation.js'
import MobileMenu from './MobileMenu.jsx'

export default function Navbar({ bannerOpen = true }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (link) => (e) => {
    e.preventDefault()
    setActive(link.id)
    setMenuOpen(false)
    const el = document.querySelector(link.href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ top: bannerOpen ? 44 : 12 }}
        className="fixed inset-x-0 z-50 px-4 transition-[top] duration-300"
      >
        <nav
          className={`mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border px-4 sm:h-16 sm:px-6 xl:max-w-6xl
            ${scrolled
              ? 'border-zinc-800 bg-background/80 shadow-xl shadow-black/40 backdrop-blur-xl'
              : 'border-white/5 bg-background/40 backdrop-blur-md'}`}
        >
          {/* Brand */}
          <a href="#home" onClick={go(NAV_LINKS[0])} className="relative z-10 flex items-center gap-2">
            <span className="font-audiowide text-xl tracking-[0.18em] text-white sm:text-2xl">{BRAND}</span>
          </a>

          {/* Desktop nav — absolutely centered pill */}
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
            <ul className="pointer-events-auto flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.id
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      onClick={go(link)}
                      className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors
                        ${isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-dot"
                          className="h-1.5 w-1.5 rounded-full bg-accent"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Right cluster */}
          <div className="relative z-10 flex items-center gap-3">
            <a
              href="#membership"
              onClick={(e) => { e.preventDefault(); document.querySelector('#membership')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="group hidden items-center gap-1.5 rounded-full bg-orange-grad px-4 py-2 text-[13px] font-semibold text-white transition-all hover:shadow-orange sm:flex"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            {/* Animated hamburger (mobile) */}
            <button
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="relative flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full border border-white/10 bg-white/5 lg:hidden"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block h-[2px] w-4 rounded-full bg-neutral-200"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block h-[2px] w-4 rounded-full bg-neutral-200"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block h-[2px] w-4 rounded-full bg-neutral-200"
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        active={active}
        onSelect={go}
        onClose={() => setMenuOpen(false)}
        topOffset={bannerOpen ? 44 : 12}
      />
    </>
  )
}
