import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Bug, Lightbulb, AlertTriangle, Info } from 'lucide-react'
import { SUGGESTIONS, THOUGHTS, BUG_SHOTS } from '../data/editor.js'

const TABS = [
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
  { id: 'bugs', label: 'Bug Shots', icon: Bug },
]

const BUG_ICON = { warning: AlertTriangle, info: Info, hint: Lightbulb }
const BUG_TONE = {
  warning: 'text-[#e8c874] border-[rgba(212,160,23,0.3)]',
  info: 'text-[#569cd6] border-[#569cd6]/30',
  hint: 'text-[#6a9955] border-[#6a9955]/30',
}

export default function AIAssistant() {
  const [tab, setTab] = useState('ai')

  return (
    <div className="flex h-full flex-col bg-[#0a0a0a]">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
        <div className="flex items-center gap-1">
          {TABS.map((t) => {
            const Icon = t.icon
            const isActive = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-colors
                  ${isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
                {isActive && (
                  <motion.span
                    layoutId="ai-tab-underline"
                    className="absolute inset-x-1 -bottom-[9px] h-[2px] rounded-full bg-gold"
                  />
                )}
              </button>
            )
          })}
        </div>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-neutral-500">
          Static
        </span>
      </div>

      <div className="scroll-thin flex-1 overflow-auto p-3">
        <AnimatePresence mode="wait">
          {tab === 'ai' ? (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Quick Suggestions</p>
              <div className="space-y-2">
                {SUGGESTIONS.map((s) => (
                  <div key={s.t} className="card-ring rounded-lg bg-white/[0.02] p-3 transition-colors hover:border-white/15 hover:bg-white/[0.04]">
                    <p className="text-[13px] font-medium text-neutral-200">{s.t}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">{s.d}</p>
                  </div>
                ))}
              </div>

              <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Thoughts</p>
              <ul className="space-y-1.5">
                {THOUGHTS.map((t) => (
                  <li key={t} className="flex gap-2 text-[12px] leading-relaxed text-neutral-400">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold" />
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key="bugs"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {BUG_SHOTS.map((b, i) => {
                const Icon = BUG_ICON[b.level] || Info
                return (
                  <div key={i} className={`rounded-lg border bg-white/[0.02] p-3 ${BUG_TONE[b.level]}`}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      <span className="text-[13px] font-medium text-neutral-200">{b.title}</span>
                      <span className="ml-auto font-mono text-[11px] text-neutral-500">L{b.line}</span>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">{b.detail}</p>
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
