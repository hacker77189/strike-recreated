import ProgressChart from './ProgressChart.jsx'

const CARD = 'rounded-3xl border border-white/10 bg-card p-8'

// Public assets (served from /public). Filenames contain spaces → URL-encoded.
const MEDIA = {
  interview: '/why_choose_us/interview_prep.png',
  aiSupport: '/why_choose_us/AI%20Support.mp4',
  projects: '/why_choose_us/Project%20based%20learning.mp4',
}

function Video({ src, className = '' }) {
  return (
    <video
      className={className}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
    />
  )
}

export default function WhyChooseUs() {
  return (
    <section id="why" className="px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-6xl md:text-7xl font-bold text-silver">Why Choose <span className="text-orange-grad">Us</span></h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
          Learn smarter with modern tools, guided mentors, and a platform built to help you grow your skills fast.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-2">
        <div className={`${CARD} flex flex-col min-h-[280px]`}>
          <h3 className="text-2xl font-bold text-white"><span className="font-extrabold">Inter</span>view Preparation</h3>
          <p className="mt-2 max-w-xs text-neutral-400">Learn faster with hands-on tracks and mentor feedback.</p>
          <div className="mt-6 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            <img
              src={MEDIA.interview}
              alt="Interview preparation"
              loading="lazy"
              className="h-full min-h-[240px] w-full object-cover"
            />
          </div>
        </div>

        <div className={`${CARD} flex flex-col min-h-[280px]`}>
          <h3 className="text-2xl font-bold text-white">AI Support</h3>
          <p className="mt-2 max-w-xs text-neutral-400">Get instant, context-aware help while you build.</p>
          <div className="mt-6 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            <Video src={MEDIA.aiSupport} className="h-full min-h-[150px] w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-6xl gap-6 lg:grid-cols-[1fr_1.6fr]">
        <div className={`${CARD} flex flex-col`}>
          <h3 className="text-2xl font-bold text-white"><span className="font-extrabold">Projects</span> Based Learning</h3>
          <div className="mt-6 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            <Video src={MEDIA.projects} className="h-full min-h-[180px] w-full object-cover" />
          </div>
        </div>
        <ProgressChart />
      </div>
    </section>
  )
}
