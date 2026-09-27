const T = [
  { n: 'Namita Singh', r: 'Full Stack Developer', q: 'I learned everything from beginner to advanced levels and built multiple real-world projects that strengthened my skills and boosted my confidence as a full-stack developer.' },
  { n: 'Gopal Kumar Jha', r: 'Software Developer', q: "Completed Nexus MERN in 8-9 months. Rohit Bhaiya taught not just 'what' but 'why' behind everything. My consistency broke many times, but I finally made it!" },
  { n: 'Adheli Priyanka', r: 'Software Developer', q: 'Nexus builds from basics with in-depth explanations. Daily homework, live classes, and project contests with rewards kept me motivated throughout my learning journey.' },
  { n: 'Alok', r: 'Software Developer', q: 'The live classes, HD recordings, and daily practice problems made learning smooth. Real-world projects prepared me for actual development work in the industry.' },
  { n: 'Aryan Verma', r: 'Backend Developer', q: 'Best decision I made was joining Nexus. The First Principles teaching helped me understand concepts deeply, not just memorize solutions like other courses.' },
  { n: 'Shree', r: 'MERN Stack Developer', q: 'From zero coding knowledge to building full-stack projects, Nexus transformed my career. The mentorship and doubt support made all the difference in my journey.' },
  { n: 'Navlesh Kumar', r: 'Full Stack Developer', q: "Rohit Sir's First Principles approach transformed how I build applications. From beginner to advanced, every concept clicked perfectly and boosted my confidence as a developer." },
  { n: 'Babita Patel', r: 'Coder Army', q: 'Nexus gave me a true from-scratch learning experience. The way they simplify core concepts, combined with daily assignments, live guidance, and exciting project challenges with rewards, kept me consistent and motivated every single day.' },
  { n: 'Mehul Prajapati', r: 'Full Stack Engineer', q: 'The way complex topics like System Design and Blockchain are taught in Nexus is unmatched. I built 5+ projects that directly helped me crack multiple interviews.' },
  { n: 'Sonu', r: 'Software Developer', q: 'Nexus gave me everything I needed - MERN Stack, DSA, System Design, all in one place. The community support and regular contests pushed me beyond my limits.' },
]

function Card({ n, r, q }) {
  return (
    <div className="w-[360px] shrink-0 rounded-2xl border border-white/10 bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent/40 to-black text-sm font-bold text-white/90">
          {n.split(' ').map((w) => w[0]).join('').slice(0, 2)}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-white">{n}</p>
          <p className="text-[12px] text-accent">{r}</p>
        </div>
      </div>
      <p className="mt-4 text-[14px] leading-relaxed text-neutral-400">"{q}"</p>
    </div>
  )
}

function Row({ items, dir }) {
  const doubled = [...items, ...items]
  return (
    <div className="flex gap-6 w-max" style={{ animation: `${dir} 48s linear infinite` }}>
      {doubled.map((t, i) => (<Card key={i} {...t} />))}
    </div>
  )
}

export default function Testimonials() {
  const half = Math.ceil(T.length / 2)
  return (
    <section className="py-24 overflow-hidden">
      <div className="px-4 text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-accent">Reviews</p>
        <h2 className="mt-4 font-display text-5xl md:text-6xl font-bold text-silver">
          Trusted by <span className="text-orange-grad">Visionaries</span>
        </h2>
        <p className="mt-5 text-lg text-neutral-400">Hear from real users who achieved success with our platform</p>
      </div>

      <div className="mt-16 space-y-6 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="overflow-hidden"><Row items={T.slice(0, half)} dir="marquee" /></div>
        <div className="overflow-hidden"><Row items={T.slice(half)} dir="marquee2" /></div>
      </div>
    </section>
  )
}
