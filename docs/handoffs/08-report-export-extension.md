# Report Export Extension

## Purpose
Extend the existing hidden report layer so internal users can quickly move questionnaire data into Confluence and AI workflows without manual rewriting.

## Scope
This extension applies only to the hidden report surfaces:
- `/report`
- `/report/[brand]`

Do not change questionnaire content, autosave, submit behavior, purge semantics, authentication, or brand selection.

## Export Strategy
Support three export outputs for the report layer:
1. `Markdown` — primary format and visually primary action in the UI.
2. `HTML Table` — intended for direct paste into Confluence.
3. `Plain text` — fallback when rich clipboard support is unavailable or HTML paste is not desired.

## Primary UX Goal
Internal users should be able to open the report layer, press one export action, and immediately paste the result into:
- Confluence
- AI tools
- plain-text notes or chat

## UX Requirements
### Report overview `/report`
Add an export action group near the page header for exporting the complete all-brand report.

Required actions:
- `Copy all as Markdown`
- `Copy all as HTML table`
- `Copy all as Plain text`

The Markdown action should be the most prominent because it is the preferred format for AI input and human-readable reuse.

### Brand detail `/report/[brand]`
Add an export action group near the brand header for exporting the current brand only.

Required actions:
- `Copy brand as Markdown`
- `Copy brand as HTML table`
- `Copy brand as Plain text`

### Interaction rules
- Use clipboard-first actions, not file downloads.
- Show a small success state or toast after copy.
- If HTML clipboard writing is unsupported, fall back to copying the plain-text version and say so clearly.
- Keep the controls visually refined and consistent with the current premium report styling.
- Do not add bulky export modals or admin-style toolbars.

## Data Honesty Rules
- Preserve the existing rendering semantics for blanks.
- Do not hide empty sections.
- Exported output must preserve brand order, section order, and question order.
- Empty repeatable sections must export as `No entries provided`.
- Blank fixed answers must export as `Not provided`.
- Additional information must remain a free-text block.

## Output Requirements
### Markdown
Markdown is the preferred export for AI and internal reuse.

Requirements:
- use heading structure for page title, brand title, and sections
- use readable markdown tables where tabular data helps
- use paragraphs or bullets for long text where that reads better than a forced table
- preserve section labels exactly enough to match the report UI
- keep the output clean enough to paste directly into Confluence or an AI tool

Suggested shape for single-brand export:
- title line with brand name
- short metadata block for status, completed by, updated, submitted
- section headings for:
  - Domain Personnel
  - Technical Resources
  - Operational Ownership
  - Registries & Suppliers
  - Communication & Governance
  - Additional Information

Suggested shape for all-brand export:
- page title
- summary table of brands and status metadata
- repeated brand sections in the same order as the report long-scroll view

### HTML Table
This export exists specifically to improve paste quality in Confluence.

Requirements:
- write rich clipboard data using `text/html`
- also include `text/plain` in the same clipboard write when supported
- use simple, semantic HTML tables and headings
- avoid overly nested markup or CSS-dependent formatting
- keep tables clean and readable when pasted into Confluence

For brand detail export, use separate tables per section where appropriate.
For all-brand export, include:
- one summary table at the top
- then one sectioned block per brand with tables for the structured data

### Plain text
This is the resilience format.

Requirements:
- always available
- readable in terminal, notes, and chat
- preserve the same content as the other export formats
- use obvious headings and label-value formatting

## Implementation Guidance
Create one shared export utility layer so all formats derive from the same structured source.

Recommended structure:
- one serializer module for report export assembly, for example `lib/report-export.ts`
- helper functions that build a normalized report object for:
  - all brands
  - single brand
- formatter functions for:
  - markdown
  - html
  - plain text

Do not scatter export string-building logic directly across multiple page components.

## UI Component Guidance
A lightweight export component is preferred, for example:
- `ReportExportActions`
- optional small helper like `copyReportExport()`

The export UI should feel like a compact internal publishing tool, not a developer utility.

## Acceptance Criteria
This extension is complete when:
- `/report` can copy the full report in Markdown, HTML table, and plain text
- `/report/[brand]` can copy the single brand in Markdown, HTML table, and plain text
- Markdown is the visually primary export action
- HTML export writes rich clipboard content suitable for Confluence paste
- HTML export has a plain-text fallback path when rich clipboard is unsupported
- copied content preserves the report's section order and blank-value semantics
- the feature introduces no new auth, workflow, or download complexity
- the app still builds and the existing report and purge flows still work
