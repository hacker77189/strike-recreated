// ---------------------------------------------------------------------------
// STRIKE Sale — Phase machine (pure reducer)
// ---------------------------------------------------------------------------
// The sale has three persistent phases:
//   'idle'    — nothing started yet (never persisted)
//   'hunting' — the ambient bug is loose / sprint may be in progress
//   'claimed' — a coupon has been locked in (terminal, one-way)
//
// The claim is write-once: once 'claimed', the tier can never be overwritten.
// The skip path always yields the floor tier regardless of score.
// ---------------------------------------------------------------------------
import { tierForScore } from './tiers.js'
import { floorTier, CAMPAIGN } from './config.js'

/** @typedef {'idle'|'hunting'|'claimed'} SalePhase */

export const initialState = {
  phase: 'idle',
  tier: null, // { minScore, percent, code, label }
  score: null,
  source: null, // 'sprint' | 'skip'
  claimedAt: null,
  expiresAt: null, // absolute ms timestamp the coupon stops being redeemable
}

/**
 * @param {typeof initialState} state
 * @param {{type:string, [k:string]:any}} action
 * @param {Tier[]} tiers  Campaign tiers (injected so the reducer stays pure).
 */
export function reducer(state, action, tiers) {
  switch (action.type) {
    case 'START_HUNT': {
      // Don't disturb an already-claimed coupon or an in-progress hunt.
      if (state.phase !== 'idle') return state
      return { ...state, phase: 'hunting' }
    }

    case 'CLAIM': {
      // Write-once: a locked tier can never be overwritten.
      if (state.phase === 'claimed') return state

      const { score, source } = action
      const tier = source === 'skip' ? floorTier(tiers) : tierForScore(score, tiers)
      const now = Date.now()
      // The offer window can be injected per-dispatch; fall back to the campaign
      // default so the reducer stays usable standalone (e.g. in tests).
      const win = Number.isFinite(action.offerWindowMs)
        ? action.offerWindowMs
        : CAMPAIGN.offerWindowMs

      return {
        phase: 'claimed',
        tier,
        // The skip path records score 0 (it earns the floor tier by rule).
        score: source === 'skip' ? 0 : Math.max(0, Number(score) || 0),
        source: source === 'skip' ? 'skip' : 'sprint',
        claimedAt: now,
        expiresAt: now + win,
      }
    }

    // Force the current coupon to expire now (used by devtools to demo the
    // expired state without waiting out the real window). No-op unless claimed.
    case 'EXPIRE_OFFER': {
      if (state.phase !== 'claimed') return state
      if (state.expiresAt != null && state.expiresAt <= Date.now()) return state
      return { ...state, expiresAt: Date.now() }
    }

    case 'RESET':
      return { ...initialState }

    default:
      return state
  }
}
