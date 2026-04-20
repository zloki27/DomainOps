# Content And Form Schema

## Source Of Truth
This file translates the Excel workbook into implementation-ready content so the builder does not need to reinterpret the spreadsheet.

## Landing Page Copy Requirements
The landing page must include a concise version of these workbook instructions:
- This questionnaire maps the current state of domain operations across all Group.one brands.
- It identifies who does what, what exists, and where gaps are.
- There are no wrong answers.
- If a responsibility is unassigned or a process does not exist, blank fields are still valuable.
- Blank fields should be treated as missing ownership, missing process, or missing resource.
- Include people who regularly perform, decide on, or are accountable for domain-related tasks.
- Do not include occasional customer-facing support.
- Estimated time: roughly 10 to 15 minutes.

## Example Preview Requirements
The landing page should show a small non-editable example preview using placeholder content based on the workbook examples.

Required example themes:
- one sample person row
- one sample technical resource row
- one sample operational ownership answer
- one sample supplier row
- one sample governance answer

These are visual examples only. Do not prefill the real form with them.

## Metadata Block
### Field 1
- Label: `Brand`
- Type: read-only value from route
- Required: yes

### Field 2
- Label: `Completed by (name and title)`
- Type: single-line text
- Required: yes
- Placeholder: `e.g. Anna Meier, Hostmaster`

### Field 3
- Label: `Date`
- Type: date
- Required: system-defaulted to today
- Editable: yes

## Section 1 - Domain Personnel
### Intro copy
`List all individuals with any domain-related responsibility - operational, technical, commercial, or administrative.`

### UI type
Repeatable rows.

### Columns
1. `Name`
2. `Title`
3. `Department / Team`
4. `Primary assignment`
5. `Domain-related tasks they perform`
6. `Estimated % on domain work`

### Row placeholder example
- Name: `Anna Meier`
- Title: `Hostmaster`
- Department / Team: `Domain Operations`
- Primary assignment: `Domain operations`
- Domain-related tasks they perform: `Primary contact for restores, transfers, registrant changes, abuse escalation, and GDPR requests.`
- Estimated % on domain work: `100`

## Section 2 - Technical Resources
### Intro copy
`Which developers or technical staff work on domain-related tasks such as implementing registry changes, maintaining EPP integrations, or fixing domain-related issues?`

### UI type
Repeatable rows.

### Columns
Same six columns as `Domain Personnel`.

### Row placeholder example
- Name: `Erik Larsen`
- Title: `Backend Developer`
- Department / Team: `Platform / CTO Engineering`
- Primary assignment: `Backend development for checkout and billing`
- Domain-related tasks they perform: `Maintains EPP integrations, implements registry changes, and troubleshoots failed transfers.`
- Estimated % on domain work: `30`

## Section 3 - Operational Ownership
### Intro copy
`For each case below, who in your brand is responsible? If no one, leave blank.`

### UI type
Fixed question list.

### Per-question fields
- `Who is responsible? (name, title, department)`
- `Comments / notes`

### Questions
1. `Domain restores (recovery after expiry)`
2. `Registrant change - if handled manually, describe what it involves and estimated effort`
3. `Troubleshooting failed inbound transfers`
4. `Pricing decisions per TLD`
5. `Handling price changes from registries / registrars`
6. `TLD portfolio decisions (which TLDs to offer)`
7. `Abuse escalation (brand-side customer communication)`
8. `GDPR requests on domain registrant data (access, deletion, rectification)`
9. `Compliance obligations (RRA / ICANN / Registry agreements)`
10. `Dispute handling`
11. `Registry announcements -> translating into internal implementation`

### Placeholder answer example
- Responsible: `Anna Meier, Hostmaster`
- Notes: `Verifies identity by email and ID upload, then executes the change at the registry. Around 30 minutes per case.`

## Section 4 - Registries & Suppliers
### Intro copy
`List all registries and wholesale registrars your brand has a direct relationship with.`

### UI type
Repeatable rows.

### Columns
1. `Registry / Wholesale registrar`
2. `Type (direct accreditation / wholesale)`
3. `Primary contact (name, title)`

### Row placeholder example
- Registry / Wholesale registrar: `DENIC (.de)`
- Type: `Direct accreditation`
- Primary contact: `Anna Meier, Hostmaster`

## Section 5 - Communication & Governance
### UI type
Fixed question list.

### Per-question fields
- `Who is responsible? (name, title, department)`
- `Comments / notes`

### Questions
1. `How does your brand currently receive and act on group-level guidance related to domain operations?`
2. `Reporting domain operations status upward`
3. `Internal escalation within the brand`
4. `Escalation toward group level`

### Placeholder answer example
- Responsible: `Anna Meier, Hostmaster`
- Notes: `No formal channel exists yet; guidance is handled ad hoc.`

## Section 6 - Additional Information
### UI type
Single long-text field.

### Question
`Is there anything related to domain operations not covered above that you feel is important for us to know?`

### Placeholder example
`Mention missing ownership, process pain, tooling gaps, or important exceptions here.`

## Autosave Rules
- Save draft after metadata is valid and after any field change under a debounce.
- A newly created draft should create the brand response row.
- The form should show `Saving...`, `Saved`, or `Save failed`.

## Submit Rules
- Submit is enabled only when `Completed by (name and title)` is filled.
- The submit action persists final data and marks the response `Submitted`.
- After submit, the editable form must not be shown for that brand.

## Report Rendering Rules
### Repeatable sections
- If no rows exist, show `No entries provided`.
- If some cells inside a row are blank, render `Not provided` for those cells.

### Fixed-question sections
- If the responsible field is blank, render `Not provided`.
- If comments are blank, render `No notes provided`.

### Additional information
- If blank, render `No additional information provided`.
