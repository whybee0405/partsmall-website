# syntax=docker/dockerfile:1.7
#
# Parts-Mall Africa.
#
# Debian slim rather than Alpine on purpose: sharp ships native bindings and
# glibc avoids the musl rebuild dance entirely.
#
# Content, media, enquiries and analytics live in CloudIA CMS, which runs as
# its own container beside this one (the `cms` service in docker-compose.yml).
# This image is only the website: it holds no database and no uploads, and
# reads everything from the CMS at request time over the Compose network.

######################## dependencies ########################
FROM node:22-bookworm-slim AS deps
WORKDIR /app

# Toolchain for any package that needs to compile a native binding.
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
# The CloudIA client package is vendored (see vendor/README.md).
COPY vendor ./vendor
RUN npm ci


########################## builder ###########################
FROM node:22-bookworm-slim AS builder
WORKDIR /app

ARG NEXT_PUBLIC_SITE_URL=http://localhost:3050

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Every page is rendered per request (force-dynamic), so the build needs no
# CMS connection.
RUN npm run build


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

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/robots.txt || exit 1

CMD ["node", "server.js"]
