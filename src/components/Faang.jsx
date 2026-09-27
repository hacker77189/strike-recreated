// Brand logos recreated as styled text (no copyrighted image assets).
const LOGOS = [
  <span key="pp" className="text-3xl font-extrabold italic"><span className="text-[#003087]">Pay</span><span className="text-[#009cde]">Pal</span></span>,
  <span key="or" className="text-4xl font-bold tracking-tight text-[#C74634]">ORACLE</span>,
  <span key="go" className="text-4xl font-bold"><span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span></span>,
  <span key="fb" className="flex items-center gap-2 text-2xl font-bold text-white"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#1877F2] text-white">f</span>facebook</span>,
  <span key="am" className="text-3xl font-bold text-white">amazon<span className="text-[#FF9900]">↝</span></span>,
  <span key="ms" className="flex items-center gap-2 text-3xl font-semibold text-white">
    <span className="grid grid-cols-2 gap-0.5"><span className="h-3 w-3 bg-[#F25022]" /><span className="h-3 w-3 bg-[#7FBA00]" /><span className="h-3 w-3 bg-[#00A4EF]" /><span className="h-3 w-3 bg-[#FFB900]" /></span>
    Microsoft
  </span>,
  <span key="nf" className="text-3xl font-extrabold tracking-tight text-[#E50914]">NETFLIX</span>,
  <span key="ap" className="flex items-center gap-1.5 text-3xl font-semibold text-white"><span className="text-3xl"></span>Apple</span>,
  <span key="ub" className="text-3xl font-bold lowercase tracking-tight text-white">Uber</span>,
  <span key="nv" className="text-3xl font-bold text-[#76B900]">NVIDIA</span>,
  <span key="ad" className="flex items-center gap-2 text-3xl font-bold text-white"><span className="grid h-9 w-9 place-items-center rounded-md bg-[#FA0F00] text-lg font-black text-white">A</span>Adobe</span>,
]

function LogoLoop() {
  const doubled = [...LOGOS, ...LOGOS]
  return (
    <div className="relative mx-auto mt-14 max-w-4xl overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max items-center gap-x-16 animate-marquee">
        {doubled.map((logo, i) => (
          <div key={i} className="flex shrink-0 items-center opacity-80 transition-opacity hover:opacity-100">
            {logo}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Faang() {
  return (
    <section className="px-4 py-24 text-center">
      <h2 className="mx-auto max-w-4xl font-display text-4xl md:text-5xl font-bold leading-tight text-silver">
        Get All <span className="text-orange-grad">Premium</span> Questions Asked In <span className="text-orange-grad">FAANG</span> Companies
      </h2>

      <LogoLoop />

      <div className="mt-14">
        <button className="rounded-lg bg-white/[0.06] border border-white/10 px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
          Go Ahead
        </button>
      </div>
    </section>
  )
}
