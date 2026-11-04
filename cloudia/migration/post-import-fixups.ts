/**
 * One-off fix-ups after `cloudia-cms import:payload` for the Payload -> CloudIA move (2026-11).
 *
 *   docker compose exec cms node --import tsx /app/site-config/migration/post-import-fixups.ts \
 *     /app/data/cloudia.db /payload/partsmall.db
 *
 * Idempotent: safe to run after every (re-)import.
 *
 * 1. WhatsApp clicks: Payload stored the enquiry topic and destination branch in their own
 *    columns (whatsappTopic, branchSlug). The importer copies only the standard event fields, so
 *    they are written into the event's metadata as { topic, branch }, the same keys the website's
 *    tracker now sends. Without this the 275+ historical WhatsApp leads would lose both.
 * 2. Orphaned blog drafts: Payload's `draft=true` query returns version rows of posts deleted in
 *    September with `id: null`; the importer folds them into one entry with legacy id "null".
 *    Payload never showed them, so that entry is removed (they stay in the Payload backup).
 */
import Database from 'better-sqlite3'

const [cmsPath, payloadPath] = process.argv.slice(2)
if (!cmsPath || !payloadPath) {
  console.error('Usage: post-import-fixups.ts <cloudia.db> <payload partsmall.db>')
  process.exit(1)
}
const cms = new Database(cmsPath)
const payload = new Database(payloadPath, { readonly: true, fileMustExist: true })

const site = cms.prepare(`SELECT id, slug FROM sites WHERE slug = 'partsmall'`).get() as
  | { id: string; slug: string }
  | undefined
if (!site) throw new Error('Site partsmall not found in the CloudIA database')

// 1. WhatsApp topic and branch -> metadata
const clicks = payload
  .prepare(
    `SELECT id, whatsapp_topic AS topic, branch_slug AS branch FROM analytics_events
     WHERE whatsapp_topic IS NOT NULL OR (branch_slug IS NOT NULL AND branch_slug <> '')`,
  )
  .all() as { id: number; topic: string | null; branch: string | null }[]
const update = cms.prepare('UPDATE events SET metadata_json = ? WHERE id = ? AND site_id = ?')
let updated = 0
let missing = 0
cms.transaction(() => {
  for (const click of clicks) {
    const metadata: Record<string, string> = {}
    if (click.topic) metadata.topic = click.topic
    if (click.branch) metadata.branch = click.branch
    const changes = update.run(
      JSON.stringify(metadata),
      `payload-${site.slug}-${click.id}`,
      site.id,
    ).changes
    if (changes) updated += 1
    else missing += 1
  }
})()
console.log(
  `whatsapp metadata: ${clicks.length} in Payload, ${updated} events updated, ${missing} not found`,
)

// 2. Orphaned blog drafts
const orphans = cms
  .prepare(
    `SELECT e.id, e.slug FROM entries e JOIN collections c ON c.id = e.collection_id
     WHERE c.site_id = ? AND c.slug = 'guides' AND e.legacy_id = 'null' AND e.status = 'draft'`,
  )
  .all(site.id) as { id: string; slug: string }[]
cms.transaction(() => {
  for (const orphan of orphans) {
    cms.prepare('DELETE FROM revisions WHERE entry_id = ?').run(orphan.id)
    cms.prepare('DELETE FROM entries WHERE id = ?').run(orphan.id)
  }
})()
console.log(
  `orphaned blog drafts removed: ${orphans.length}${orphans.length ? ` (${orphans.map((o) => o.slug).join(', ')})` : ''}`,
)

// 3. Model URL segments: a model whose CloudIA slug differs from its Payload slug (renamed by
//    pre-import-shadow.mjs because another make uses the same slug) keeps its address in urlSlug.
const models = payload.prepare('SELECT id, slug FROM models').all() as { id: number; slug: string }[]
const modelEntry = cms.prepare(
  `SELECT e.id, e.slug FROM entries e JOIN collections c ON c.id = e.collection_id
   WHERE c.site_id = ? AND c.slug = 'models' AND e.legacy_id = ?`,
)
const setUrlSlug = cms.prepare(
  `UPDATE entries SET
     draft_json = json_set(draft_json, '$.urlSlug', ?),
     published_json = CASE WHEN published_json IS NULL THEN NULL
                           ELSE json_set(published_json, '$.urlSlug', ?) END
   WHERE id = ?`,
)
let renamed = 0
let modelsMissing = 0
cms.transaction(() => {
  for (const model of models) {
    const entry = modelEntry.get(site.id, String(model.id)) as { id: string; slug: string } | undefined
    if (!entry) {
      modelsMissing += 1
      console.error(`  ! model ${model.id} (${model.slug}) is not in CloudIA`)
      continue
    }
    if (entry.slug === model.slug) continue
    setUrlSlug.run(model.slug, model.slug, entry.id)
    renamed += 1
    console.log(`  model ${model.id}: CloudIA slug ${entry.slug}, URL segment ${model.slug}`)
  }
})()
console.log(`models: ${models.length} in Payload, ${renamed} with a URL segment, ${modelsMissing} missing`)

// 4. Contact clicks: the Overview's WhatsApp KPI and Contact clicks panel count the CloudIA
//    tracker's automatic `contact_click` events, which only exist from the cutover. Every
//    Payload-era WhatsApp click came from the floating WhatsApp picker (the only place the old
//    tracker recorded them), so each gets the contact_click the tracker now sends for the same
//    click: same session, visitor, page and time; channel whatsapp, placement floating, and its
//    topic and branch. Rebuilt on every run, so it follows the imported clicks.
const { backfillSessions } = await import('/app/server/analytics/backfill.ts')
const columns = (cms.prepare('PRAGMA table_info(events)').all() as { name: string }[])
  .map((column) => column.name)
  .filter((name) => !['id', 'type', 'metadata_json'].includes(name))
let contactCopies = 0
cms.transaction(() => {
  cms.prepare(`DELETE FROM events WHERE site_id = ? AND id LIKE 'payload-%-contact'`).run(site.id)
  contactCopies = cms
    .prepare(
      `INSERT INTO events (id, type, metadata_json, ${columns.join(', ')})
       SELECT id || '-contact', 'contact_click',
         json_object('channel', 'whatsapp', 'placement', 'floating',
           'topic', json_extract(metadata_json, '$.topic'),
           'branch', json_extract(metadata_json, '$.branch')),
         ${columns.join(', ')}
       FROM events WHERE site_id = ? AND type = 'whatsapp_click' AND id LIKE 'payload-%'`,
    )
    .run(site.id).changes
})()
const rebuilt = backfillSessions(cms, site.id)
console.log(`contact clicks: ${contactCopies} historical WhatsApp clicks; ${rebuilt.sessions} sessions rebuilt`)

if (missing || modelsMissing) process.exitCode = 1
