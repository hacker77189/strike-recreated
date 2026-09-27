import { useState } from 'react'
import { motion } from 'framer-motion'

const MENTORS = [
  {
    name: 'Rohit Negi',
    role: 'Founder & Lead Instructor',
    company: 'Ex-@Uber',
    bio: 'Heartfelt Problem Solver, Instructor, and Visionary Leader. Got Highest Placement in India of 2 Cr +. Post Graduate from IIT G, GATE-CSE’20 AIR - 202.',
    tags: ['IIT Graduate', 'Visionary Leader', '2 Cr+ Package'],
    hue: 'from-emerald-500/40',
    photo: '/mentors/rohit_negi.png',
  },
  {
    name: 'Aditya Tandon',
    role: 'Co-Founder & Senior Instructor',
    company: 'Ex-Ola | Currently @Oxyzo',
    bio: 'Senior Software Engineer passionate about scalable systems and elegant algorithms. Dedicated mentor committed to teaching, learning, and inspiring future developers.',
    tags: ['Scalable Systems & Algorithms Expert'],
    hue: 'from-amber-500/40',
    photo: '/mentors/aditya.png',
  },
]

function Avatar({ name, hue, photo }) {
  const [ok, setOk] = useState(true)
  const initials = name.split(' ').map((w) => w[0]).join('')
  if (photo && ok) {
    return (
      <img
        src={photo}
        alt={name}
        loading="lazy"
        onError={() => setOk(false)}
        className={`h-32 w-32 shrink-0 rounded-full border border-white/10 object-cover bg-gradient-to-br ${hue} to-black`}
      />
    )
  }
  return (
    <div className={`grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br ${hue} to-black border border-white/10 shrink-0`}>
      <span className="font-display text-3xl font-bold text-white/90">{initials}</span>
    </div>
  )
}

export default function Mentors() {
  return (
    <section id="mentors" className="px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-accent">Our Team</p>
        <h2 className="mt-4 text-center font-display text-5xl md:text-6xl font-bold text-silver">
          Meet With Our <span className="text-orange-grad">Mentors</span>
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
        {MENTORS.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            className="flex flex-col items-center rounded-3xl border border-white/10 bg-card px-8 py-10 text-center"
          >
            <Avatar name={m.name} hue={m.hue} photo={m.photo} />
            <h3 className="mt-6 font-display text-2xl font-bold text-white">{m.name}</h3>
            <p className="mt-2 text-sm font-medium text-accent">{m.role}</p>
            <p className="mt-1 text-[13px] text-neutral-500">{m.company}</p>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-neutral-400">{m.bio}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {m.tags.map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-neutral-300">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 flex items-center justify-center gap-3">
        <a
          href="#courses"
          onClick={(e) => { e.preventDefault(); document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' }) }}
          className="rounded-full bg-orange-grad px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-orange"
        >
          Start Learning
        </a>
        <a
          href="#membership"
          onClick={(e) => { e.preventDefault(); document.querySelector('#membership')?.scrollIntoView({ behavior: 'smooth' }) }}
          className="rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/10"
        >
          Know More
        </a>
      </div>
    </section>
  )
}
