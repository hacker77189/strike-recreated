// ---------------------------------------------------------------------------
// STRIKE Sale — BossEngine (headless boss-fight core)
// ---------------------------------------------------------------------------
// Pure logic for the "Legacy Bug" boss fight. No React, no DOM, no timers of
// its own — an external rAF loop drives it via tick(now). Everything is keyed
// off `elapsedMs` (which freezes on pause), so timed effects and drop windows
// stay consistent across pause/resume for free.
// ---------------------------------------------------------------------------
import { BOSS, scoreForDamage } from '../config.js'

const FRENZY_MS = 2600 // coffee: tap damage x2 for this long
const DUCK_BURST = 4.5 // rubber duck: instant burst = baseDamage * this
const SHARD_BURST = 1.7 // glitch shard: instant bonus = baseDamage * this
const POWERUP_TTL = 2600 // how long a floating power-up stays catchable
const SHARD_TTL = 1300

/** Build the deterministic schedule of collectible drops over the fight. */
export function generateDropSchedule(cfg = BOSS) {
  const drops = []
  let id = 0
  // Power-ups: alternate coffee / duck.
  for (let t = cfg.powerUpEveryMs; t < cfg.durationMs - 400; t += cfg.powerUpEveryMs) {
    const type = (drops.filter((d) => d.type !== 'shard').length % 2) === 0 ? 'coffee' : 'duck'
    drops.push({ id: ++id, type, atMs: Math.round(t), ttlMs: POWERUP_TTL })
  }
  // Glitch shards: more frequent, offset so they don't stack on power-ups.
  for (let t = cfg.shardEveryMs + 500; t < cfg.durationMs - 300; t += cfg.shardEveryMs) {
    drops.push({ id: ++id, type: 'shard', atMs: Math.round(t), ttlMs: SHARD_TTL })
  }
  return drops.sort((a, b) => a.atMs - b.atMs)
}

const MAX_TICK_DELTA = 120

export class BossEngine {
  /**
   * @param {BossConfig} [cfg]
   * @param {() => number} [source] RNG in [0,1); defaults to Math.random.
   */
  constructor(cfg = BOSS, source = Math.random) {
    this.cfg = cfg
    this.rng = source
    this.drops = generateDropSchedule(cfg)
    this._byId = new Map(this.drops.map((d) => [d.id, d]))

    this.status = 'idle'
    this.elapsedMs = 0
    this.hp = cfg.maxHp
    this.maxHp = cfg.maxHp
    this.damageDealt = 0
    this.combo = 0
    this.enraged = false
    this.victory = false

    this._lastHitAt = -Infinity
    this._frenzyUntil = -Infinity
    this.collectedIds = new Set()
    this.expiredIds = new Set()

    this._paused = false
    this._lastNow = null
  }

  get comboMultiplier() {
    if (this.combo <= 1) return 1
    return 1 + Math.min(this.cfg.comboMax, this.cfg.comboStep * (this.combo - 1))
  }

  get frenzyActive() {
    return this.elapsedMs < this._frenzyUntil
  }

  start() {
    if (this.status !== 'idle') return
    this.status = 'running'
    this._paused = false
    this._lastNow = null
  }

  pause() {
    if (this.status === 'running') this._paused = true
  }

  resume() {
    if (this.status === 'running') {
      this._paused = false
      this._lastNow = null
    }
  }

  tick(now) {
    if (this.status !== 'running') return this.getSnapshot()
    if (this._lastNow === null) this._lastNow = now
    if (this._paused) {
      this._lastNow = now
      return this.getSnapshot()
    }
    let delta = now - this._lastNow
    this._lastNow = now
    if (!Number.isFinite(delta) || delta < 0) delta = 0
    if (delta > MAX_TICK_DELTA) delta = MAX_TICK_DELTA
    this.elapsedMs += delta
    this._reconcile()
    return this.getSnapshot()
  }

