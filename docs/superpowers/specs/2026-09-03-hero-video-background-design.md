# Hero video background — design

Status: approved by user, 2026-09-03. First of a section-by-section pass over the homepage.

## Goal

Replace the static hero photo (`/images/hero-counter.webp`) with a short, looping,
full-bleed background video that shows the scale and origin of Parts-Mall's supply
chain — direct import from Korea, at global scale — without undercutting the hero's
existing promise: **"Parts on the shelf, not on a ship."** The video tells the story
of how parts get to the shelf; it does not linger on transit.

## Layout treatment

**Full-bleed background** (chosen over a contained video in the existing two-column
photo slot). The video fills the entire hero section edge to edge. This is a
deliberate departure from the current light-locked hero — the closest existing
precedent is the navy "network" slab (`#network` section, `page.tsx:252`), which
already proves out on-navy text tokens and a dark CTA pairing on this site.

- Section drops the current two-column grid (`shell` + `lg:grid-cols-[...]`) for a
  single full-bleed block. `<h1>`, lead paragraph and both CTAs are layered on top
  of the video with a dark navy scrim (linear/radial gradient using `--color-navy-900`
  toward transparent, tuned for text contrast rather than a flat overlay).
- Text tokens switch to the existing on-navy set: `text-on-navy` for the heading,
  `text-on-navy-muted` for the lead paragraph — same tokens already used in the
  network section, so no new color is introduced.
- CTA pairing changes from `signal` + `outline` to `signal` + `invert`. `outline`
  assumes an `ink`-on-`paper` background and loses contrast on navy; `invert`
  (paper bg, navy-900 text) is the variant the codebase already documents as "for
  use on slabs" (`Button.tsx:9`).
- The trust-strip section directly below (branch/province/pan-African counts)
  is unchanged.
- The static hero photo is **not deleted** — `/images/hero-counter.webp` stays,
  since it's reused as an illustration on the `/guides/what-your-branch-needs-to-find-a-part`
  page (`company.ts:208`).

## Narrative — 3-beat, 6-second loop

Consolidated from an original 5-beat cut for pacing at 6 seconds (~2s per beat).
Each beat is a slow pan/zoom (Ken Burns) on a still rather than complex motion —
cheaper to generate, compresses smaller, and holds up better at speed.

1. **Global network** — Korea (Seoul/Goyang) as the visible origin node, route
   lines arcing out globally with the brightest route landing on South Africa.
   Establishes "direct from Korea," not just "regional operation."
2. **Transit / scale** — container port, ship loading, cranes. Communicates
   volume and reach. Kept deliberately brief — this is the one beat that risks
   echoing "on a ship," so it does not resolve the sequence.
3. **Arrival → shelf** — African branch warehouse racking, forklift movement,
   resolving toward a trade-counter handoff. Closes the loop on "already here."

All three graded to the site's navy/signal palette (`--color-navy-900` through
`--color-navy-700`, `--color-signal` accents) rather than realistic documentary
color, so it reads as one brand film rather than stock footage.

**Fallback if 6s reads as rushed:** revisit as a 5-beat fast-cut (~1.2s/beat,
~6s total) — noted as Option B during brainstorming, not built unless pacing
review calls for it.

## Asset pipeline

1. Storyboard stills generated cheaply first for concept approval — done, via
   Higgsfield `z_image` model (~0.15 credits/image), 16:9, matching the three
   beats above. **Approved.**
2. Animate the approved stills into three short video clips (image-to-video),
   each ~2s, same navy/signal grading.
3. Concatenate/cross-fade into a single 6-second seamless loop.
4. Export:
   - `public/videos/hero-loop.mp4` (H.264 baseline, muted, no audio track)
   - `public/videos/hero-loop.webm` (VP9/AV1, smaller, modern-browser source)
   - `public/images/hero-poster.webp` (first frame, shown before video loads
     and as the entire mobile/reduced-motion experience)
   - Target: **under ~2–3MB** for the full loop, source scaled to ~1280px wide
     (it sits behind a scrim and text, so it does not need to be crisp).

This is the CMS's `media` collection (`Media.ts`) restricts uploads to
`image/*` — video stays a static file in `public/videos/`, same pattern as
the current hero photo, not a Payload-managed asset. Out of scope for this
change: extending the Media collection to accept video.

## Performance & loading strategy

- `<h1>` stays real DOM text — it is the LCP element and is unaffected by
  video load time.
- `<video>` is `muted loop playsinline autoplay preload="none"`, with the
  `hero-poster.webp` frame as its `poster` — no blank flash before it starts.
  Source assignment is deferred until after initial page load so the video
  never competes with critical-path resources.
- **No video at all on mobile** (viewport/`matchMedia` gate) — poster image
  only. This is also the `prefers-reduced-motion: reduce` behavior.
- `aria-hidden="true"` on the video; it is decorative, the real content is
  the heading, lead paragraph and CTAs.

## Open items carried into the implementation plan

- Exact scrim gradient values and contrast-check the on-navy text against the
  brightest video frame (worst case, not average).
- Whether the 3 approved beats need any regrading once animated (stills vs.
  motion can shift perceived contrast).
- Confirm 6s loop pacing once assembled; fall back to the 5-beat cut if it
  reads as rushed.
