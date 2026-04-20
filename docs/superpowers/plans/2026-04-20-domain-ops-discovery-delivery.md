# DomainOps Discovery Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Get the DomainOps handoff package and assets onto the VPS, bootstrap the full runtime in `/opt/DomainOps`, and have Claude build and verify the Domain Operations Discovery app end-to-end.

**Architecture:** Delivery happens in two Claude rounds. Round 1 installs the Ubuntu prerequisites, Docker/Caddy/Node toolchain, `ui-ux-pro-max-skill`, and a clean Next.js + Prisma scaffold. Round 2 builds the questionnaire app on top of that scaffold, seeds 12 brands, implements autosave and submit locking, and adds the hidden report routes plus purge.

**Tech Stack:** SSH, rsync, Ubuntu 24.04, Node.js 22 LTS, npm, Next.js App Router, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL 16, Docker Compose, Caddy, `ui-ux-pro-max-skill`.

---

## File Structure Map

### Local planner-owned source files
- `/Users/zorannogulic/DomainOps/docs/handoffs/00-handoff-index.md` - read order and operating rules.
- `/Users/zorannogulic/DomainOps/docs/handoffs/01-product-spec.md` - product scope and route behavior.
- `/Users/zorannogulic/DomainOps/docs/handoffs/02-content-and-form-schema.md` - workbook-derived form schema and copy.
- `/Users/zorannogulic/DomainOps/docs/handoffs/03-ui-build-brief-for-claude.md` - UI direction and skill requirements.
- `/Users/zorannogulic/DomainOps/docs/handoffs/04-stack-and-environment.md` - bootstrap stack and dependency truth.
- `/Users/zorannogulic/DomainOps/docs/handoffs/05-vps-deployment-runbook.md` - runtime and deployment rules.
- `/Users/zorannogulic/DomainOps/docs/handoffs/06-claude-prompt-01-environment-bootstrap.md` - prompt for the environment round.
- `/Users/zorannogulic/DomainOps/docs/handoffs/07-claude-prompt-02-app-build.md` - prompt for the product round.
- `/Users/zorannogulic/DomainOps/public/brand/*` - local logo assets to ship with the app.

### Remote target files that must exist before prompting Claude
- `/opt/DomainOps/docs/handoffs/*`
- `/opt/DomainOps/public/brand/*`

### Remote files expected after Prompt 01
- `/opt/DomainOps/package.json`
- `/opt/DomainOps/tsconfig.json`
- `/opt/DomainOps/.env.example`
- `/opt/DomainOps/Dockerfile`
- `/opt/DomainOps/docker-compose.yml`
- `/opt/DomainOps/Caddyfile`
- `/opt/DomainOps/prisma/schema.prisma`
- `/opt/DomainOps/src/app/layout.tsx`
- `/opt/DomainOps/src/app/page.tsx`

### Remote files expected after Prompt 02
- `/opt/DomainOps/prisma/schema.prisma`
- `/opt/DomainOps/prisma/seed.ts`
- `/opt/DomainOps/src/lib/db.ts`
- `/opt/DomainOps/src/lib/brands.ts`
- `/opt/DomainOps/src/lib/questionnaire-schema.ts`
- `/opt/DomainOps/src/lib/brand-responses.ts`
- `/opt/DomainOps/src/app/page.tsx`
- `/opt/DomainOps/src/app/brands/[brand]/page.tsx`
- `/opt/DomainOps/src/app/report/page.tsx`
- `/opt/DomainOps/src/app/report/[brand]/page.tsx`
- `/opt/DomainOps/src/components/brand-picker.tsx`
- `/opt/DomainOps/src/components/brand-header.tsx`
- `/opt/DomainOps/src/components/instructions-panel.tsx`
- `/opt/DomainOps/src/components/example-preview.tsx`
- `/opt/DomainOps/src/components/autosave-status.tsx`
- `/opt/DomainOps/src/components/repeatable-row-section.tsx`
- `/opt/DomainOps/src/components/fixed-question-section.tsx`
- `/opt/DomainOps/src/components/long-text-section.tsx`
- `/opt/DomainOps/src/components/submitted-state.tsx`
- `/opt/DomainOps/src/components/report-status-table.tsx`
- `/opt/DomainOps/src/components/report-detail-sections.tsx`
- `/opt/DomainOps/src/components/purge-brand-button.tsx`

