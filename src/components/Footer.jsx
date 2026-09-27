const COLS = [
  { h: 'Platform', links: ['Home', 'Practice', 'DSA Sheet'] },
  { h: 'Company', links: ['Contact'] },
  { h: 'Legal', links: ['Terms of Service', 'Privacy Policy'] },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <span className="font-display text-3xl font-bold tracking-[0.2em] text-white">STRIKE</span>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-neutral-400">
            Empowering developers with cutting-edge tools and resources. Powered by Coder Army, Strike is your gateway to a world of endless coding with guided lessons, real projects, level up your skills.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.h}>
            <p className="font-semibold text-white">{c.h}</p>
            <ul className="mt-4 space-y-3">
              {c.links.map((l) => (
                <li key={l}><a href="#" className="text-neutral-400 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl items-center justify-between border-t border-white/5 pt-6 text-sm text-neutral-500">
        <span>© 2025 STRIKE. All rights reserved.</span>
        <a href="#home" className="flex items-center gap-1.5 hover:text-white transition-colors">↑ Top</a>
      </div>
    </footer>
  )
}
