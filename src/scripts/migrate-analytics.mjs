import { DatabaseSync } from 'node:sqlite'

// The CMS database lives on a named volume, so an image rebuild cannot add a
// table to an already-running installation by itself. This small, additive,
// idempotent migration runs before Next starts and deliberately never alters
// existing content, enquiries, or uploads.
const databaseUrl = process.env.DATABASE_URI ?? 'file:/app/data/partsmall.db'
const databasePath = databaseUrl.startsWith('file:') ? databaseUrl.slice(5) : databaseUrl
const db = new DatabaseSync(databasePath)

db.exec(`
  CREATE TABLE IF NOT EXISTS analytics_events (
    id integer PRIMARY KEY NOT NULL,
    type text NOT NULL,
    path text NOT NULL,
    session_id text,
    duration numeric,
    referrer text,
    whatsapp_topic text,
    branch_slug text,
    visitor_hash text,
    updated_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    created_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON analytics_events (type);
  CREATE INDEX IF NOT EXISTS analytics_events_path_idx ON analytics_events (path);
  CREATE INDEX IF NOT EXISTS analytics_events_session_id_idx ON analytics_events (session_id);
  CREATE INDEX IF NOT EXISTS analytics_events_visitor_hash_idx ON analytics_events (visitor_hash);
  CREATE INDEX IF NOT EXISTS analytics_events_updated_at_idx ON analytics_events (updated_at);
  CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON analytics_events (created_at);
`)

// SQLite does not support ADD COLUMN IF NOT EXISTS. Inspecting the existing
// table keeps this safe for installations created before WhatsApp reporting.
const columns = new Set(db.prepare('PRAGMA table_info(analytics_events)').all().map((column) => column.name))
if (!columns.has('whatsapp_topic')) db.exec('ALTER TABLE analytics_events ADD COLUMN whatsapp_topic text')
if (!columns.has('branch_slug')) db.exec('ALTER TABLE analytics_events ADD COLUMN branch_slug text')
db.exec(`
  CREATE INDEX IF NOT EXISTS analytics_events_whatsapp_topic_idx ON analytics_events (whatsapp_topic);
  CREATE INDEX IF NOT EXISTS analytics_events_branch_slug_idx ON analytics_events (branch_slug);
`)

// Payload stores all collections as possible targets for an admin document
// lock. Existing installations need this relation column added separately
// because SQLite cannot update that table definition automatically.
const lockedDocumentColumns = new Set(
  db.prepare('PRAGMA table_info(payload_locked_documents_rels)').all().map((column) => column.name),
)
if (!lockedDocumentColumns.has('analytics_events_id')) {
  db.exec('ALTER TABLE payload_locked_documents_rels ADD COLUMN analytics_events_id integer REFERENCES analytics_events(id) ON DELETE CASCADE')
}

db.close()