### Git note
This plan intentionally omits commit steps because the builder is explicitly forbidden from using git in `/opt/DomainOps`.

### Task 1: Stage the handoff package and assets on the VPS

**Files:**
- Read: `/Users/zorannogulic/DomainOps/docs/handoffs/00-handoff-index.md`
- Read: `/Users/zorannogulic/DomainOps/docs/handoffs/06-claude-prompt-01-environment-bootstrap.md`
- Read: `/Users/zorannogulic/DomainOps/docs/handoffs/07-claude-prompt-02-app-build.md`
- Sync: `/Users/zorannogulic/DomainOps/docs/`
- Sync: `/Users/zorannogulic/DomainOps/public/brand/`
- Verify: `/opt/DomainOps/docs/handoffs/*`
- Verify: `/opt/DomainOps/public/brand/*`

- [ ] **Step 1: Verify the local handoff package is complete**

Run:
```bash
find /Users/zorannogulic/DomainOps/docs/handoffs -maxdepth 1 -type f | sort
```
Expected: exactly the eight handoff markdown files from `00-handoff-index.md` through `07-claude-prompt-02-app-build.md`.

- [ ] **Step 2: Verify the local brand assets are ready**

Run:
```bash
find /Users/zorannogulic/DomainOps/public/brand -maxdepth 1 -type f | sort
```
Expected: logo assets for `one-com`, `checkdomain`, `dogado`, `metanet`, `hostnet`, `zoner`, `uniweb`, `webglobe`, `easyname`, `antagonist`, and the Group.one marks. No `Herold` or `Alfahosting` logo files should appear.

- [ ] **Step 3: Sync the docs folder to the VPS**

Run:
```bash
rsync -avz /Users/zorannogulic/DomainOps/docs/ ubuntu@5.249.252.12:/opt/DomainOps/docs/
```
Expected: `rsync` reports transferred `handoffs/` and `superpowers/` content without errors.

- [ ] **Step 4: Sync the brand assets to the VPS**

Run:
```bash
rsync -avz /Users/zorannogulic/DomainOps/public/brand/ ubuntu@5.249.252.12:/opt/DomainOps/public/brand/
```
Expected: the remote `/opt/DomainOps/public/brand/` directory contains the same files as local.

- [ ] **Step 5: Verify the remote layout before opening Claude**

Run:
```bash
ssh ubuntu@5.249.252.12 'find /opt/DomainOps/docs/handoffs -maxdepth 1 -type f | sort && echo "---" && find /opt/DomainOps/public/brand -maxdepth 1 -type f | sort'
```
Expected: the first block lists all handoff files; the second block lists the brand assets and still does not include `Herold` or `Alfahosting` logo files.

### Task 2: Run Prompt 01 to bootstrap the environment

**Files:**
- Read: `/opt/DomainOps/docs/handoffs/04-stack-and-environment.md`
- Read: `/opt/DomainOps/docs/handoffs/05-vps-deployment-runbook.md`
- Read: `/opt/DomainOps/docs/handoffs/06-claude-prompt-01-environment-bootstrap.md`
- Verify: `/opt/DomainOps/package.json`
- Verify: `/opt/DomainOps/prisma/schema.prisma`
- Verify: `/opt/DomainOps/docker-compose.yml`
- Verify: `/opt/DomainOps/Caddyfile`

- [ ] **Step 1: Re-read the remote environment documents that Claude will follow**

Run:
```bash
ssh ubuntu@5.249.252.12 'sed -n "1,220p" /opt/DomainOps/docs/handoffs/04-stack-and-environment.md && printf "\n---\n" && sed -n "1,220p" /opt/DomainOps/docs/handoffs/05-vps-deployment-runbook.md && printf "\n---\n" && sed -n "1,220p" /opt/DomainOps/docs/handoffs/06-claude-prompt-01-environment-bootstrap.md'
```
Expected: the remote copies match the local plan package and still instruct Claude to build the environment before the app.

