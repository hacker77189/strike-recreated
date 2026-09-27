// ---------------------------------------------------------------------------
// STRIKE Sale — Tier resolution
// ---------------------------------------------------------------------------
import { TIERS } from './config.js'

/**
 * Resolve the tier a score earns: the highest tier whose `minScore` is met.
 * Tiers may be passed in any order; this does not assume they are sorted.
 *
 * @param {number} score       Bugs squashed.
 * @param {Tier[]} [tiers]     Tier table (defaults to the campaign tiers).
 * @returns {Tier}             The earned tier (never null — floor is minScore 0).
 */
export function tierForScore(score, tiers = TIERS) {
  const s = Number.isFinite(score) ? score : 0
  let earned = null
  for (const t of tiers) {
    if (s >= t.minScore && (earned === null || t.minScore > earned.minScore)) {
      earned = t
    }
  }
  // Fallback to the lowest tier if nothing matched (score below every minScore).
  if (earned === null) {
    earned = tiers.reduce((lo, t) => (t.minScore < lo.minScore ? t : lo), tiers[0])
  }
  return earned
}

/** Bugs still needed to reach the next tier up, or null if already at the top. */
export function toNextTier(score, tiers = TIERS) {
  const sorted = [...tiers].sort((a, b) => a.minScore - b.minScore)
  const next = sorted.find((t) => t.minScore > score)
  return next ? { need: next.minScore - score, tier: next } : null
}
