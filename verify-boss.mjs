// ---------------------------------------------------------------------------
// STRIKE Boss — headless verification (run: node verify-boss.mjs)
// ---------------------------------------------------------------------------
// Exercises BossEngine + the damage→tier mapping with a deterministic RNG and a
// manual clock (no rAF, no DOM). Pure Node; no build step required.
//
// NOTE: the engine clamps each tick delta to MAX_TICK_DELTA (120ms) so a
// backgrounded tab can't fast-forward the fight. The tests therefore advance
// the clock in small steps via step(), exactly like the real rAF loop does.
// ---------------------------------------------------------------------------
import assert from 'node:assert/strict'
import { BossEngine, generateDropSchedule } from './src/sale/boss-fight/bossEngine.js'
import { BOSS, scoreForDamage } from './src/sale/config.js'
import { tierForScore } from './src/sale/tiers.js'

let passed = 0
function check(name, fn) {
  try {
    fn()
    passed += 1
    console.log(`  ✓ ${name}`)
  } catch (err) {
    console.error(`  ✗ ${name}\n    ${err.message}`)
    process.exitCode = 1
  }
}

// A scripted RNG so crit outcomes are deterministic.
function rngFrom(values) {
  let i = 0
  return () => values[i++ % values.length]
}

// Advance an engine's clock from `from` to `to` in ~16ms steps (like rAF).
// Returns the ending clock value.
function step(e, from, to, dt = 16) {
  for (let t = from; t < to; t += dt) e.tick(t)
  e.tick(to)
  return to
}

console.log('BossEngine')

check('starts idle, becomes running on start()', () => {
  const e = new BossEngine(BOSS, rngFrom([0.99]))
  assert.equal(e.getSnapshot().status, 'idle')
  e.start()
  assert.equal(e.getSnapshot().status, 'running')
  assert.equal(e.hp, BOSS.maxHp)
})

check('no attack/collect before start', () => {
  const e = new BossEngine(BOSS, rngFrom([0.99]))
  assert.equal(e.attack(), null)
  assert.equal(e.collect(1), null)
})

check('clean hit deals baseDamage (rng high → no crit)', () => {
  const e = new BossEngine(BOSS, rngFrom([0.99]))
  e.start()
  const r = e.attack()
  assert.equal(r.crit, false)
  assert.equal(r.damage, BOSS.baseDamage) // combo 1 → x1, no frenzy
  assert.equal(e.damageDealt, BOSS.baseDamage)
})

check('crit multiplies damage (rng low → crit)', () => {
  const e = new BossEngine(BOSS, rngFrom([0.0]))
  e.start()
  const r = e.attack()
  assert.equal(r.crit, true)
  assert.equal(r.damage, Math.round(BOSS.baseDamage * BOSS.critMultiplier))
})

check('combo grows within window, resets after it lapses', () => {
  const e = new BossEngine(BOSS, rngFrom([0.99]))
  e.start()
  e.attack() // combo 1
  e.attack() // combo 2 (elapsed still 0, within window)
  assert.equal(e.combo, 2)
  assert.ok(e.comboMultiplier > 1)
  // advance past the combo window so _reconcile decays the combo
  step(e, 0, BOSS.comboWindowMs + 200)
  assert.equal(e.combo, 0)
})

check('coffee triggers frenzy → next hit is doubled', () => {
  const drops = generateDropSchedule(BOSS)
  const coffee = drops.find((d) => d.type === 'coffee')
  const e = new BossEngine(BOSS, rngFrom([0.99]))
  e.start()
  step(e, 0, coffee.atMs + 10) // walk the clock into the coffee window
  const res = e.collect(coffee.id)
  assert.equal(res.type, 'coffee')
  assert.ok(e.frenzyActive)
  const hit = e.attack()
  assert.equal(hit.damage, BOSS.baseDamage * 2) // combo 1, frenzy x2
})

check('duck / shard apply instant burst damage', () => {
  const drops = generateDropSchedule(BOSS)
  const duck = drops.find((d) => d.type === 'duck')
  const shard = drops.find((d) => d.type === 'shard')
  const e = new BossEngine(BOSS, rngFrom([0.99]))
  e.start()
  let now = step(e, 0, shard.atMs + 5)
  const sBefore = e.damageDealt
  const sr = e.collect(shard.id)
  assert.equal(sr.type, 'shard')
  assert.ok(e.damageDealt > sBefore)
  now = step(e, now, duck.atMs + 5)
  const dBefore = e.damageDealt
  const dr = e.collect(duck.id)
  assert.equal(dr.type, 'duck')
  assert.ok(dr.damage > sr.damage) // duck burst > shard burst
  assert.equal(e.damageDealt, dBefore + dr.damage)
})

