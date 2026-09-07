---
name: Parts-Mall Africa
description: Industrial-trade design system for a South African automotive parts distribution network. Wide display type, navy authority, one signal green, light-locked.
register: brand
dials:
  variance: 7
  motion: 4
  density: 6
colors:
  ink: "oklch(0.20 0.030 262)"
  ink-soft: "oklch(0.32 0.028 262)"
  navy-900: "oklch(0.25 0.070 262)"
  navy-700: "oklch(0.38 0.110 262)"
  signal: "oklch(0.64 0.150 155)"
  signal-deep: "oklch(0.53 0.135 155)"
  paper: "oklch(0.985 0.004 90)"
  steel: "oklch(0.53 0.020 262)"
typography:
  display: "Archivo, wdth 112 to 125, weight 800"
  body: "Public Sans"
  mono: "Martian Mono, wdth 87.5"
radius: "4px, one value everywhere"
---

# Design system: Parts-Mall Africa

## The read

B2B trade-distribution brand site for time-pressured South African workshop
buyers, fleet procurement and prospective distributors. Industrial-signage
language. Design IS the product here, so the register is **brand**, not product.

## Theme is locked to light

The scene that decided it: *a workshop owner in Boksburg at 09:40 on a Tuesday,
checking a part number on a cracked Android in direct Highveld sun, with a
customer's car on the lift and 20 minutes to sort it.*

That forces light. There is no dark mode and adding one would be a regression.

## Type

**The one move that carries the brand: the display face is pushed wide, not
condensed.** Every competitor in automotive parts reaches for condensed (Barlow
Condensed, Oswald, Bebas). That is the category reflex. Archivo at `font-stretch:
112% to 125%` reads as container stencil and truck livery, and it is instantly
not-a-template.

- **Archivo** (variable, `wdth` axis loaded) for all display. 800 weight.
- **Public Sans** for body. A workhorse built for public documents, which suits
  copy read at a counter under time pressure.
- **Martian Mono** at 87.5% width for data only: part numbers, phone numbers,
  counts, spec fields, eyebrows. It never carries prose.

Scale is fluid `clamp()` at a 1.28 ratio. `--text-display` maxes at 6.5rem, which
fits two lines across the full container. Keep the hero H1 at two lines.

## Colour

Strategy is **Committed**, not Restrained. Navy carries structural weight across
whole full-bleed bands, not thin accents.

- **Navy** is authority. `slab` sections (`navy-900`) are reserved for genuine
  authority moments: the network, the group story, the partner process. Roughly a
  third of scroll height, no more.
- **Signal green** marks a guarantee or an action, nowhere else.
- Neutrals are tinted warm. Nothing is `#000` or `#fff`.

### The green contrast rule

`--color-signal` is bright and **never sits under text**. It is for rules, dots,
active marks and untinted graphics only. Anything with light text on it uses
`--color-signal-deep`, which clears 4.84:1 against paper. Getting this backwards
is the easiest way to break AA on this palette.

## Shape

**One radius: 4px. Everywhere.** Full-bleed elements are 0. No pills, no mixed
scales. The consistency is the point; it reads engineered.

## The signature move: the top rule

Emphasis comes from a **rule above** the content. `rule-top` (2px ink) and
`rule-top-signal` (2px green). It appears on stats, spec groups, list headings,
process steps and section headers.

Never a `border-left` or `border-right` colour stripe. That is banned.

## Elevation

Flat at rest. Cards sit on paper distinguished by their white surface and a 1px
hairline. Shadows are tinted navy and appear only on hover or for genuine
overlays.

## Motion

`MOTION_INTENSITY 4`, deliberately low. The audience is on a patchy connection and
needs an answer. Motion does exactly one job: signalling a section has arrived.

- `Reveal` component, transform and opacity only, `once: true`
- Hover lifts and 1.04 image scales on cards
- No parallax, no scroll hijack, no infinite loops, no marquees
- Everything collapses under `prefers-reduced-motion`
- Scroll state uses IntersectionObserver. `window.addEventListener('scroll')` is
  banned

## Layout

- `shell` caps at 82.5rem
- Vertical rhythm has three tiers: `band-tight`, `band`, `band-tall`. Vary them.
  Identical padding everywhere is monotony
- Rows over cards for dense data. The branch finder and catalogue are row lists,
  not card grids, because they are scanned under time pressure
- Grids have **exact cell counts**. The homepage catalogue bento is one 2x2
  feature plus twelve 1x1 tiles, which fills a four-column grid completely. Never
  leave a blank cell

## Eyebrow budget

Small uppercase mono labels above section headings are rationed to **one per three
sections**. The homepage has eight sections and uses two. Stamping one above every
heading is the single most recognisable AI-site tell.

## Do not

- Add a `border-left` colour stripe, or gradient text, or glassmorphism
- Use bright `--color-signal` behind text
- Put the bright green and a second accent on the same page. One accent, locked
- Build a centred hero-metric template
- Repeat identical icon-heading-text card rows
- Let navy bands outnumber paper sections
- Use condensed display type. That is the category reflex this system exists to
  avoid
- Add an em dash. Use a comma, colon, or full stop
- Invent a statistic. Every figure on this site traces to Parts-Mall Corporation's
  own published material
