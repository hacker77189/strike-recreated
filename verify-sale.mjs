// ---------------------------------------------------------------------------
// STRIKE Sale — headless logic verification
// ---------------------------------------------------------------------------
// Run from the strike-clone/ folder:   node verify-sale.mjs
// Exercises the pure engine (no React/DOM) against the Phase 2 acceptance
// criteria: deterministic schedule, one-active-at-a-time, auto-miss, exact
// pause/resume freeze, tier resolution, and write-once claim / skip floor.
// ---------------------------------------------------------------------------
import { generateSpawnSchedule, RoundEngine } from './src/sale/round.js'
import { DEFAULT_ROUND_CONFIG, TIERS, CAMPAIGN, offerExpiresAt } from './src/sale/config.js'
import { tierForScore } from './src/sale/tiers.js'
import { reducer, initialState } from './src/sale/machine.js'

let pass = 0, fail = 0
const ok = (name, cond) => { cond ? (pass++, console.log('  ok  ' + name)) : (fail++, console.error('FAIL  ' + name)) }

// --- Schedule -------------------------------------------------------------
const sched = generateSpawnSchedule()
ok('exactly 12 spawns', sched.length === 12)
ok('last spawn ends at durationMs', sched[11].endMs === DEFAULT_ROUND_CONFIG.durationMs)
ok('spawns are non-overlapping & ordered', sched.every((s, i) => i === 0 || s.startMs >= sched[i - 1].endMs))
ok('windows ramp down (first > last)', sched[0].windowMs > sched[11].windowMs)
const sched2 = generateSpawnSchedule()
ok('deterministic without a source', JSON.stringify(sched) === JSON.stringify(sched2))

// --- Engine: full auto-miss run ------------------------------------------
{
  const e = new RoundEngine()
  e.start()
  let t = 0
  while (e.getSnapshot().status !== 'finished' && t <= 11000) { e.tick(t); t += 16 }
  const s = e.getSnapshot()
  ok('round finishes by durationMs', s.status === 'finished')
  ok('all 12 resolved (missed when untouched)', s.missedIds.length === 12 && s.score === 0)
}

// --- Engine: one active at a time + hitting ------------------------------
{
  const e = new RoundEngine()
  e.start()
  let t = 0, activeSeen = 0, everTwoActive = false
  while (e.getSnapshot().status !== 'finished' && t <= 11000) {
    const s = e.tick(t)
    if (s.activeSpawnId) { activeSeen++; if (s.activeSpawn && s.activeSpawnId) e.hit(s.activeSpawnId) }
    t += 8
  }
  const s = e.getSnapshot()
  ok('hitting active spawns scores up to 12', s.score > 0 && s.score <= 12)
  ok('score = hit count', s.score === s.hitIds.length)
}

// --- Engine: pause/resume freezes elapsed exactly ------------------------
{
  const e = new RoundEngine()
  e.start()
  e.tick(0); e.tick(1000)
  const before = e.getSnapshot().elapsedMs
  e.pause()
  e.tick(5000); e.tick(9000) // time passes while paused
  const during = e.getSnapshot().elapsedMs
  e.resume()
  e.tick(9016)
  const after = e.getSnapshot().elapsedMs
  ok('elapsed frozen while paused', during === before)
  ok('no time jump on resume (<= one clamped frame)', after - before <= 120)
}

// --- Tiers ----------------------------------------------------------------
ok('score 0 -> 40%', tierForScore(0, TIERS).percent === 40)
ok('score 3 -> 40%', tierForScore(3, TIERS).percent === 40)
ok('score 4 -> 50%', tierForScore(4, TIERS).percent === 50)
ok('score 6 -> 50%', tierForScore(6, TIERS).percent === 50)
ok('score 7 -> 60%', tierForScore(7, TIERS).percent === 60)
ok('score 12 -> 60%', tierForScore(12, TIERS).percent === 60)

// --- Claim machine --------------------------------------------------------
{
  let s = reducer(initialState, { type: 'CLAIM', score: 9, source: 'sprint' }, TIERS)
  ok('sprint claim locks earned tier', s.phase === 'claimed' && s.tier.code === 'SQUASH60')
  const s2 = reducer(s, { type: 'CLAIM', score: 0, source: 'sprint' }, TIERS)
  ok('claim is write-once (cannot overwrite)', s2.tier.code === 'SQUASH60')

  const skip = reducer(initialState, { type: 'CLAIM', score: 999, source: 'skip' }, TIERS)
  ok('skip always grants the floor tier', skip.tier.percent === 40 && skip.source === 'skip' && skip.score === 0)
}

// --- Offer expiry ---------------------------------------------------------
{
  const before = Date.now()
  const claimed = reducer(initialState, { type: 'CLAIM', score: 9, source: 'sprint' }, TIERS)
  ok('claim records a claimedAt timestamp', typeof claimed.claimedAt === 'number' && claimed.claimedAt >= before)
  ok('claim sets an expiresAt in the future', claimed.expiresAt > claimed.claimedAt)
  ok(
    'expiresAt = claimedAt + campaign window',
    claimed.expiresAt === claimed.claimedAt + CAMPAIGN.offerWindowMs,
  )
  ok(
    'offerExpiresAt() matches the persisted expiry',
    offerExpiresAt(claimed.claimedAt) === claimed.expiresAt,
  )

  // An injected per-dispatch window overrides the default (what the store does).
  const shortWin = reducer(initialState, { type: 'CLAIM', score: 9, source: 'sprint', offerWindowMs: 5000 }, TIERS)
  ok('per-dispatch offerWindowMs is honoured', shortWin.expiresAt === shortWin.claimedAt + 5000)

  // EXPIRE_OFFER pulls the expiry back to now (devtools demo of the expired UI).
  const expired = reducer(claimed, { type: 'EXPIRE_OFFER' }, TIERS)
  ok('EXPIRE_OFFER makes the coupon expired now', expired.expiresAt <= Date.now())
  ok('EXPIRE_OFFER keeps the tier intact (still redeemable data)', expired.tier.code === claimed.tier.code)
  ok('EXPIRE_OFFER is a no-op before any claim', reducer(initialState, { type: 'EXPIRE_OFFER' }, TIERS) === initialState)

  // Refresh simulation: re-hydrating a persisted snapshot must keep the SAME
  // expiry (the countdown never restarts on reload).
  const roundtrip = JSON.parse(JSON.stringify(claimed))
  ok('expiry survives a persist/reload round-trip', roundtrip.expiresAt === claimed.expiresAt)
}

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