check('cannot collect the same drop twice, or an expired one', () => {
  const drops = generateDropSchedule(BOSS)
  const shard = drops.find((d) => d.type === 'shard')
  const e = new BossEngine(BOSS, rngFrom([0.99]))
  e.start()
  let now = step(e, 0, shard.atMs + 5)
  assert.ok(e.collect(shard.id))
  assert.equal(e.collect(shard.id), null) // already collected
  // let its window (and everything else) close, then a fresh drop is gone too
  now = step(e, now, BOSS.durationMs)
  const other = drops.find((d) => d.id !== shard.id)
  assert.equal(e.collect(other.id), null)
})

check('killing the boss sets victory + finishes, damage capped at maxHp', () => {
  const e = new BossEngine(BOSS, rngFrom([0.0])) // always crit → fast kill
  e.start()
  for (let i = 0; i < 500 && e.status === 'running'; i++) e.attack()
  assert.equal(e.status, 'finished')
  assert.equal(e.victory, true)
  assert.equal(e.hp, 0)
  assert.equal(e.damageDealt, BOSS.maxHp) // never over-counts
})

check('enrage flips once HP crosses the threshold', () => {
  const e = new BossEngine(BOSS, rngFrom([0.99]))
  e.start()
  assert.equal(e.enraged, false)
  while (e.hp / e.maxHp > BOSS.enrageAtPct && e.status === 'running') e.attack()
  e.tick(0) // reconcile
  assert.equal(e.enraged, true)
})

check('times out to finished at durationMs (no victory)', () => {
  const e = new BossEngine(BOSS, rngFrom([0.99]))
  e.start()
  step(e, 0, BOSS.durationMs + 100)
  assert.equal(e.status, 'finished')
  assert.equal(e.victory, false)
})

check('pause/resume freezes elapsed time', () => {
  const e = new BossEngine(BOSS, rngFrom([0.99]))
  e.start()
  step(e, 0, 1000)
  const at1s = e.getSnapshot().elapsedMs
  assert.ok(at1s >= 980 && at1s <= 1000) // ~1s of real ticks
  e.pause()
  step(e, 1000, 5000) // ignored while paused
  assert.equal(e.getSnapshot().elapsedMs, at1s)
  e.resume()
  step(e, 5000, 5500) // resumes cleanly from where it left off
  assert.ok(Math.abs(e.getSnapshot().elapsedMs - (at1s + 500)) <= 20)
})

check('large tick deltas are clamped (tab-away protection)', () => {
  const e = new BossEngine(BOSS, rngFrom([0.99]))
  e.start()
  e.tick(0)
  e.tick(10000) // one huge jump
  assert.ok(e.getSnapshot().elapsedMs <= 120) // MAX_TICK_DELTA
})

console.log('\ndamage → tier mapping')

check('zero damage → floor tier (40%)', () => {
  assert.equal(tierForScore(scoreForDamage(0)).percent, 40)
})

check('half the boss killed → mid tier (50%)', () => {
  const t = tierForScore(scoreForDamage(BOSS.maxHp * 0.5))
  assert.equal(t.percent, 50)
})

check('full kill → ceiling tier (60%)', () => {
  const t = tierForScore(scoreForDamage(BOSS.maxHp))
  assert.equal(t.percent, 60)
  assert.equal(t.code, 'SQUASH60')
})

check('exactly 80% damage stays at 50% (ceiling needs ABOVE 80%)', () => {
  const t = tierForScore(scoreForDamage(BOSS.maxHp * 0.8))
  assert.equal(t.percent, 50)
})

check('just under 80% damage → 50%', () => {
  const t = tierForScore(scoreForDamage(BOSS.maxHp * 0.79))
  assert.equal(t.percent, 50)
})

check('just above 80% damage → 60%', () => {
  const t = tierForScore(scoreForDamage(BOSS.maxHp * 0.801))
  assert.equal(t.percent, 60)
})

check('just under 40% damage → floor 40%', () => {
  const t = tierForScore(scoreForDamage(BOSS.maxHp * 0.39))
  assert.equal(t.percent, 40)
})

check('score is monotonic in damage', () => {
  let prev = -1
  for (let d = 0; d <= BOSS.maxHp; d += 50) {
    const s = scoreForDamage(d)
    assert.ok(s >= prev)
    prev = s
  }
})

console.log(`\n${passed} checks passed.`)
