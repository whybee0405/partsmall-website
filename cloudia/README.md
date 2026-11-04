# CloudIA CMS for parts-mall.co.za

This folder is the site's CMS configuration. It is mounted read-only into the `cms`
container at `/app/site-config`.

| File | Purpose |
|---|---|
| `cloudia.config.ts` | Models, the private `enquiries` form, dashboard look. The source of truth: edit, then `docker compose restart cms`. |
| `payload-shape.json` | Field tree CloudIA's Payload-compatible API (`/api/*`) uses to return documents in the shapes the site reads. Required by `cloudia.config.ts`; add a field here too when the site should receive it. |
| `cms-version` | CloudIA version the site is built and tested against. |
| `cms.env.example` | Every variable the CMS reads. Copy to `cms.env` (git-ignored, mode 600). |

## How the site uses it

- Pages read content server-side through `src/lib/cms/*` (`createCloudia` from
  `@cloudia-cms/client`, Payload-style `find`) at `http://cms:8787`.
- Browsers load media from `/api/media/file/<name>` and post analytics to
  `/api/analytics-events`; nginx sends both to the CMS.
- `/api/enquiry` (the site) validates, picks the branch recipient, stores the
  submission in the `enquiries` form and sends the Resend email.
- Blog view counts come from a read-only analytics share link
  (`CLOUDIA_ANALYTICS_SHARE_TOKEN`).

## History

Until 2026-11-04 the site ran Payload CMS. Its content, media, enquiries and analytics history
were imported into CloudIA (the import tooling is in git history, commit 1c6cd3f and its
follow-ups), and Payload was removed from the server afterwards. The final Payload database and
media are archived outside the repository in /home/jamie/backups/payload-to-cloudia-20261104-final/.
