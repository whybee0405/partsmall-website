import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * One Payload instance per request. React's cache() is request-scoped — a
 * fresh cache is created for every render under force-dynamic, so this never
 * serves stale data across requests. It only stops the same collection
 * query firing twice when, say, both the root layout and a page need
 * branches in the same request.
 */
export const getPayloadClient = cache(async () => getPayload({ config }))
