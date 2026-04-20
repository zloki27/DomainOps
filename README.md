# DomainOps

Focused repository for the Domain Operations Discovery app.

## What belongs in git

- Application source: `app/`, `lib/`, `prisma/`, `public/`, `scripts/`
- Runtime and deployment config: `Dockerfile`, `docker-compose.yml`, `Caddyfile`, `package*.json`, Next/TS/ESLint/PostCSS config
- Product and delivery docs: `docs/handoffs/`, `docs/superpowers/specs/`, `docs/superpowers/plans/`

## What stays out of git

- Secrets and machine-local env files: `.env*` except `.env.example`
- Builder/runtime output: `.next/`, `node_modules/`, logs
- Ephemeral builder artifacts: `.claude/`, `design-system/`, `docs/reports/`

## Local pull / bootstrap

1. Copy `.env.example` to `.env`
2. Adjust `APP_URL`, `BASIC_AUTH_USER`, and `BASIC_AUTH_HASH` for your environment
3. Install dependencies with `npm install`
4. Start locally with `npm run dev`, or use `docker compose up -d`

## Production note

The live VPS deployment uses Caddy for Basic Auth and HTTPS termination in front of the Next.js app.
