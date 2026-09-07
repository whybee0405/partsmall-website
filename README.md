# Parts-Mall Africa

The branch network, trade catalogue and wholesale site for Parts-Mall Africa, the
South African sales and distribution hub for Parts-Mall Corporation.

Custom build. Next.js 15 App Router, Payload CMS 3, Tailwind v4. Replaces the
discontinued WooCommerce theme.

---

## Running it with Docker

```bash
cp .env.docker.example .env    # then set PAYLOAD_SECRET
docker compose up -d --build
```

- Site: http://localhost:3050
- CMS: http://localhost:3050/admin

The image ships fully seeded. The database is built and populated during the
image build and baked in at `/app/data`, so the first container start copies it
into the named volume and the site is live with all 172 records immediately.
There is no seed step to run.

### How it avoids clashing with the other projects on this machine

This host already runs a separate `partsmall-zic-website` project, plus around
two dozen other containers. Everything here is namespaced `partsmall-africa` so
nothing overlaps:

| Resource | Name |
|---|---|
| Compose project | `partsmall-africa` |
| Container | `partsmall-africa-web` |
| Image | `partsmall-africa-web:local` |
| Network | `partsmall-africa_default` |
| Volumes | `partsmall-africa_db`, `partsmall-africa_media` |

**Port 3050**, chosen clear of everything currently published on this host
(1989, 3001, 3010, 3030, 5173, 5432, 5433, 5442, 5443, 5678, 6379, 6389, 8000,
8010, 8080, 8090, 8443, 8877, 9000, 9001). Change it with `HOST_PORT` in `.env`.

It binds to `127.0.0.1` so the site is not exposed on the local network. To test
on a phone over Wi-Fi, drop the `127.0.0.1:` prefix from the `ports` line in
`docker-compose.yml` and set `NEXT_PUBLIC_SITE_URL` to your machine's LAN address.

### Docker notes

- **The schema changed?** Run `docker compose down -v` before rebuilding, or the
  old volume will be kept and the new collections will be missing.
- **Volumes hold the state.** `partsmall-africa_db` is the SQLite database,
  `partsmall-africa_media` is CMS uploads. Both survive rebuilds and container
  recreates. To reset to a clean seeded state:
  `docker compose down -v && docker compose up -d --build`
- **The volume wins after first start.** Rebuilding the image reseeds the copy
  baked into the image, but an existing volume is not overwritten, which is what
  keeps client edits safe.
- **`NEXT_PUBLIC_SITE_URL` is baked at build time**, because the sitemap is
  prerendered. Change it and rebuild, do not just restart.
- Base image is Debian slim rather than Alpine: `sharp` and the libsql client
  both ship native bindings and glibc avoids the musl rebuild problem.
- Image is 505MB, runs as a non-root user, has a healthcheck on `/robots.txt`,
  and caps its own logs at 3 x 10MB.

### Useful commands

```bash
docker compose logs -f web        # follow logs
docker compose restart            # restart
docker compose down               # stop, keeping data
docker compose down -v            # stop and wipe the database and uploads
docker compose up -d --build      # rebuild after a code change
```

---

## Running it without Docker

```bash
cp .env.example .env.local     # then set PAYLOAD_SECRET to any long random string
npm install
npm run seed                   # loads 172 records: branches, catalogue, vehicles, guides
npm run dev
```

- Site: http://localhost:3000
- CMS: http://localhost:3000/admin (first visit creates the admin account)

`npm run seed` is safe to re-run. It matches on slug and updates rather than
duplicating, so it doubles as a way to push corrections from the data files.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build. Prerenders 621 pages |
| `npm start` | Serve the production build |
| `npm run seed` | Seed or re-sync the CMS from `src/lib/data` |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after a schema change |
| `npm run generate:importmap` | Regenerate the admin import map after adding custom CMS components |

Run `npm run generate:types` after any collection change. `src/payload-types.ts`
is committed on purpose: without it, local type-checking is looser than the
Docker build's and real type errors slip through.

---

## How the content works

There are two layers, on purpose.

**`src/lib/data/`** holds the canonical branch directory, catalogue and corporate
figures as typed TypeScript. The site renders entirely from these files, so it
builds and deploys even with an empty database. This is also what the seed script
reads.

**Payload CMS** owns the same records once seeded, and is where the client edits
day to day. Uploading photography, editing guides, adding a branch.

Counts are always derived, never typed by hand:

```ts
NETWORK.southAfrica  // 33
NETWORK.provinces    // 9
NETWORK.total        // 38
```

Add a branch to `BRANCHES` (or the CMS) and every count, the map, the finder, the
directory, the sitemap and the footer update together. Nothing to keep in sync.

### CMS collections

| Collection | Notes |
|---|---|
| **Branches** | Adding a record creates its page, adds it to the finder and plots it on the map |
| **Categories** | The 13 parts systems. Publishes `/parts/[slug]` |
| **Part Types** | The 50 individual parts. Publishes `/parts/[category]/[slug]` and feeds every vehicle page |
| **Makes** | Vehicle makes. Publishes `/vehicles/[slug]` |
| **Models** | Vehicle models. Publishes `/vehicles/[make]/[slug]` plus one page per linked part type |
| **Brands** | The 9 private lines plus OEM |
| **Guides** | Drafts enabled. Trade guides and fitment notes |
| **Enquiries** | Every form submission, so no lead depends on a mail rule surviving |
| **Media** | Uploads, auto-converted to WebP at four sizes |
| **Site Settings** | Head office details, socials, group figures |

---

## The SEO architecture

619 indexable pages built from two taxonomies that cross.

```
/parts                                  13 systems
/parts/[category]                       e.g. /parts/transmission-clutch
/parts/[category]/[type]                e.g. /parts/transmission-clutch/clutch-kits

/vehicles                               11 makes
/vehicles/[make]                        e.g. /vehicles/kia
/vehicles/[make]/[model]                e.g. /vehicles/kia/rio
/vehicles/[make]/[model]/[type]         e.g. /vehicles/kia/rio/clutch-kits
```

**The last tier is the point.** A query like *"kia rio 2011 clutch kit"* is a make,
a model, a year and a part type. A generic "clutch kits" page will never rank for
it, because its subject is not that combination. 444 intersection pages exist so
that each of those queries has a page whose entire subject is the answer.

**Year lives in the content, not the URL.** A `/2011/` tier would multiply these
pages fifteen-fold and produce near-identical text, which Google treats as a
doorway farm. Instead every model page carries a generation table, so the Rio
page contains "2005 to 2011", "2011 to 2017" and "2017 onward" as real content
the crawler matches against.

**Pages only exist where there is something to say.** The model's `parts` list
generates its intersection pages, so `/vehicles/kia/rio/bumpers` returns a 404
rather than an empty page. Adding a part type to a model in the CMS creates the
page; removing it takes it down.

### What makes each page non-thin

Each intersection page combines model-level data (years, engines, body) with
part-level content (function, failure symptoms, replacement interval, ordering
checks), plus two fields that exist nowhere else:

- **`note`** on the model, a general observation true of that vehicle whatever
  part you are buying.
- **`partNotes`** on the model, keyed by part type. This is the highest-value
  field on the site. "Confirm the calliper make, because the Rio shipped with
  more than one" belongs on the Rio brake pad page and would be actively
  confusing on the Rio clutch kit page, so the two are kept separate.

### AEO

Every page is built to be quotable by an assistant, not just crawlable:

- An **answer-first opening sentence** that stands alone out of context
- **FAQPage structured data** on category, part-type and intersection pages, with
  every question also visible on the page, which Google requires
- Symptoms and checks as **lists**, the format snippets lift
- **BreadcrumbList** everywhere, which matters at three and four levels deep
- **Product + Vehicle** schema on intersection pages, linked with
  `isAccessoryOrSparePartFor`, the correct vocabulary for "this part is for this
  vehicle"

### Making it fitment-accurate

Generation years and engine descriptions are broad and South-Africa oriented.
They exist so the pages are useful and indexable. **No page claims a specific
part number fits a specific vehicle**, because that mapping is TecDoc data and
Parts-Mall Corporation is a verified TecDoc supplier.

Load that data into Models and Part Types and these pages become fitment
accurate without any code change. Until then every page routes the buyer to a
branch to confirm, which is honest and is also what the business wants.

---

## Decisions worth knowing about

**No prices, no cart, no part-number search.** This is a wholesale and
distribution network, not a webshop. Every page routes to a branch stock check or
a trade enquiry, and there is deliberately no price field anywhere in the schema.
Publishing trade pricing would undercut the branch relationship.

The part-number catalogue was removed on purpose. Searching by part number only
serves people who already know exactly what they want, which is a small share of
visitors and almost none of the available search volume. Editorial pages that
explain what a component does and how it fails serve everyone else, and they are
what ranks.

