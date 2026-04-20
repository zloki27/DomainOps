# Stack And Environment

## Target Machine
- Host: `ubuntu@5.249.252.12`
- OS: Ubuntu 24.04
- Working directory: `/opt/DomainOps`
- Starting state: empty repo with no commits and no app files

## Mandatory Build Sequence
1. Install system prerequisites.
2. Install Node/npm.
3. Install Docker + Compose.
4. Install Caddy.
5. Install `ui-ux-pro-max-skill`.
6. Bootstrap the Next.js project in `/opt/DomainOps`.
7. Install npm dependencies.
8. Initialize Prisma and PostgreSQL wiring.
9. Prepare Docker Compose and Caddy config.
10. Verify the environment works before building product features.

## Recommended Application Stack
- Node.js 22 LTS
- npm
- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL 16
- Caddy 2
- Docker Engine + Docker Compose plugin

## System Packages
Install these first:
```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release software-properties-common python3 python3-pip git unzip
```

## Node.js And npm
Preferred path:
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

Fallback if NodeSource is unavailable:
- install Node 22 via `nvm`
- do not proceed with an old distro Node version just because it is convenient

## Docker Engine And Compose Plugin
Preferred path:
```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker ubuntu
```

Fallback path if the Docker repo is unavailable:
```bash
sudo apt install -y docker.io docker-compose-v2
```

## Caddy
Preferred path:
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/deb/debian.any-version.list' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
caddy version
```

Fallback path:
```bash
sudo apt install -y caddy
```

## UI Skill Bootstrap
The UI work must use the official `ui-ux-pro-max-skill`.

Recommended installation path:
```bash
npm install -g uipro-cli
uipro init --ai claude
```

Useful fallback if the GitHub download step fails:
```bash
uipro init --ai claude --offline
```

Prerequisite:
```bash
python3 --version
```

Required end state:
- the Claude environment in `/opt/DomainOps` can invoke `ui-ux-pro-max-skill`
- if this cannot be achieved, stop and report the blocker

## Project Bootstrap
Because the repo is effectively empty, bootstrap a fresh Next.js application directly in `/opt/DomainOps`.

Required characteristics:
- Next.js App Router
- TypeScript
- ESLint
- Tailwind CSS
- `src/` directory is acceptable but not mandatory

## Required npm Dependencies
Runtime:
- `next`
- `react`
- `react-dom`
- `@prisma/client`
- `zod`
- `react-hook-form`
- `@hookform/resolvers`
- `lucide-react`
- `clsx`
- `tailwind-merge`
- `class-variance-authority`
- `date-fns`

Dev/runtime tooling:
- `typescript`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `prisma`
- `eslint`
- `eslint-config-next`

Optional only if truly needed:
- a lightweight toast package
- a lightweight test library

Avoid:
- auth libraries
- ORM alternatives
- bulky component templates
- enterprise admin kits

## Database Environment
Prepare a `.env.example` and production `.env` shape that at minimum includes:
```env
DATABASE_URL=postgresql://domainops:change-me@postgres:5432/domainops?schema=public
NODE_ENV=production
APP_URL=http://5.249.252.12
```

Notes:
- if a real domain is attached later, change `APP_URL` to the final HTTPS domain
- do not assume TLS on a raw IP as the final state

## Expected Project Files After Environment Bootstrap
- Next.js app skeleton
- `package.json`
- `tsconfig.json`
- Tailwind config
- Prisma schema and first migration scaffold
- `.env.example`
- `docker-compose.yml`
- `Caddyfile`
- basic app shell that starts successfully

## Environment Completion Gate
The environment phase is complete only when these succeed:
- `node -v`
- `npm -v`
- `docker --version`
- `docker compose version`
- `caddy version`
- `npm install`
- `npx prisma validate`
- `npm run lint`
- `npm run build`
