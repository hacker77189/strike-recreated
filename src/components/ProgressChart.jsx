const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const LINE = [20, 24, 37, 44, 57, 65, 73, 82, 90] // % progression points
const BARS = [55, 62, 48, 78, 60, 52, 72]

export default function ProgressChart() {
  const w = 560
  const h = 240
  const pts = LINE.map((v, i) => `${(i / (LINE.length - 1)) * w},${h - (v / 100) * h}`)
  const linePath = `M ${pts.join(' L ')}`
  const areaPath = `${linePath} L ${w},${h} L 0,${h} Z`

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0a1207] to-[#080808] p-6">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-2xl font-bold text-white">Track Your Progress</h4>
          <p className="mt-1 font-semibold text-emerald-400">Grow With Strike</p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Progress Tracking
        </span>
      </div>

      <div className="relative mt-6">
        <div className="pointer-events-none absolute -left-1 inset-y-0 flex flex-col justify-between text-[11px] text-neutral-600">
          <span>100%</span><span>75%</span><span>50%</span><span>25%</span>
        </div>
        <div className="ml-8 relative h-60">
          <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#84ff5f" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#84ff5f" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#area)" />
            <path d={linePath} fill="none" stroke="#84ff5f" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(132,255,95,0.7)]" />
            {pts.map((p, i) => {
              const [x, y] = p.split(',')
              return <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 7 : 4} fill="#84ff5f" className={i === pts.length - 1 ? 'drop-shadow-[0_0_10px_rgba(132,255,95,1)]' : ''} />
            })}
          </svg>
          <div className="absolute inset-x-0 bottom-6 flex items-end justify-around gap-2 px-2">
            {BARS.map((b, i) => (
              <div key={i} className="w-8 rounded-md bg-gradient-to-t from-emerald-500 to-emerald-300" style={{ height: `${b}%` }} />
            ))}
          </div>
        </div>
        <div className="ml-8 mt-2 flex justify-around text-[11px] text-neutral-500">
          {DAYS.map((d) => (<span key={d}>{d}</span>))}
        </div>
      </div>
    </div>
  )
}