**WhatsApp is a first-class action.** It sits next to Call on every branch row and
branch page, because in this market it is how the trade actually sends a photo of
the old part. Numbers are converted to E.164 automatically.

**Light theme only, no dark mode.** The usage scene decided this: a workshop owner
checking a part number on a cracked Android in direct Highveld sun. Dark mode
loses that fight. This is a deliberate choice, not an omission.

**The network map draws no country outline.** It plots all 38 real coordinates on
a corrected equirectangular projection. A hand-approximated South Africa would be
subtly wrong, and a wrong map on a distribution company's site is worse than no
map. The constellation reads correctly on its own. The branch list below it stays
authoritative and fully accessible.

**Brand marks are typographic.** No official Parts-Mall vectors were supplied, so
the site renders each brand as a type plate rather than inventing a logo. Upload a
real SVG to a Brand record's `mark` field to switch over. Same for the wordmark in
`src/components/ui/Wordmark.tsx`.

---

## Imagery

All photography is in `public/images`, WebP, 3.2 MB for the whole site.

### Replace these with a real shoot

These were generated to land the design. They are accurate to the brief and safe
to launch with, but they are not Parts-Mall premises or staff. Shot notes are the
`alt` text on each, which describes exactly what to capture.

| File | Shot brief |
|---|---|
| `hero-counter.webp` | **Priority.** Counter salesman handing a boxed part across the trade counter to a mechanic. Real branch, natural light, unstaged |
| `branch-exterior.webp` | A branch storefront, roller door open, early morning |
| `head-office.webp` | Meadowdale head office exterior, late afternoon, straight verticals |
| `warehouse-aisle.webp` | Racking aisle receding to a vanishing point, picker mid-aisle |
| `partner-portrait.webp` | A real trade customer in their own bay. Get a release signed |
| `logistics-container.webp` | Container being unloaded at the dock |
| `guide-brakes.webp` | Close-up, gloved hands seating a pad into a caliper |
| `ph-branch-interior.webp` | Sales floor, counter and shelving |
| `ph-delivery-van.webp` | Van loading at the roller door |
| `ph-fleet-yard.webp` | Fleet vehicles lined up, for the fleet-buyer section |

The 32 files in `public/images/parts/` are the existing product photography,
carried over and optimised from 177 MB to 0.97 MB.

---

## Deployment

Works on Vercel, Railway, Fly or any Node host.

**Switch SQLite to Postgres before going live.** SQLite is the default so the
project runs with no external service. For production:

```bash
npm install @payloadcms/db-postgres
```

Then in `src/payload.config.ts` swap `sqliteAdapter` for `postgresAdapter` and
point `DATABASE_URI` at your instance. Nothing else changes.

**Set these env vars:** `PAYLOAD_SECRET`, `DATABASE_URI`, `NEXT_PUBLIC_SITE_URL`.

**Uploads.** Media writes to `public/media`, which does not survive on ephemeral
filesystems like Vercel. Add `@payloadcms/storage-s3` (or Vercel Blob) before
launch if the client will be uploading branch photography.

**Email.** Payload currently logs email to the console. Add an email adapter when
you want enquiry notifications delivered. Submissions are already stored in the
Enquiries collection regardless, so nothing is lost in the meantime.

---

## Two things to confirm with the client

1. **Brits is filed under Limpopo** in the source records. Brits is in North West.
   Preserved as-is rather than silently corrected, because it is business data.
   `src/lib/data/branches.ts`
2. **Branch trading hours are a single default** (`Mon to Fri 08:00 to 17:00, Sat
   08:00 to 13:00`) applied to all 38 points. The field is per-branch in the CMS,
   so real hours can be entered wherever they differ.

---

## Accessibility and performance

WCAG 2.1 AA. Verified rather than assumed:

- No horizontal scroll at 360, 390, 768 or 1440px
- Header is one line and 76px at desktop
- Every colour pair checked. Green CTA is `signal-deep` at 4.84:1, never the
  bright green, which is used only for rules, dots and untinted marks
- Availability states carry a word as well as a colour
- Focus is a green outer ring at 2px offset, so nothing shifts on focus
- Mobile menu traps focus, closes on Escape and restores focus to its trigger
- All motion collapses under `prefers-reduced-motion`
- Scroll position is tracked with IntersectionObserver, never a scroll listener
- 101 kB shared JS, 621 pages prerendered
- No horizontal scroll on the deep taxonomy pages at 360, 768 or 1440px
