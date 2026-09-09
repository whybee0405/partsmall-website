# syntax=docker/dockerfile:1.7
#
# Parts-Mall Africa.
#
# Debian slim rather than Alpine on purpose: sharp and the libsql client used
# by @payloadcms/db-sqlite both ship native bindings, and glibc avoids the musl
# rebuild dance entirely.
#
# The database is seeded during the build and baked in at /app/data. Compose
# mounts a named volume there, so the first container start copies the seeded
# database into the volume and every later start persists whatever the client
# has edited since.

######################## dependencies ########################
FROM node:22-bookworm-slim AS deps
WORKDIR /app

# Toolchain for any package that needs to compile a native binding.
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci


########################## builder ###########################
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# Build-time only. The runtime secret comes from the environment and is what
# actually signs sessions; this one just lets the seed run.
ARG PAYLOAD_SECRET=build-stage-secret-not-used-at-runtime
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3050

ENV PAYLOAD_SECRET=$PAYLOAD_SECRET \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    DATABASE_URI=file:/app/data/partsmall.db \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Order matters. The import map is needed by the admin routes, the database
# must exist and be seeded before the build imports the Payload config, and
# only then is it safe to build.
RUN mkdir -p /app/data \
 && npx payload generate:importmap \
 && npm run seed \
 && npm run build


########################### runner ###########################
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/* \
 && groupadd --gid 1001 nodejs \
 && useradd --uid 1001 --gid nodejs --create-home nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/data ./data
COPY --from=builder --chown=nextjs:nodejs /app/src/scripts/migrate-analytics.mjs ./migrate-analytics.mjs

# Uploads land here. Compose mounts a volume over it.
RUN mkdir -p /app/public/media && chown -R nextjs:nodejs /app/public/media /app/data

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/robots.txt || exit 1

CMD ["sh", "-c", "node --experimental-sqlite migrate-analytics.mjs && node server.js"]
