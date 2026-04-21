# DomainOps Handoff Index

## Purpose
This folder is the handoff package for a separate Claude builder session running on the VPS at `ubuntu@5.249.252.12` in `/opt/DomainOps`.

The builder's job is split into two phases:
1. Bootstrap the environment and project skeleton.
2. Build the Domain Operations Discovery application.

## Current Ground Truth
- Target server: Ubuntu 24.04.
- Target working directory: `/opt/DomainOps`.
- The VPS repo exists but currently has no commits and no checked-out project files.
- `node`, `npm`, `docker`, and `caddy` were not installed at the time of planning.
- This handoff assumes the builder starts from an effectively empty repository.

## Asset Ground Truth
Local brand assets have been prepared under `public/brand/` in this local planning folder.

Available local brand logos:
- `one-com.svg`
- `checkdomain.svg`
- `dogado.svg`
- `metanet.svg`
- `hostnet.svg`
- `zoner.svg`
- `uniweb.svg`
- `webglobe.svg`
- `easyname.svg`
- `antagonist.png`
- shared Group.one marks

Missing local brand logos:
- `Herold`
- `Alfahosting`

Required behavior for missing logos:
- use a clean text fallback wordmark
- do not block the app on missing logo files
- do not invent replacement logos

## Read Order For Claude
For environment bootstrap:
1. `04-stack-and-environment.md`
2. `05-vps-deployment-runbook.md`
3. `06-claude-prompt-01-environment-bootstrap.md`

For app build:
1. `01-product-spec.md`
2. `02-content-and-form-schema.md`
3. `03-ui-build-brief-for-claude.md`
4. `04-stack-and-environment.md`
5. `05-vps-deployment-runbook.md`
6. `07-claude-prompt-02-app-build.md`

For report export extension:
1. `03-ui-build-brief-for-claude.md`
2. `08-report-export-extension.md`
3. `09-claude-prompt-03-report-export.md`

## Mandatory Build Rules For Claude
- Do not use git.
- Do not commit or push anything.
- Work only locally in `/opt/DomainOps`.
- Build the environment first, then the app.
- Use `ui-ux-pro-max-skill` for the UI work.
- Do not add user management, role systems, email flows, or scope-expanding features.
- Treat blank questionnaire answers as valid signals, not validation failures.

## Other Skills
The only mandatory external skill is `ui-ux-pro-max-skill`.
Do not depend on any other external skill to finish the app.
