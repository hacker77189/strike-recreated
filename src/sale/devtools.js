// ---------------------------------------------------------------------------
// STRIKE Sale — Devtools bridge
// ---------------------------------------------------------------------------
// Exposes window.strikeSale so the experience can be driven from the console
// during judging / debugging. No-op outside the browser.
// ---------------------------------------------------------------------------
export function installDevtools(store) {
  if (typeof window === 'undefined') return
  window.strikeSale = {
    /** Lock a coupon directly: strikeSale.claim(7, 'sprint') */
    claim: (score, source = 'sprint') => store.claim(score, source),
    /** Start the hunt phase (spawns the ambient bug). */
    startHunt: () => store.startHunt(),
    /** Force the claimed coupon to expire right now (demo the expired state). */
    expire: () => store.expireOffer(),
    /** Wipe all sale state back to idle (clears localStorage too). */
    reset: () => store.reset(),
    /** Inspect the current persisted snapshot. */
    state: () => store.getState(),
    /** The live campaign config (tiers, round shape, selectors). */
    config: store.campaign,
  }
}
