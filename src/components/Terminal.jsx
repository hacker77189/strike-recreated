import { useEffect, useRef, useState } from 'react'
import { TerminalSquare } from 'lucide-react'

const COLOR = {
  cmd: 'text-neutral-300',
  log: 'text-[#d4d4d4]',
  ok: 'text-[#6a9955]',
  muted: 'text-neutral-500',
  error: 'text-[#f47174]',
  coupon: 'text-[#ffd700] font-semibold',
}

/**
 * Interactive terminal. Output lines are owned by the parent; typing a command
 * and pressing Enter calls onCommand(cmd). Auto-scrolls to the newest line.
 */
export default function Terminal({ lines, onCommand, running }) {
  const [value, setValue] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, running])

  const submit = (e) => {
    e.preventDefault()
    const cmd = value.trim()
    if (!cmd) return
    onCommand(cmd)
    setValue('')
  }

  return (
    <div className="flex h-full flex-col border-t border-white/5 bg-[#050505]">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2 text-[12px] text-neutral-400">
        <TerminalSquare className="h-3.5 w-3.5" />
        Terminal
        {running && <span className="ml-2 text-[#6a9955]">running…</span>}
      </div>

      <div ref={scrollRef} className="scroll-thin max-h-56 flex-1 overflow-auto px-4 py-3 font-mono text-[12.5px] leading-6">
        {lines.length === 0 && (
          <p className="text-neutral-600">Type <span className="text-neutral-400">help</span> or press “Run Code”.</p>
        )}
        {lines.map((l, i) => (
          <div key={i} className={COLOR[l.type] || 'text-[#d4d4d4]'}>{l.text}</div>
        ))}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/5 px-4 py-2.5">
        <span className="font-mono text-[13px] text-[#6a9955]">$</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          placeholder="try: help, run, clear"
          className="w-full bg-transparent font-mono text-[13px] text-neutral-200 placeholder:text-neutral-600 focus:outline-none"
        />
      </form>
    </div>
  )
}