- [ ] **Step 2: Open the Claude builder session on the VPS in `/opt/DomainOps` and paste Prompt 01**

Action:
- Start the builder in `/opt/DomainOps` using your normal Claude-on-VPS entrypoint.
- Paste the full contents of `/opt/DomainOps/docs/handoffs/06-claude-prompt-01-environment-bootstrap.md`.
- Let Claude complete the environment round before doing anything else.

Expected: Claude reports installed system packages, Node/npm, Docker, Caddy, `ui-ux-pro-max-skill`, and the initial Next.js/Prisma scaffold.

- [ ] **Step 3: Run the environment completion gate exactly as documented**

Run:
```bash
ssh ubuntu@5.249.252.12 'cd /opt/DomainOps && node -v && npm -v && python3 --version && docker --version && docker compose version && caddy version && npm install && npx prisma validate && npm run lint && npm run build'
```
Expected: every command succeeds; `npm run lint` and `npm run build` exit cleanly.

- [ ] **Step 4: Verify the scaffold files exist after Prompt 01**

Run:
```bash
ssh ubuntu@5.249.252.12 'cd /opt/DomainOps && ls package.json tsconfig.json .env.example Dockerfile docker-compose.yml Caddyfile prisma/schema.prisma && find src/app -maxdepth 2 -type f | sort | sed -n "1,40p"'
```
Expected: the listed files exist and `src/app` contains at least `layout.tsx` and a starter `page.tsx`.

- [ ] **Step 5: Verify the UI skill is actually available on the VPS**

Run:
```bash
ssh ubuntu@5.249.252.12 'uipro --help >/dev/null && python3 --version && echo UI_SKILL_OK'
```
Expected: the command prints `UI_SKILL_OK`. If `uipro` is missing, stop and rerun Prompt 01 with the failure output.

### Task 3: Review the bootstrap output before app build

**Files:**
- Review: `/opt/DomainOps/package.json`
- Review: `/opt/DomainOps/prisma/schema.prisma`
- Review: `/opt/DomainOps/docker-compose.yml`
- Review: `/opt/DomainOps/Caddyfile`
- Review: `/opt/DomainOps/public/brand/*`

- [ ] **Step 1: Inspect `package.json` and confirm the expected dependencies and scripts are present**

Run:
```bash
ssh ubuntu@5.249.252.12 'cd /opt/DomainOps && cat package.json'
```
Expected: dependencies for `next`, `react`, `react-dom`, `@prisma/client`, `zod`, `react-hook-form`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, and `date-fns`, plus scripts for `dev`, `build`, and `lint`.

- [ ] **Step 2: Inspect the Prisma scaffold before product work starts**

Run:
```bash
ssh ubuntu@5.249.252.12 'sed -n "1,220p" /opt/DomainOps/prisma/schema.prisma'
```
Expected: the schema contains `generator client` and `datasource db` blocks and is ready for `Brand`/`BrandResponse` work.

- [ ] **Step 3: Inspect the Compose and Caddy scaffolding**

Run:
```bash
ssh ubuntu@5.249.252.12 'sed -n "1,220p" /opt/DomainOps/docker-compose.yml && printf "\n---\n" && sed -n "1,220p" /opt/DomainOps/Caddyfile'
```
Expected: Compose defines at least `web`, `postgres`, and `caddy`, and the Caddy file already reserves the Basic Auth + reverse proxy pattern.

- [ ] **Step 4: Verify the remote asset directory still matches the plan**

Run:
```bash
ssh ubuntu@5.249.252.12 'find /opt/DomainOps/public/brand -maxdepth 1 -type f | sort'
```
Expected: the same ten brand logos and shared Group.one marks are present; `Herold` and `Alfahosting` remain text-fallback brands.

- [ ] **Step 5: Stop here if the scaffold is missing any of the required files**

Action:
- If `package.json`, `prisma/schema.prisma`, `docker-compose.yml`, or `Caddyfile` is missing, feed Claude the exact missing-file failure and rerun Prompt 01.
- Do not move on to Prompt 02 until all four files exist and `npm run build` succeeds.

Expected: a clean scaffold that matches the handoff and is safe to build on.

