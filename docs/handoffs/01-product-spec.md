# Product Spec - Domain Operations Discovery App

## Product Summary
Build a small internal questionnaire application that turns the `Domain_Ops_Discovery_v5.xlsx` workbook into a polished, single-purpose web experience.

The app exists to collect one questionnaire response per brand across 12 Group.one brands, preserve draft progress, allow final submission, and give the internal team a clean hidden reporting view.

## Primary Goals
- Make the Excel questionnaire easier to complete.
- Preserve the meaning of blank answers.
- Keep the experience brand-aware without building 12 separate designs.
- Give the internal team a readable reporting layer.
- Keep the implementation small, honest, and operationally simple.

## Non-Goals
- No user accounts.
- No SSO.
- No per-user permissions.
- No workflow engine.
- No notifications.
- No Excel import.
- No Excel export.
- No analytics warehouse.
- No future-proof extensibility work beyond what the current app needs.

## Users
### Respondent
A trusted person who receives the shared Basic Auth credentials, opens the app, selects their brand, fills the form, and submits it.

### Internal reviewer
A trusted internal user who knows the hidden report URL and uses it to review responses and purge/reset a brand.

## Access Model
- The entire application is behind Caddy Basic Auth.
- There is one shared authentication wall for all users.
- There is no app-side identity or authorization model.
- The report routes are hidden from normal navigation but protected by the same Basic Auth layer.

## Brand Catalog
Use this exact order in the picker and report screens.

| Sort | Slug | Display name | Logo behavior |
| --- | --- | --- | --- |
| 1 | `one-com` | `one.com` | `/brand/one-com.svg` |
| 2 | `checkdomain` | `checkdomain` | `/brand/checkdomain.svg` |
| 3 | `dogado` | `Dogado` | `/brand/dogado.svg` |
| 4 | `metanet` | `Metanet` | `/brand/metanet.svg` |
| 5 | `herold` | `Herold` | text fallback |
| 6 | `hostnet` | `Hostnet` | `/brand/hostnet.svg` |
| 7 | `zoner` | `Zoner` | `/brand/zoner.svg` |
| 8 | `uniweb` | `Uniweb` | `/brand/uniweb.svg` |
| 9 | `webglobe` | `Webglobe` | `/brand/webglobe.svg` |
| 10 | `alfahosting` | `Alfahosting` | text fallback |
| 11 | `easyname` | `Easyname` | `/brand/easyname.svg` |
| 12 | `antagonist` | `Antagonist` | `/brand/antagonist.png` |

## Core Routes
### `/`
Landing page after Basic Auth.

Required content:
- short product title
- purpose and instructions derived from the workbook README
- explicit note that blank answers are valuable and interpreted as missing resource, missing ownership, or missing process
- example content preview using placeholder examples based on the workbook README
- brand picker

Required behavior:
- selecting a brand routes the user to `/brands/[brand]`
- no report links in the normal UI

### `/brands/[brand]`
Brand-specific workspace.

Required behavior:
- show selected brand logo or text fallback in the header
- show metadata block with brand, completed by, and date
- load existing draft if present
- autosave changes under a debounce
- if status is `submitted`, show a locked confirmation state instead of the form
- brand is not switchable from inside the form; returning to the landing page is the way to choose another brand

### `/report`
Hidden internal overview screen.

Required content:
- summary table/list of all 12 brands
- derived status for each brand: `Not started`, `In progress`, `Submitted`
- `completed by`
- last updated timestamp
- submitted timestamp when present
- action to open detail view
- action to purge a brand response
- long-scroll read summary below the overview so reviewers can skim all brands on one page

### `/report/[brand]`
Hidden internal detail screen for one brand.

Required content:
- presentable read-only display of the saved response
- same section order as the form
- explicit rendering for blanks and empty repeatable sections
- purge button for that brand

## Status Model
- `Not started`: no response row exists for the brand.
- `In progress`: a response row exists and status is draft/in-progress.
- `Submitted`: a response row exists and has been finalized.

## Reset Model
Reset is implemented by deleting the response row for a brand.
This returns the brand to `Not started`.
There is no reopen/revision workflow inside the app.

## Data Model
Use Prisma and PostgreSQL.

### `Brand`
Fields:
- `id`
- `slug` unique
- `displayName`
- `logoPath` nullable
- `sortOrder`
- timestamps

### `BrandResponse`
Fields:
- `id`
- `brandId` unique
- `status` enum: `IN_PROGRESS`, `SUBMITTED`
- `completedBy`
- `questionnaireDate`
- `payload` JSON
- `submittedAt` nullable
- timestamps

`Not started` is derived by absence of a `BrandResponse` row.

## Payload Shape
Top-level JSON structure:
- `domainPersonnel: PersonRow[]`
- `technicalResources: PersonRow[]`
- `operationalOwnership: OwnershipRow[]`
- `registriesAndSuppliers: SupplierRow[]`
- `communicationAndGovernance: GovernanceRow[]`
- `additionalInformation: string`

## UX Rules
- Keep the app visually premium but operationally simple.
- Use one shared visual system across all brands.
- Only the selected brand logo and name should change per brand.
- Avoid wizard complexity.
- Keep the questionnaire on one guided page with sections.
- Use readable card/grouping patterns instead of raw spreadsheet aesthetics.
- Show autosave state clearly.
- Show report data in a clean presentation layer, not raw JSON.

## Validation Rules
- `brand` comes from the route and is always required.
- `completedBy` is required.
- `questionnaireDate` should default to today and remain editable.
- Everything else can be blank.
- Blank values must be accepted and stored faithfully.

## Reporting Rules For Blank Data
- Do not treat a blank as zero.
- Do not hide blank sections.
- For empty repeatable sections, show `No entries provided`.
- For blank fixed-question answers, show `Not provided`.
- Add muted helper text that this usually indicates missing ownership, process, or resource.

## Acceptance Summary
The app is correct when:
- all 12 brands are present
- the questionnaire structure matches the workbook
- drafts save and reload
- submitted brands are locked behind a confirmation state
- the report layer shows list, long-scroll overview, detail view, and purge
- missing logos fall back cleanly to text
