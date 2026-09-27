// ---------------------------------------------------------------------------
// STRIKE Sale — Store (observable + persisted)
// ---------------------------------------------------------------------------
// A tiny framework-agnostic store around the phase reducer. Only 'hunting' and
// 'claimed' states are persisted to localStorage; 'idle' and any mid-round
// bookkeeping never touch storage (mid-round state lives in the RoundEngine).
// ---------------------------------------------------------------------------
import { initialState, reducer } from './machine.js'
import { CAMPAIGN } from './config.js'

function loadPersisted(storageKey, tiers) {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data.phase !== 'hunting' && data.phase !== 'claimed') return null
    // Re-hydrate the tier object from the live campaign table by code, so a
    // config change (e.g. new percentages) is reflected for returning users.
    if (data.phase === 'claimed' && data.tier) {
      const fresh = tiers.find((t) => t.code === data.tier.code)
      if (fresh) data.tier = fresh
    }
    return data
  } catch {
    return null
  }
}

function persist(storageKey, state) {
  try {
    if (state.phase === 'hunting' || state.phase === 'claimed') {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } else {
      localStorage.removeItem(storageKey)
    }
  } catch {
    /* storage disabled / private mode — the experience still works in-memory */
  }
}

export function createSaleStore(campaign = CAMPAIGN) {
  const tiers = campaign.tiers
  const storageKey = campaign.storageKey

  let state = loadPersisted(storageKey, tiers) || { ...initialState }
  const listeners = new Set()

  function getState() {
    return state
  }

  function dispatch(action) {
    const next = reducer(state, action, tiers)
    if (next === state) return state
    state = next
    persist(storageKey, state)
    listeners.forEach((fn) => fn(state))
    return state
  }

  function subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }

  return {
    getState,
    dispatch,
    subscribe,
    // Convenience action creators.
    startHunt: () => dispatch({ type: 'START_HUNT' }),
    claim: (score, source) =>
      dispatch({ type: 'CLAIM', score, source, offerWindowMs: campaign.offerWindowMs }),
    expireOffer: () => dispatch({ type: 'EXPIRE_OFFER' }),
    reset: () => dispatch({ type: 'RESET' }),
    campaign,
  }
}