  /** Player strikes the boss. Returns hit info (or null if not allowed). */
  attack() {
    if (this.status !== 'running') return null
    // Combo: extend if within the window, else restart at 1.
    if (this.elapsedMs - this._lastHitAt <= this.cfg.comboWindowMs) this.combo += 1
    else this.combo = 1
    this._lastHitAt = this.elapsedMs

    const crit = this.rng() < this.cfg.critChance
    const frenzyMul = this.frenzyActive ? 2 : 1
    let dmg = this.cfg.baseDamage * this.comboMultiplier * frenzyMul
    if (crit) dmg *= this.cfg.critMultiplier
    dmg = Math.round(dmg)

    this._applyDamage(dmg)
    return { damage: dmg, crit, combo: this.combo, frenzy: this.frenzyActive }
  }

  /** Collect a floating drop by id. Returns the effect applied (or null). */
  collect(id) {
    if (this.status !== 'running') return null
    const d = this._byId.get(id)
    if (!d || this.collectedIds.has(id) || this.expiredIds.has(id)) return null
    const open = d.atMs <= this.elapsedMs && this.elapsedMs < d.atMs + d.ttlMs
    if (!open) return null
    this.collectedIds.add(id)

    if (d.type === 'coffee') {
      this._frenzyUntil = this.elapsedMs + FRENZY_MS
      return { type: 'coffee', frenzyMs: FRENZY_MS }
    }
    if (d.type === 'duck') {
      const burst = Math.round(this.cfg.baseDamage * DUCK_BURST)
      this._applyDamage(burst)
      return { type: 'duck', damage: burst }
    }
    // shard
    const burst = Math.round(this.cfg.baseDamage * SHARD_BURST)
    this._applyDamage(burst)
    return { type: 'shard', damage: burst }
  }

  _applyDamage(dmg) {
    const applied = Math.min(dmg, this.hp)
    this.hp -= applied
    this.damageDealt += applied
    if (this.hp <= 0) {
      this.hp = 0
      this.victory = true
      this.finishNow()
    }
  }

  finishNow() {
    if (this.status === 'finished') return
    this.status = 'finished'
  }

  _reconcile() {
    // Expire uncollected drops whose window has closed.
    for (const d of this.drops) {
      if (
        d.atMs + d.ttlMs <= this.elapsedMs &&
        !this.collectedIds.has(d.id) &&
        !this.expiredIds.has(d.id)
      ) {
        this.expiredIds.add(d.id)
      }
    }
    // Combo decay.
    if (this.combo > 0 && this.elapsedMs - this._lastHitAt > this.cfg.comboWindowMs) {
      this.combo = 0
    }
    // Enrage.
    if (!this.enraged && this.hp / this.maxHp <= this.cfg.enrageAtPct) this.enraged = true
    // Time out.
    if (this.elapsedMs >= this.cfg.durationMs) this.finishNow()
  }

  /** Currently-catchable drops (window open, not yet collected/expired). */
  activeDrops() {
    const out = []
    for (const d of this.drops) {
      if (
        d.atMs <= this.elapsedMs &&
        this.elapsedMs < d.atMs + d.ttlMs &&
        !this.collectedIds.has(d.id) &&
        !this.expiredIds.has(d.id)
      ) {
        out.push(d)
      }
    }
    return out
  }

  /** Tier score this performance maps to (reuses the shared tier ladder). */
  get score() {
    return scoreForDamage(this.damageDealt, this.cfg)
  }

  getSnapshot() {
    return {
      status: this.status,
      hp: this.hp,
      maxHp: this.maxHp,
      hpPct: this.hp / this.maxHp,
      damageDealt: this.damageDealt,
      score: this.score,
      combo: this.combo,
      comboMultiplier: this.comboMultiplier,
      frenzyActive: this.frenzyActive,
      enraged: this.enraged,
      victory: this.victory,
      elapsedMs: Math.round(this.elapsedMs),
      timeLeftMs: Math.max(0, Math.round(this.cfg.durationMs - this.elapsedMs)),
      activeDrops: this.activeDrops(),
    }
  }
}
