# STRIKE — Homepage Clone + "Squash the Legacy Bug" Sale Experience

A pixel-accurate recreation of the [STRIKE](https://strikes.in) coding-education
homepage, built as the canvas for an original, gamified **sale experience**: a
one-input boss fight where visitors battle a "Legacy Bug" to unlock a real,
tiered membership discount.

The homepage clone is the environment; the boss-fight sale is the original work.

**Live Demo:** https://hacker77189.github.io/strike-recreated/

---

## Quick start

**Requirements:** Node.js 18+ and npm.

**1. Clone the repository**

```bash
git clone https://github.com/hacker77189/strike-recreated.git
cd strike-recreated
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the dev server**

```bash
npm run dev
```

Open the URL Vite prints (default http://localhost:5173) in your browser.

**4. Claim the discount offer**

Once the homepage loads, the sale plays out entirely on the page:

1. Wait ~1 second — a **Legacy Bug** starts roaming the page ("Legacy Bug
   appeared — fight it →"). Click it.
2. The boss fight opens. Press **Start**, wait for the 3·2·1·GO countdown,
   then **tap / click / press any key** to attack the glitch-monster. Chain
   hits for combos, land crits, and grab power-ups (☕ coffee, 🦆 duck, ⚡ shard)
   before the 10-second timer runs out. More damage = a bigger discount tier.
3. When the fight ends, hit **Claim** on the result screen. A lightning bolt
   strikes the **Strike Ultra** membership card, and your coupon (e.g.
   `SQUASH50`) appears as a copyable stub with a live expiry countdown.
4. Copy the code — it's your membership discount. It persists across page
   refreshes until it expires.

> **Shortcut for demos:** open the browser console and run
> `window.strikeSale.claim(12)` to jump straight to a claimed top-tier (60%-off)
> state, or `window.strikeSale.reset()` to start over. (`claim()` takes a score;
> higher scores unlock higher discount tiers.)

### Other scripts

```bash
npm run build          # production build → dist/
npm run preview        # serve the production build locally
npm run deploy         # deploy to GitHub Pages
node verify-boss.mjs   # headless test of BossEngine + the damage→discount mapping
```


---

## What's implemented

**The homepage** — full section-by-section clone: sticky navbar with a
scroll-aware sale banner, hero, an interactive code playground (editor +
terminal + AI-assistant panel), membership plans with a live duration/price
selector, courses, "Why Choose Us", a scrolling company-logo ticker, mentors,
a testimonials marquee, FAQ, and footer.

**The sale experience — "Squash the Legacy Bug"** — a self-contained mini-game
layered natively over the page:

1. A bug roams the page; clicking it opens the boss fight.
2. A glitch-monster appears with an HP bar and a 10-second timer. One input
   (tap / click / keyboard) attacks it. Chained hits build a combo multiplier,
   hits can crit, and catchable power-ups (coffee, duck, shard) swing the fight.
3. Damage dealt maps to a discount tier. The reward is revealed with a
   tier-scaled lightning strike that lands on the **Strike Ultra** membership
   card, and a copyable coupon stub persists with a live expiry countdown.

The game needs no coding knowledge, so it's approachable for any visitor.

---

## Tech stack

- **Vite 5** + **React 18** (JavaScript / JSX)
- **Tailwind CSS 3** (PostCSS) for styling
- **Framer Motion** for animation, **lucide-react** for icons
- Fonts: Audiowide (display) + Inter (body), loaded in `index.html`

---

## Project structure

```
strike-recreated/
├── index.html
├── src/
│   ├── main.jsx            # React entry
│   ├── App.jsx             # composes all sections + mounts the sale
│   ├── index.css           # Tailwind layers + design tokens
│   ├── components/         # one file per homepage section
│   ├── data/               # copy & content (courses, pricing, editor, nav)
│   └── sale/               # the sale experience (see below)
├── public/                 # images & videos used by the sections
├── tailwind.config.js
└── vite.config.js
```

### The `src/sale/` module

The sale is built as a small, framework-agnostic state machine wrapped in React,
so the game logic is testable in isolation from the UI.

```
sale/
├── config.js               # single source of truth: tiers, coupons, tuning
├── tiers.js                # score → discount-tier resolution
├── machine.js              # pure reducer (idle → hunting → claimed)
├── store.js                # observable store + localStorage persistence
├── react.jsx               # SaleProvider + hooks
├── devtools.js             # window.strikeSale.* helpers for demos
├── SaleController.jsx       # orchestrates the three phases
├── AmbientBug.jsx           # phase 1: the roaming bug
├── Reveal.jsx               # phase 3: lightning strike on the reward
├── CouponStub.jsx           # persistent coupon + expiry countdown
└── boss-fight/              # the boss-fight game (headless engine + UI)
```

All discount percentages, coupon codes, tier thresholds, timers, and boss tuning
live in `config.js` — change the numbers there and the whole experience re-tunes.

---

## Notes

- **Assets:** all brand logos in the "FAANG" section are recreated with CSS/text
  (no copyrighted image files). Course, mentor, and membership images/videos live
  under `public/`.
- **Persistence:** a claimed coupon and its expiry survive a page refresh via
  `localStorage`, so the countdown never restarts on reload.
- **Accessibility:** the game supports keyboard input, honors
  `prefers-reduced-motion`, and uses an `aria-live` region for score updates.

---

