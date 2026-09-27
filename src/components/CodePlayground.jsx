import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Circle } from 'lucide-react'
import CodeEditor from './CodeEditor.jsx'
import Terminal from './Terminal.jsx'
import AIAssistant from './AIAssistant.jsx'
import { WELCOME_CODE, FILE_NAME, RUN_OUTPUT } from '../data/editor.js'

export default function CodePlayground() {
  const [lines, setLines] = useState([])
  const [running, setRunning] = useState(false)

  const runProgram = () => {
    if (running) return
    setRunning(true)
    setTimeout(() => {
      setLines((prev) => [...prev, ...RUN_OUTPUT.slice(1)])
      setRunning(false)
    }, 650)
  }

  const onRunClick = () => {
    setLines((prev) => [...prev, RUN_OUTPUT[0]])
    runProgram()
  }

  const handleCommand = (raw) => {
    const cmd = raw.toLowerCase().trim()
    if (cmd === 'clear') {
      setLines([])
      return
    }
    setLines((prev) => [...prev, { type: 'cmd', text: `$ ${raw}` }])

    if (cmd === 'help') {
      setLines((prev) => [
        ...prev,
        { type: 'muted', text: 'Available commands:' },
        { type: 'log', text: '  run          execute strike.js' },
        { type: 'log', text: '  clear        clear the terminal' },
        { type: 'log', text: '  about        about this playground' },
      ])
    } else if (['run', 'run strike.js', 'node strike.js'].includes(cmd)) {
      runProgram()
    } else if (cmd === 'about') {
      setLines((prev) => [
        ...prev,
        { type: 'log', text: 'STRIKE interactive playground — a live JS runtime demo.' },
      ])
    } else {
      setLines((prev) => [...prev, { type: 'error', text: `command not found: ${raw}` }])
    }
  }

  return (
    <section id="playground" className="relative px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.28em] text-gold">Live Environment</p>
          <h2 className="font-audiowide text-[clamp(1.8rem,4vw,3rem)] leading-tight text-silver">
            Code. Run. Learn.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-400">
            A real editor, terminal and AI companion — right on the page. Hit Run, or type in the terminal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0f0f0f] shadow-2xl shadow-black/60"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-3 border-b border-white/5 bg-[#151515] px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="ml-2 flex items-center gap-2 rounded-t-md border-b-2 border-gold bg-[#0f0f0f] px-3 py-1.5 text-[12.5px] text-neutral-300">
              <span className="h-2 w-2 rounded-full bg-gold" />
              {FILE_NAME}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-[12px] text-[#28c840] sm:flex">
                <Circle className="h-2 w-2 fill-current" /> Ready
              </span>
              <button
                onClick={onRunClick}
                disabled={running}
                className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[#28c840] to-[#1a9e30] px-3.5 py-1.5 text-[12.5px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                {running ? 'Running…' : 'Run Code'}
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="grid lg:grid-cols-[1.6fr_1fr]">
            <div className="flex min-w-0 flex-col border-white/5 lg:border-r">
              <CodeEditor code={WELCOME_CODE} activeLine={3} />
              <Terminal lines={lines} onCommand={handleCommand} running={running} />
            </div>
            <div className="min-h-[360px] border-t border-white/5 lg:border-t-0">
              <AIAssistant />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
