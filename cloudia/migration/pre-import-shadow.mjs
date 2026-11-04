/**
 * Run on the SHADOW copy of the Payload database (never production) before import:payload.
 *
 *   node --experimental-sqlite migration/pre-import-shadow.mjs <shadow partsmall.db>
 *
 * Model slugs in Payload are only unique within a make (Hyundai H-1 and Haval H1 are both "h1"),
 * while CloudIA slugs are unique per model; importing both would make the second overwrite the
 * first. For every clashing slug the oldest model keeps it and the others become
 * "<make>-<slug>". post-import-fixups.ts then stores the original slug in `urlSlug`, so the page
 * address does not change. Idempotent.
 */
import { DatabaseSync } from 'node:sqlite'

const path = process.argv[2]
if (!path) {
  console.error('Usage: pre-import-shadow.mjs <shadow partsmall.db>')
  process.exit(1)
}
const db = new DatabaseSync(path)
const clashes = db
  .prepare(
    `SELECT m.id, m.slug, mk.slug AS make FROM models m JOIN makes mk ON mk.id = m.make_id
     WHERE m.slug IN (SELECT slug FROM models GROUP BY slug HAVING count(*) > 1)
     ORDER BY m.slug, m.id`,
  )
  .all()
const seen = new Set()
for (const model of clashes) {
  if (!seen.has(model.slug)) {
    seen.add(model.slug)
    continue
  }
  const unique = `${model.make}-${model.slug}`
  db.prepare('UPDATE models SET slug = ? WHERE id = ?').run(unique, model.id)
  console.log(`model ${model.id}: ${model.slug} -> ${unique}`)
}
console.log(`clashing model slugs: ${seen.size}`)