### Task 4: Run Prompt 02 to build the application

**Files:**
- Read: `/opt/DomainOps/docs/handoffs/01-product-spec.md`
- Read: `/opt/DomainOps/docs/handoffs/02-content-and-form-schema.md`
- Read: `/opt/DomainOps/docs/handoffs/03-ui-build-brief-for-claude.md`
- Read: `/opt/DomainOps/docs/handoffs/07-claude-prompt-02-app-build.md`
- Verify: `/opt/DomainOps/prisma/schema.prisma`
- Verify: `/opt/DomainOps/prisma/seed.ts`
- Verify: `/opt/DomainOps/src/app/brands/[brand]/page.tsx`
- Verify: `/opt/DomainOps/src/app/report/page.tsx`
- Verify: `/opt/DomainOps/src/app/report/[brand]/page.tsx`

- [ ] **Step 1: Re-read the remote app specs and Prompt 02**

Run:
```bash
ssh ubuntu@5.249.252.12 'sed -n "1,260p" /opt/DomainOps/docs/handoffs/01-product-spec.md && printf "\n---\n" && sed -n "1,260p" /opt/DomainOps/docs/handoffs/02-content-and-form-schema.md && printf "\n---\n" && sed -n "1,260p" /opt/DomainOps/docs/handoffs/03-ui-build-brief-for-claude.md && printf "\n---\n" && sed -n "1,240p" /opt/DomainOps/docs/handoffs/07-claude-prompt-02-app-build.md'
```
Expected: the remote app handoff explicitly requires `ui-ux-pro-max-skill`, seeded brands, hidden report routes, and blank-value honesty.

- [ ] **Step 2: In the same Claude builder session, paste Prompt 02 and let it finish the product round**

Action:
- Paste the full contents of `/opt/DomainOps/docs/handoffs/07-claude-prompt-02-app-build.md` into the builder session.
- Wait for Claude to finish the application round and give its final verification summary.

Expected: Claude reports seeded brands, landing page, form routes, autosave, submit locking, report routes, purge, and final verification commands.

- [ ] **Step 3: Verify the expected application files exist after Prompt 02**

Run:
```bash
ssh ubuntu@5.249.252.12 'cd /opt/DomainOps && ls prisma/schema.prisma prisma/seed.ts && printf "\n---\n" && find src/app -maxdepth 4 -type f | sort | sed -n "1,120p" && printf "\n---\n" && find src/components -maxdepth 2 -type f | sort | sed -n "1,120p" && printf "\n---\n" && find src/lib -maxdepth 2 -type f | sort | sed -n "1,120p"'
```
Expected: files exist for the landing page, brand form route, report overview route, report detail route, section components, and supporting lib helpers.

- [ ] **Step 4: Inspect the final Prisma schema and seed file**

Run:
```bash
ssh ubuntu@5.249.252.12 'sed -n "1,260p" /opt/DomainOps/prisma/schema.prisma && printf "\n---\n" && sed -n "1,260p" /opt/DomainOps/prisma/seed.ts'
```
Expected: the schema defines `Brand` and `BrandResponse`, and the seed script inserts all 12 brands in the required order with text-fallback handling for `Herold` and `Alfahosting`.

- [ ] **Step 5: Re-run the code quality gates after app build**

Run:
```bash
ssh ubuntu@5.249.252.12 'cd /opt/DomainOps && npm run lint && npm run build'
```
Expected: both commands succeed. If either fails, feed the exact error back to Claude and rerun Prompt 02 before continuing.

### Task 5: Configure runtime secrets and start the stack

**Files:**
- Modify: `/opt/DomainOps/.env`
- Verify: `/opt/DomainOps/docker-compose.yml`
- Verify: `/opt/DomainOps/Caddyfile`

- [ ] **Step 1: Create the runtime env file from the example**

Run:
```bash
ssh ubuntu@5.249.252.12 'cd /opt/DomainOps && cp .env.example .env'
```
Expected: `/opt/DomainOps/.env` exists.

- [ ] **Step 2: Fill `.env` with the real deployment secrets before starting Compose**

