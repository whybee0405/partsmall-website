# CloudIA CMS for parts-mall.co.za

This folder is the site's CMS configuration. It is mounted read-only into the `cms`
container at `/app/site-config`.

| File | Purpose |
|---|---|
| `cloudia.config.ts` | Models, the private `enquiries` form, dashboard look. The source of truth: edit, then `docker compose restart cms`. |
| `payload-shape.json` | Field tree the Payload-compatible API (`/api/*`) uses to return documents in the shapes the site reads. Add a field here too when the site should receive it. |
| `cms-version` | CloudIA version the site is built and tested against. |
| `cms.env.example` | Every variable the CMS reads. Copy to `cms.env` (git-ignored, mode 600). |
| `payload-profile.json`, `payload-schema.json`, `migration/` | The Payload → CloudIA migration, kept for the record and for a re-run. |

## How the site uses it

- Pages read content server-side through `src/lib/cms/*` (`createCloudia` from
  `@cloudia-cms/client`, Payload-style `find`) at `http://cms:8787`.
- Browsers load media from `/api/media/file/<name>` and post analytics to
  `/api/analytics-events`; nginx sends both to the CMS.
- `/api/enquiry` (the site) validates, picks the branch recipient, stores the
  submission in the `enquiries` form and sends the Resend email.
- Blog view counts come from a read-only analytics share link
  (`CLOUDIA_ANALYTICS_SHARE_TOKEN`).

## Migration from Payload (2026-11-04)

Payload's data was copied in with CloudIA's `import:payload`, driven by
`migration/run-import.sh`, which only ever reads a consistent snapshot of the Payload
database through a throwaway "shadow" Payload container:

1. `pre-import-shadow.mjs` renames model slugs that two makes share (Haval H1 and
   Hyundai H-1 are both `h1`) in the shadow copy, since CloudIA slugs are unique per
   model;
2. `import:payload` copies models, entries, media (originals, sizes, WebP siblings),
   enquiries and the full analytics history;
3. `post-import-fixups.ts` restores the WhatsApp topic and branch of every historical
   `whatsapp_click` into event metadata, drops an orphaned draft of a post deleted in
   September, and stores the original address segment of renamed models in `urlSlug`.

Payload's database and uploads (`partsmall-africa_db`, `partsmall-africa_media`)
and image (`partsmall-africa-web:pre-cloudia-20261104`) are kept for rollback.
