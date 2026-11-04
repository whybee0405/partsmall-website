#!/usr/bin/env bash
# Payload -> CloudIA import for parts-mall.co.za (2026-11). Re-runnable: everything upserts.
#
#   cloudia/migration/run-import.sh <pristine payload snapshot.db> <cms container> [<shadow port>]
#
# Production Payload is only ever read through a consistent snapshot (see the cutover notes);
# this script never touches the live Payload container or its volumes. It:
#   1. starts a throwaway "shadow" Payload (the pre-cutover image) on a COPY of the snapshot, with
#      a temporary import login added to the copy and clashing model slugs renamed;
#   2. runs `cloudia-cms import:payload` inside the CMS container against the shadow;
#   3. runs post-import-fixups.ts against the pristine snapshot;
#   4. removes the shadow container, volume and temporary credentials.
set -euo pipefail

SNAPSHOT=${1:?pristine Payload snapshot (.db)}
CMS=${2:?CMS container name}
PORT=${3:-3051}
PAYLOAD_IMAGE=${PAYLOAD_IMAGE:-partsmall-africa-web:pre-cloudia-20261104}
HERE=$(cd "$(dirname "$0")" && pwd)
WORK=$(mktemp -d)
SHADOW=payload-shadow-import
VOLUME=payload-shadow-import-db
MEDIA_VOLUME=${MEDIA_VOLUME:-partsmall-africa_media}
trap 'docker rm -f $SHADOW >/dev/null 2>&1 || true; docker volume rm $VOLUME >/dev/null 2>&1 || true; rm -rf "$WORK"' EXIT

echo "== shadow Payload from $SNAPSHOT"
cp "$SNAPSHOT" "$WORK/shadow.db"
PASSWORD=$(node -e "console.log(require('crypto').randomBytes(18).toString('base64url'))")
node --experimental-sqlite --no-warnings - "$WORK/shadow.db" "$PASSWORD" <<'EOF'
const { DatabaseSync } = require('node:sqlite'); const crypto = require('crypto')
const [path, password] = process.argv.slice(2)
const db = new DatabaseSync(path)
db.prepare(`DELETE FROM users WHERE email = 'cloudia-import@localhost.invalid'`).run()
const salt = crypto.randomBytes(32).toString('hex')
const hash = crypto.pbkdf2Sync(password, salt, 25000, 512, 'sha256').toString('hex')
const now = new Date().toISOString()
db.prepare(`INSERT INTO users(name,role,email,hash,salt,login_attempts,updated_at,created_at) VALUES(?,?,?,?,?,0,?,?)`)
  .run('Import (temporary)', 'admin', 'cloudia-import@localhost.invalid', hash, salt, now, now)
EOF
node --experimental-sqlite --no-warnings "$HERE/pre-import-shadow.mjs" "$WORK/shadow.db"

docker volume create $VOLUME >/dev/null
docker run --rm -v "$WORK:/src:ro" -v $VOLUME:/d alpine sh -c 'cp /src/shadow.db /d/partsmall.db && chown -R 1001:1001 /d'
# Media is mounted read-only: Payload only reads it to serve files. The shadow joins the CMS
# container's network so the importer reaches it by name.
NETWORK=$(docker inspect -f '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}' "$CMS" | awk '{print $1}')
docker run -d --name $SHADOW --network "$NETWORK" -p 127.0.0.1:$PORT:3000 \
  -e NODE_ENV=production -e PAYLOAD_SECRET="$(openssl rand -hex 32)" \
  -e DATABASE_URI=file:/app/data/partsmall.db -e NEXT_PUBLIC_SITE_URL=https://parts-mall.co.za \
  -v $VOLUME:/app/data -v "$MEDIA_VOLUME":/app/public/media:ro "$PAYLOAD_IMAGE" >/dev/null
for _ in $(seq 1 60); do curl -fsS -o /dev/null "http://127.0.0.1:$PORT/robots.txt" && break; sleep 2; done
curl -fsS -o /dev/null "http://127.0.0.1:$PORT/api/branches?limit=1" || { echo "shadow Payload did not start"; docker logs $SHADOW | tail -20; exit 1; }

echo "== import into $CMS"
docker cp "$HERE/../payload-profile.json" "$CMS:/tmp/payload-profile.json"
docker cp "$HERE/../payload-schema.json" "$CMS:/tmp/payload-schema.json"
docker exec -e PAYLOAD_EMAIL=cloudia-import@localhost.invalid -e PAYLOAD_PASSWORD="$PASSWORD" "$CMS" \
  cloudia-cms import:payload --profile /tmp/payload-profile.json --source "http://$SHADOW:3000" \
  --report /tmp/import-report.json
if [ -n "${REPORT:-}" ]; then docker cp "$CMS:/tmp/import-report.json" "$REPORT"; fi

echo "== fix-ups"
docker cp "$SNAPSHOT" "$CMS:/tmp/payload-snapshot.db"
docker exec "$CMS" node --import tsx /app/site-config/migration/post-import-fixups.ts /app/data/cloudia.db /tmp/payload-snapshot.db
docker exec "$CMS" rm -f /tmp/payload-snapshot.db /tmp/payload-profile.json /tmp/payload-schema.json
echo "== done"
