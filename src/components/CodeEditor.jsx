import { highlight } from './highlight.jsx'

/**
 * Read-only code surface with gutter line numbers, exact VS Code syntax
 * colors and a blinking caret on the active line.
 */
export default function CodeEditor({ code, activeLine = 3 }) {
  const lines = code.split('\n')

  return (
    <div className="scroll-thin overflow-auto bg-[#0a0a0a] font-mono text-[13px] leading-6">
      <div className="min-w-full">
        {lines.map((line, i) => {
          const n = i + 1
          const isActive = n === activeLine
          return (
            <div
              key={n}
              className={`group flex items-start px-0 ${isActive ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'}`}
            >
              <span className="line-number w-12 flex-shrink-0 select-none pr-4 text-right">{n}</span>
              <code className="tok-default whitespace-pre pr-6">
                {line.length ? highlight(line) : ' '}
                {isActive && (
                  <span className="ml-[1px] inline-block h-[15px] w-[2px] translate-y-[3px] animate-blink bg-[#d4d4d4] align-middle" />
                )}
              </code>
            </div>
          )
        })}
      </div>
    </div>
  )
}
