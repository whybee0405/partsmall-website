#!/usr/bin/env bash
# Roll parts-mall.co.za back to the Payload build that ran until 2026-11-04.
#
#   sudo install -m 644 /home/jamie/backups/payload-to-cloudia-20261104-pre/nginx-parts-mall.co.za.pre-cloudia \
#     /etc/nginx/sites-available/parts-mall.co.za && sudo nginx -t && sudo systemctl reload nginx
#   cloudia/migration/rollback-to-payload.sh
#
# Starts the pre-cutover image on its own, untouched volumes (partsmall-africa_db and
# partsmall-africa_media). CloudIA keeps running on 127.0.0.1:8787 with everything it received
# after the cutover (enquiries, analytics), so nothing recorded since is lost: export those
# enquiries from /admin before switching back if they must reach Payload.
set -euo pipefail
cd "$(dirname "$0")/../.."
COMPOSE=$(mktemp --suffix=.yml)
trap 'rm -f "$COMPOSE"' EXIT
git show f0b877d:docker-compose.yml > "$COMPOSE"
docker tag partsmall-africa-web:pre-cloudia-20261104 partsmall-africa-web:local
docker compose -p partsmall-africa -f "$COMPOSE" --project-directory . up -d --no-build web
docker ps --filter name=partsmall-africa-web --format '{{.Names}} {{.Image}} {{.Status}}'
