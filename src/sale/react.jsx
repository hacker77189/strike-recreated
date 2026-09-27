// ---------------------------------------------------------------------------
// STRIKE Sale — React bindings
// ---------------------------------------------------------------------------
import { createContext, useContext, useMemo, useRef, useSyncExternalStore } from 'react'
import { createSaleStore } from './store.js'
import { CAMPAIGN } from './config.js'
import { installDevtools } from './devtools.js'

const SaleContext = createContext(null)

export function SaleProvider({ children, campaign = CAMPAIGN }) {
  const storeRef = useRef(null)
  if (storeRef.current === null) {
    storeRef.current = createSaleStore(campaign)
    installDevtools(storeRef.current)
  }
  return <SaleContext.Provider value={storeRef.current}>{children}</SaleContext.Provider>
}

function useStore() {
  const store = useContext(SaleContext)
  if (!store) throw new Error('useSale* must be used within <SaleProvider>')
  return store
}

/** Subscribe to the whole persisted sale snapshot ({phase, tier, score, ...}). */
export function useSaleSnapshot() {
  const store = useStore()
  return useSyncExternalStore(store.subscribe, store.getState, store.getState)
}

/**
 * Subscribe to a derived slice. Re-renders only when the selected value
 * changes by the (optional) equality fn (default: Object.is).
 */
export function useSaleSelector(selector, isEqual = Object.is) {
  const store = useStore()
  const lastRef = useRef({ has: false, value: undefined })

  const getSelection = () => {
    const next = selector(store.getState())
    const last = lastRef.current
    if (last.has && isEqual(last.value, next)) return last.value
    lastRef.current = { has: true, value: next }
    return next
  }

  return useSyncExternalStore(store.subscribe, getSelection, getSelection)
}

/**
 * Actions + read-only config. `claim` is the single entry point the UI uses
 * to lock a coupon; it must be called exactly once per campaign and never
 * speculatively (the store enforces write-once regardless).
 */
export function useSaleActions() {
  const store = useStore()
  return useMemo(
    () => ({
      startHunt: store.startHunt,
      claim: store.claim,
      reset: store.reset,
      config: store.campaign,
      snapshot: store.getState, // pull the latest without subscribing
    }),
    [store],
  )
}
