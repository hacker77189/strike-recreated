// Floating wrench / tools button pinned to the right edge (matches STRIKE homepage)
export default function ToolButton() {
  return (
    <button
      aria-label="Tools"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 h-14 w-14 rounded-full bg-white text-black grid place-items-center shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 transition-transform"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.1-.6-.6-2.1 2.1-2.1z" />
      </svg>
    </button>
  )
}