Action:
- Open `/opt/DomainOps/.env` on the VPS.
- Replace the example DB password with the real database password.
- Set the final `BASIC_AUTH_USER`.
- Generate the `BASIC_AUTH_HASH` on the VPS using `caddy hash-password` and store only the hash in `.env`.
- Keep the plaintext Basic Auth password outside the repo for manual smoke tests.
- Keep `APP_URL=http://5.249.252.12` until a real domain is attached.

Expected: `.env` contains real values and no sample credentials remain.

- [ ] **Step 3: Start the stack in the background**

Run:
```bash
ssh ubuntu@5.249.252.12 'cd /opt/DomainOps && docker compose up -d --build'
```
Expected: Compose builds and starts `web`, `postgres`, and `caddy` without fatal errors.

- [ ] **Step 4: Verify container health and service status**

Run:
```bash
ssh ubuntu@5.249.252.12 'cd /opt/DomainOps && docker compose ps'
```
Expected: `web`, `postgres`, and `caddy` show `Up` or healthy status.

- [ ] **Step 5: Verify the seed has produced all 12 brands**

Run:
```bash
ssh ubuntu@5.249.252.12 'cd /opt/DomainOps && docker compose exec postgres psql -U domainops -d domainops -c "select count(*) as brand_count from \"Brand\";"'
```
Expected: the query returns `12`.

### Task 6: Run end-to-end acceptance and capture the result

**Files:**
- Verify: `/opt/DomainOps/src/app/page.tsx`
- Verify: `/opt/DomainOps/src/app/brands/[brand]/page.tsx`
- Verify: `/opt/DomainOps/src/app/report/page.tsx`
- Verify: `/opt/DomainOps/src/app/report/[brand]/page.tsx`

- [ ] **Step 1: Verify the app is protected by Basic Auth before logging in**

Run:
```bash
ssh ubuntu@5.249.252.12 'curl -I http://127.0.0.1'
```
Expected: the response is `401 Unauthorized` or equivalent Basic Auth challenge output from Caddy.

- [ ] **Step 2: Verify the landing page HTML is reachable with valid credentials**

Action:
- Use the Basic Auth username and plaintext password you set in `.env`.
- Request `http://5.249.252.12/` in a browser or with an authenticated `curl` command.

Expected: the landing page shows the questionnaire purpose, blank-answer guidance, example preview, and the brand picker.

- [ ] **Step 3: Run a minimum-data respondent flow for one brand**

Action:
- Choose `Dogado` from the picker.
- Confirm the form shows the `Dogado` logo in the header.
- Fill only `Completed by (name and title)` and keep the rest blank.
- Wait for autosave to report success.
- Submit the form.

Expected: the brand transitions to the `Form filled out` state and the app accepts the intentionally blank sections.

- [ ] **Step 4: Verify the hidden report overview and detail flow**

Action:
- Open `http://5.249.252.12/report` directly.
- Confirm `Dogado` shows `Submitted` and untouched brands show `Not started`.
- Open the `Dogado` detail page.

Expected: the overview is readable, the detail page presents the response in section order, and blank fixed/empty sections are rendered as `Not provided` or `No entries provided` rather than hidden.

- [ ] **Step 5: Verify purge and fallback-brand behavior**

Action:
- From `/report` or `/report/dogado`, purge the `Dogado` response.
- Refresh `/report` and confirm `Dogado` returns to `Not started`.
- Also open `Herold` and `Alfahosting` in the picker to confirm they use text fallback wordmarks instead of broken images.

Expected: purge fully resets the brand state, and the two missing-logo brands render cleanly without blocking the app.

- [ ] **Step 6: Record the final delivery state before handing the VPS back**

Run:
```bash
ssh ubuntu@5.249.252.12 'cd /opt/DomainOps && npm run lint && npm run build && docker compose ps'
```
Expected: lint passes, build passes, and the running stack still shows healthy services.

Action:
- Save Claude's final environment-round summary and app-round summary outside the repo or in your operator notes.
- Keep the plaintext Basic Auth password outside the repo and the password hash inside `.env` only.

Expected: you have a reproducible record of what Claude did, what was verified, and what credentials remain operator-owned.
