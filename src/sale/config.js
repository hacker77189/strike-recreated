// ---------------------------------------------------------------------------
// STRIKE Sale — Campaign configuration (single source of truth)
// ---------------------------------------------------------------------------
// Nothing in the sale UI should hardcode discount percentages, coupon codes,
// tier thresholds, round duration, or spawn count. Import from here instead.
// Change the numbers in this file and the entire experience re-tunes itself.
// ---------------------------------------------------------------------------

/**
 * Discount tiers, ordered by ascending minScore.
 * tierForScore() (see tiers.js) picks the highest tier whose minScore is met.
 *
 * @typedef {Object} Tier
 * @property {number} minScore  Minimum bugs squashed to unlock this tier.
 * @property {number} percent   Discount percentage granted.
 * @property {string} code      Coupon code revealed.
 * @property {string} label     Human-facing rank name.
 */
export const TIERS = [
  { minScore: 0, percent: 40, code: 'SQUASH40', label: 'Bug Hunter' },
  { minScore: 4, percent: 50, code: 'SQUASH50', label: 'Sharp-Eyed Hunter' },
  { minScore: 7, percent: 60, code: 'SQUASH60', label: 'Elite Hunter' },
]

/**
 * Round shape. `totalSpawns` bugs appear over `durationMs`, one at a time.
 * The ramp controls how the per-spawn visible window shrinks as the round
 * progresses (early bugs linger, late bugs are fleeting) — see round.js.
 *
 * @typedef {Object} RampConfig
 * @property {number} durationMs      Total live-round length.
 * @property {number} totalSpawns     Exact number of spawns in a round.
 * @property {number} firstWindowMs   Visible window for the first spawn.
 * @property {number} lastWindowMs    Visible window for the final spawn.
 * @property {number} leadInMs        Delay before the first spawn appears.
 */
export const DEFAULT_ROUND_CONFIG = {
  durationMs: 10000,
  totalSpawns: 12,
  firstWindowMs: 1200,
  lastWindowMs: 620,
  leadInMs: 260,
}

/** Countdown length (3 → 2 → 1 → GO) before the live round begins, in ms. */
export const COUNTDOWN_MS = 2600

/**
 * Boss-fight tuning. The boss is the "Legacy Bug" — a glitch monster with HP.
 * Damage the player deals over the fight is translated into the shared tier
 * score by scoreForDamage(), so the boss reuses the exact same discount tiers.
 *
 * @typedef {Object} BossConfig
 * @property {number} maxHp          Total boss health.
 * @property {number} durationMs     Fight time limit.
 * @property {number} baseDamage     Damage per clean hit before multipliers.
 * @property {number} critChance     0..1 chance a hit crits.
 * @property {number} critMultiplier Crit damage multiplier.
 * @property {number} comboStep      Multiplier added per combo tier (x1 + step*combo).
 * @property {number} comboMax       Cap on the combo multiplier bonus.
 * @property {number} comboWindowMs  Time to land the next hit before combo resets.
 * @property {number} enrageAtPct    HP fraction (0..1) at which the boss enrages.
 * @property {number} powerUpEveryMs Cadence of floating power-up drops.
 * @property {number} shardEveryMs   Cadence of tappable bonus glitch-shards.
 * @property {number} scoreScale     Max tier-score a full kill maps to (0..scoreScale).
 * @property {number[]} damageTierCuts Ascending damage fractions (0..1) required
 *   to reach each tier, index-aligned to TIERS. The top tier uses a strict `>`
 *   (e.g. 0.80 means "above 80% damage"); lower tiers use `>=`.
 */
export const BOSS = {
  maxHp: 1000,
  durationMs: 10000,
  baseDamage: 34,
  critChance: 0.18,
  critMultiplier: 2.4,
  comboStep: 0.12,
  comboMax: 1.6,
  comboWindowMs: 950,
  enrageAtPct: 0.3,
  powerUpEveryMs: 2600,
  shardEveryMs: 1300,
  scoreScale: 12,
  // 40% off from any damage, 50% off from ≥40% damage, 60% off only ABOVE 80%.
  damageTierCuts: [0, 0.4, 0.8],
}

/**
 * Map damage dealt to the shared tier score. When the boss defines
 * `damageTierCuts` (aligned to `tiers`), damage fractions are bucketed into
 * tiers directly and the matched tier's `minScore` is returned — so the reward
 * bands are exact (e.g. the ceiling tier only unlocks above 80% damage). Falls
 * back to the linear `scoreScale` mapping if no cuts are configured.
 * @returns {number} integer score suitable for tierForScore().
 */
export function scoreForDamage(damageDealt, boss = BOSS, tiers = TIERS) {
  const frac = Math.max(0, Math.min(1, damageDealt / boss.maxHp))
  const cuts = boss.damageTierCuts
  if (Array.isArray(cuts) && cuts.length === tiers.length) {
    let idx = 0
    for (let i = 0; i < tiers.length; i++) {
      const top = i === tiers.length - 1
      const meets = top ? frac > cuts[i] : frac >= cuts[i]
      if (meets) idx = i
    }
    return tiers[idx].minScore
  }
  return Math.round(frac * boss.scoreScale)
}

/** The whole campaign, bundled for the provider. */
export const CAMPAIGN = {
  id: 'strike-bug-bounty-2026',
  name: 'Bug Bounty Boss Fight',
  tiers: TIERS,
  round: DEFAULT_ROUND_CONFIG,
  boss: BOSS,
  countdownMs: COUNTDOWN_MS,
  // How long a claimed coupon stays redeemable. The countdown is anchored to the
  // claim time and persisted, so refreshing the page never restarts it. Tune
  // freely — 15 min gives a real flash-sale urgency without being punitive.
  // (For a live demo you can expire instantly from the console: strikeSale.expire())
  offerWindowMs: 15 * 60 * 1000,
  // CSS selector for the card the Phase 3 lightning strikes.
  targetSelector: '[data-sale-target]',
  // localStorage key — only 'hunting' / 'claimed' snapshots are persisted.
  storageKey: 'strike.sale.v1',
}

/**
 * Absolute expiry timestamp for a claimed offer. Anchored to the (persisted)
 * claim time so it is stable across reloads. Returns null if not yet claimed.
 */
export function offerExpiresAt(claimedAt, campaign = CAMPAIGN) {
  if (!claimedAt) return null
  return claimedAt + campaign.offerWindowMs
}

/** Highest discount attainable — for "up to X% off" marketing copy. */
export function ceilingPercent(tiers = TIERS) {
  return tiers.reduce((max, t) => (t.percent > max ? t.percent : max), 0)
}

/** Guaranteed discount — the floor tier, always granted (e.g. on skip). */
export function floorPercent(tiers = TIERS) {
  return tiers.reduce((min, t) => (t.percent < min ? t.percent : min), Infinity)
}

/** The floor tier object itself (lowest minScore). Used by the skip path. */
export function floorTier(tiers = TIERS) {
  return tiers.reduce((lo, t) => (t.minScore < lo.minScore ? t : lo), tiers[0])
}
