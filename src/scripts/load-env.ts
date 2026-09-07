/**
 * Loads env before anything else.
 *
 * This lives in its own module because ES module imports are hoisted: calling
 * dotenv in the body of seed.ts would run after payload.config.ts had already
 * been evaluated and read process.env. Importing this file first guarantees
 * the ordering.
 */
import { config } from 'dotenv'

// Same precedence as Next: .env.local wins over .env.
config({ path: ['.env.local', '.env'] })
