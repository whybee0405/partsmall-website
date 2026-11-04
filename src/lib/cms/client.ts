import { cache } from 'react'
import { createCloudia } from '@cloudia-cms/client'

/**
 * Base URL of the CloudIA CMS install as this server reaches it: `http://cms:8787` on the Compose
 * network. Browsers reach the same install through the site's own `/api` and `/admin`.
 */
export const CLOUDIA_URL = (process.env.CLOUDIA_URL || 'http://cms:8787').replace(/\/$/, '')

/**
 * One client per request. React's cache() is request-scoped, so nothing is shared across
 * requests; `no-store` keeps every render reading current content, as the in-process Payload
 * reads did (every page is force-dynamic).
 *
 * `find` takes Payload's arguments and returns Payload's envelopes and document shapes, so the
 * readers in this folder are unchanged apart from where the client comes from.
 */
export const getCmsClient = cache(() =>
  createCloudia({ url: CLOUDIA_URL, requestInit: { cache: 'no-store' } }),
)
