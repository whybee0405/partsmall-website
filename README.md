# Parts-Mall Africa

The branch network, trade catalogue and wholesale site for Parts-Mall Africa, the
South African sales and distribution hub for Parts-Mall Corporation.

Custom build. Next.js 15 App Router, CloudIA CMS, Tailwind v4. Replaces the
discontinued WooCommerce theme. Content moved from Payload CMS 3 to CloudIA CMS
on 2026-11-04 (see `cloudia/README.md`).

---

## Running it with Docker

```bash
cp .env.docker.example .env               # site settings
cp cloudia/cms.env.example cloudia/cms.env  # CMS settings: PUBLIC_URL, FORM_SALT, SMTP
docker compose up -d --build
```

- Site: http://localhost:3050
- CMS dashboard: https://parts-mall.co.za/admin (nginx sends `/admin` and `/api/*`
  to the CMS container on 127.0.0.1:8787)

Two containers: `web` (this Next.js site) and `cms` (CloudIA CMS, which holds the
content, media, enquiries and analytics). The site reads everything from the CMS
at request time over the Compose network, so the site image holds no data.

### How it avoids clashing with the other projects on this machine

This host also runs the separate `partsmall-zic-website` project. Everything here
is namespaced `partsmall-africa` so nothing overlaps:

| Resource | Name |
|---|---|
| Compose project | `partsmall-africa` |
| Containers | `partsmall-africa-web`, `partsmall-africa-cms` |
| Images | `partsmall-africa-web:local`, `cloudia-cms:<version>` |
| Network | `partsmall-africa_default` |
| Volumes | `partsmall-africa_cms_data` (CMS database and uploads) |

Ports 3050 (site) and 8787 (CMS) bind to `127.0.0.1` only; nginx is the public edge.
Change them with `HOST_PORT` and `CMS_HOST_PORT` in `.env`.

### Docker notes

- **The CMS owns the data.** `partsmall-africa_cms_data` holds its SQLite database
  and uploads. It makes a backup archive daily and before every upgrade into
  `CMS_BACKUP_DIR` (outside `/var/www/html`, which the default nginx server
  publishes); take one any time with `docker compose exec cms cloudia-cms backup`.
- **Models live in `cloudia/cloudia.config.ts`.** Edit it, then
  `docker compose restart cms`; the CMS refuses to start if the change would not
  fit existing entries, and says why.
- **`NEXT_PUBLIC_SITE_URL` is baked at build time.** Change it and rebuild.
- Base image is Debian slim rather than Alpine: `sharp` ships native bindings and
  glibc avoids the musl rebuild problem.
- The site image runs as a non-root user, has a healthcheck on `/robots.txt`, and
  caps its own logs at 3 x 10MB.

### Useful commands

```bash
./scripts/deploy-cms.sh                               # pull and (re)start the CMS at the right version
export CLOUDIA_CMS_VERSION=$(./scripts/deploy-cms.sh version)   # needed before any other compose command
docker compose logs -f web cms                        # follow logs
docker compose up -d --build web                      # rebuild the site after a code change
docker compose exec cms cloudia-cms backup            # CMS backup now
sudo cloudia-updater check --instance partsmall       # look for CloudIA updates now
```

CloudIA updates install from the dashboard (System → Updates) through the host
helper `cloudia-updater` (instance `partsmall`). The CMS image comes from
`ghcr.io/whybee0405/cloudia-cms`; the server needs a `docker login ghcr.io` with a
`read:packages` token, for root (the helper) and for the deploying user.

---

## Running it without Docker

```bash
docker compose up -d cms        # or point CLOUDIA_URL at another CloudIA install
cp .env.example .env.local      # CLOUDIA_URL=http://127.0.0.1:8787
npm install
npm run dev
```

- Site: http://localhost:3000

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |

---

## How the content works

There are two layers, on purpose.

**`src/lib/data/`** holds the canonical branch directory, catalogue and corporate
figures as typed TypeScript. The site renders entirely from these files, so it
builds and deploys even with an empty database.

**CloudIA CMS** owns the live records and is where the client edits day to day
(`/admin`): uploading photography, editing blog posts, adding a branch. The site
reads it through `src/lib/cms/*` with CloudIA's client (`@cloudia-cms/client`,
vendored in `vendor/`), using CloudIA's Payload-compatible query API (`find` with
`where`, `sort`, `depth`).

Counts are always derived, never typed by hand:

```ts
NETWORK.southAfrica  // 33
NETWORK.provinces    // 9
NETWORK.total        // 38
```

Add a branch to `BRANCHES` (or the CMS) and every count, the map, the finder, the
directory, the sitemap and the footer update together. Nothing to keep in sync.

### CMS models

| Model | Notes |
|---|---|
| **Branches** | Adding a record creates its page, adds it to the finder and plots it on the map |
| **Categories** | The 13 parts systems. Publishes `/parts/[slug]` |
| **Part Types** | The 50 individual parts. Publishes `/parts/[category]/[slug]` and feeds every vehicle page |
| **Makes** | Vehicle makes. Publishes `/vehicles/[slug]` |
| **Models** | Vehicle models. Publishes `/vehicles/[make]/[slug]` plus one page per linked part type. Slugs are unique across all models: when two makes share a model slug, give one a unique slug and set its **URL segment** |
| **Brands** | The 9 private lines plus OEM |
| **Blog Posts** (`guides`) | Drafts enabled. Trade guides and fitment notes; views per post under Analytics → Content |
| **Enquiries** | Private form: every submission, so no lead depends on a mail rule surviving. Never readable through the API |
| **Media** | Uploads. Payload-era files keep their URLs (`/api/media/file/<name>`) |
| **Site Settings** | Head office details, socials, group figures |

**Analytics** are CloudIA's own (Analytics in the dashboard): cookieless page views,
sessions, sources and campaigns, time on page, scroll depth, Web Vitals, 404s,
WhatsApp/phone/email clicks, `whatsapp_click` by topic and branch, and enquiries
by source. History from the Payload era (September 2026 on) was imported.

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

Runs on this VPS with Docker Compose behind nginx (`nginx/parts-mall.co.za`):
`/admin` and `/api/*` go to the CMS on 127.0.0.1:8787, except the site's own
`/api/enquiry` and `/api/chat`; everything else goes to the site on 127.0.0.1:3050.

**Site env (`.env`):** `NEXT_PUBLIC_SITE_URL`, `CLOUDIA_ANALYTICS_SHARE_TOKEN`
(read-only analytics share link for blog view counts), the email settings below,
`CMS_BACKUP_DIR`. **CMS env (`cloudia/cms.env`):** see `cloudia/cms.env.example`.

**Email.** Enquiry notifications go through Resend's API when `RESEND_API_KEY` is set.
Set `EMAIL_FROM_ADDRESS` to an address on a verified Resend domain (default
`noreply@parts-mall.co.za`), and optionally `EMAIL_FROM_NAME` (default
`Parts-Mall Africa`). Set `ENQUIRY_TO_EMAIL` to receive notifications from general
enquiry forms and as a fallback for branches without an email address. Branch forms
send to the active branch's current email address in the CMS, resolved server-side
from the submitted branch slug. Enquiries are saved in the CMS before sending; a
delivery failure is logged and does not discard the submission.

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
