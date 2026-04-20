# 2026-04-20 Domain Ops Discovery Design

## Goal
Build a small internal web application that converts the `Domain_Ops_Discovery_v5.xlsx` questionnaire into a branded, easy-to-complete web form for 12 Group.one brands. The app is intentionally short-lived and tightly scoped: collect one response per brand, allow draft autosave, allow final submission, and provide a hidden internal reporting layer with purge/reset per brand.

## Approved Decisions
- One shared app for all brands.
- The user passes through one shared Basic Auth wall before reaching the app.
- No user management, no per-user authorization, no per-brand access control.
- Users select their own brand from a picker on the landing page.
- One response per brand at a time.
- Reset is done by deleting that brand's saved response.
- Draft autosave is required.
- A submitted brand shows a `Form filled out` state instead of the form.
- The report layer is a hidden route, not part of normal user navigation.
- The app is English-only.
- The questionnaire content follows the Excel workbook closely, with only light copy cleanup and helper text improvements.
- Blank answers are meaningful and must be preserved as signals of missing ownership, missing process, or missing resource.
- UI implementation must use `ui-ux-pro-max-skill`.
- Stack: Next.js, React, TypeScript, Prisma, PostgreSQL, Caddy Basic Auth, Docker Compose, single Ubuntu 24.04 VPS.

## Architecture
- Use Next.js App Router.
- Use Prisma with PostgreSQL.
- Seed a canonical `brands` table with the 12 brands from the workbook.
- Store one optional `brand_responses` row per brand.
- Treat `not_started` as a derived state when a brand has no response row.
- Persist the questionnaire body as structured JSON payload rather than many normalized child tables.
- Put the entire app behind Caddy Basic Auth; do not build an app-side auth system.
- Keep the public web service internal to Docker; expose only Caddy.

## Components
- Landing page with purpose, instructions, example content, and brand picker.
- Brand form page with logo header, metadata block, autosave status, section navigation, and six questionnaire sections.
- Repeatable-row section component for personnel and suppliers.
- Fixed-question section component for ownership and governance.
- Submitted-state screen with a clear `Form filled out` message.
- Hidden report index page with status overview, purge action, and long-scroll all-brand summary.
- Hidden report detail page for one brand.
- Shared brand-logo component with text fallback for brands without local logo assets.

## Data Flow
1. Caddy challenges the user with Basic Auth.
2. The app loads the seeded brand catalog.
3. The user selects a brand on `/` and is routed to `/brands/[brand]`.
4. The form page loads the brand and any existing response row.
5. Field changes trigger debounced autosave upserts.
6. The first successful autosave creates the response row and marks it `in_progress`.
7. Submit sets status to `submitted` and records `submittedAt`.
8. A submitted brand no longer shows the editable form.
9. The report layer joins all brands against their optional response row to derive `Not started`, `In progress`, or `Submitted`.
10. Purge deletes the saved response row entirely, returning the brand to `Not started`.

## Error Handling
- Unknown brand slug returns 404.
- Missing response row is normal and must render as `Not started`.
- Autosave failure shows inline error and a retry path; do not silently lose data.
- Missing logo asset falls back to a clean text wordmark.
- Blank questionnaire fields are valid and must not be auto-filled with fake placeholders.
- The report UI must render blanks explicitly as `Not provided` or `No entries provided`, not as invisible empty space.
- If only a server IP is available, HTTP over IP is allowed for staging only; final respondent rollout should use a real domain with TLS in Caddy.

## Testing And Verification
- Verify environment bootstrap on Ubuntu 24.04.
- Verify `npm install`, Prisma migration, and seed.
- Verify all 12 brands appear in the picker.
- Verify 10 local logos render and `Herold`/`Alfahosting` use text fallback.
- Verify autosave survives refresh.
- Verify submit changes the route state to `Form filled out`.
- Verify report overview, report detail, and purge.
- Verify only Caddy is public in Docker Compose.

## Deliverables
This design is implemented through the handoff package in `docs/handoffs/`:
- `00-handoff-index.md`
- `01-product-spec.md`
- `02-content-and-form-schema.md`
- `03-ui-build-brief-for-claude.md`
- `04-stack-and-environment.md`
- `05-vps-deployment-runbook.md`
- `06-claude-prompt-01-environment-bootstrap.md`
- `07-claude-prompt-02-app-build.md`
