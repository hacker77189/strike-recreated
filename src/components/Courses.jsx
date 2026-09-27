import { COURSES } from '../data/courses.js'

function ClockChip({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 border border-white/10 px-3 py-1 text-xs text-neutral-300">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
      {children}
    </span>
  )
}

export default function Courses() {
  return (
    <section id="courses" className="px-4 py-24">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-accent">What We Offer</p>
        <h2 className="mt-4 font-display text-5xl md:text-6xl font-bold text-silver">Explore Our Courses</h2>
        <p className="mt-5 text-lg text-neutral-400">Explore our comprehensive courses designed to elevate your skills</p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c, i) => (
          <article key={c.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-card hover:border-white/20 transition-colors">
            <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${c.grad}`}>
              {c.img && (
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              {c.live && (
                <span className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" /> LIVE
                </span>
              )}
            </div>
            <div className="bg-gradient-to-b from-transparent to-[#161009] p-6 text-center">
              <p className="text-[15px] text-neutral-300">{c.desc}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {c.chips.map((ch) => (<ClockChip key={ch}>{ch}</ClockChip>))}
              </div>
              <button className="mt-5 text-sm font-medium text-neutral-400 group-hover:text-accent transition-colors">
                Explore Course →
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
