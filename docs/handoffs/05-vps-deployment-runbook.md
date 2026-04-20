# VPS Deployment Runbook

## Deployment Model
Use a single Ubuntu 24.04 VPS with Docker Compose.

Services:
- `web` - Next.js application
- `postgres` - PostgreSQL database
- `caddy` - reverse proxy and Basic Auth entrypoint

There is no worker service.

## Public Exposure Rule
- expose only Caddy publicly
- do not publish the Next.js app directly on a host port
- keep Postgres internal to Docker

## Docker Compose Shape
Minimum services:

### `postgres`
- image: `postgres:16`
- named volume for data
- environment for db name, user, password
- healthcheck

### `web`
- built from the app Dockerfile
- depends on `postgres`
- receives `DATABASE_URL`
- no public ports

### `caddy`
- reverse proxies to `web:3000`
- enforces Basic Auth on all routes
- exposes `80:80` and, when a real domain is attached, `443:443`
- mounts `Caddyfile`

## Basic Auth
Use Caddy Basic Auth for the whole app.

Suggested secrets:
- `BASIC_AUTH_USER`
- `BASIC_AUTH_HASH`

Generate the password hash after Caddy is installed:
```bash
caddy hash-password --plaintext 'replace-this-password'
```

## Caddyfile Strategy
### Staging on bare IP
Use HTTP only if the app is still being validated internally and no domain is attached yet.

Example shape:
```caddy
:80 {
  basicauth /* {
    {$BASIC_AUTH_USER} {$BASIC_AUTH_HASH}
  }

  reverse_proxy web:3000
}
```

### Final delivery with domain
Once a domain or subdomain is available, switch to a named site so Caddy can provision HTTPS.

Example shape:
```caddy
domain-ops.example.com {
  basicauth /* {
    {$BASIC_AUTH_USER} {$BASIC_AUTH_HASH}
  }

  reverse_proxy web:3000
}
```

## Database Strategy
- one PostgreSQL database
- one `Brand` table
- one optional `BrandResponse` row per brand
- response reset is implemented by deleting the `BrandResponse` row for that brand

## Purge Strategy
Preferred path:
- purge from the hidden report UI

Fallback path via psql:
```sql
delete from "BrandResponse"
where "brandId" = (
  select id from "Brand" where slug = 'dogado'
);
```

## Bootstrap Order On VPS
1. install system packages
2. install Node/npm
3. install Docker and Compose
4. install Caddy
5. install `ui-ux-pro-max-skill`
6. bootstrap the Next.js app
7. configure `.env`
8. run Prisma migration and seed
9. build and start Compose
10. verify app, report, and purge flow

## Operational Verification Checklist
- landing page loads behind Basic Auth
- all 12 brands appear
- a draft can be created
- a draft survives refresh
- submit locks the form
- report overview shows derived status
- report detail shows readable content
- purge returns the brand to `Not started`

## Backup Guidance
This app is small, so database backup can stay simple.

Recommended command:
```bash
docker compose exec postgres pg_dump -U domainops domainops > /opt/DomainOps/backups/domainops-$(date +%F-%H%M%S).sql
```

## Restart Guidance
```bash
docker compose up -d --build
```

After OS-level package changes or group membership changes, re-open the shell session before continuing.
