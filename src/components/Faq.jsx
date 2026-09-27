import { useState } from 'react'

const FAQS = [
  { q: 'What programming languages can I learn on the platform?', a: 'Strike offers comprehensive courses in JavaScript, Python, Java, C++, React, Node.js, and many more. We also provide courses on Data Structures, Algorithms, System Design, and Full-Stack Development with hands-on projects.' },
  { q: 'What will I learn in the DSA + Gen AI course?', a: "This course covers Data Structures & Algorithms from basics to advanced level, along with Generative AI fundamentals. You'll learn arrays, trees, graphs, dynamic programming, and how to build AI-powered applications using modern frameworks. The course includes 200+ problems, live doubt sessions, and real-world AI projects." },
  { q: 'Do I need prior coding experience to join DSA + Gen AI course?', a: "Basic programming knowledge in any language (C++, Java, or Python) is recommended. If you're completely new, we suggest starting with our beginner programming course first. The DSA + Gen AI course is designed for learners who know basic syntax and want to master algorithms and AI together." },
  { q: 'How is Gen AI integrated with DSA in this course?', a: "You'll learn how AI models use data structures internally, optimize algorithms for AI applications, and build Gen AI projects like chatbots, code generators, and recommendation systems. We teach practical AI integration with strong DSA fundamentals, preparing you for modern tech roles." },
  { q: 'Will this course help me crack product-based company interviews?', a: "Absolutely! The course is specifically designed for interview preparation. You'll solve 200+ problems from FAANG interview archives, learn First Principles problem-solving approach, and get weekly mock interviews. Our students have cracked interviews at Google, Microsoft, Amazon, and top startups." },
  { q: 'How long does it take to complete the DSA + Gen AI course?', a: 'The course is designed to be completed in 6-8 months with consistent daily practice. However, you get lifetime access to all course materials, so you can learn at your own pace. Most students spend 2-3 hours daily on lectures, practice problems, and projects to stay on track.' },
]

function Item({ q, a, open, onClick }) {
  return (
    <div className="rounded-xl border border-white/10 bg-card overflow-hidden">
      <button onClick={onClick} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
        <span className="text-lg font-medium text-white">{q}</span>
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-transform ${open ? 'rotate-45 text-accent' : 'text-neutral-300'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
        </span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-[15px] leading-relaxed text-neutral-400">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" className="px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-5xl md:text-6xl font-bold text-silver">Frequently Asked Questions <span className="text-orange-grad">Answered</span></h2>
        <p className="mt-5 text-lg text-neutral-400">Get instant answers to most common questions about Strike.</p>
      </div>
      <div className="mx-auto mt-14 max-w-4xl space-y-4">
        {FAQS.map((f, i) => (
          <Item key={i} {...f} open={open === i} onClick={() => setOpen(open === i ? null : i)} />
        ))}
      </div>
    </section>
  )
}
