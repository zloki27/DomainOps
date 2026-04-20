# UI Build Brief For Claude

## Your Role
You are the builder. The planners already decided the scope, content, and operating model. Build exactly what the handoff package describes.

## Mandatory Skill
You must use `ui-ux-pro-max-skill` for the UI work.

Installation source and prerequisite details are in `04-stack-and-environment.md`.
If the skill is unavailable, stop and report the blocker instead of improvising a generic UI.

No other external skill is required.

## Execution Restrictions
- Do not use git.
- Do not commit or push anything.
- Work only locally in `/opt/DomainOps`.

## Product Shape
This is not a platform. It is a focused, premium-looking questionnaire app.

Build these surfaces:
- landing page with instructions and brand picker
- one brand form page
- hidden report overview page
- hidden report detail page
- submitted-state message for completed brands

## Visual Direction
- Use one shared premium visual language for all brands.
- Show the selected brand's logo or text wordmark in the form header.
- Do not create 12 different themes.
- Do not depend on brand colors for the design system.
- Keep the form elegant and calm, not flashy or over-complex.
- Use strong spacing, clear hierarchy, refined typography, and subtle motion only where it helps.
- The design should feel polished enough for executive/internal distribution, but still practical for data entry.

## UX Direction
- Keep the form on one guided page with section anchors or sticky section navigation.
- Use clearly separated cards or sections for each workbook area.
- Make repeatable rows easy to add and scan.
- Show autosave state visibly but quietly.
- Make the submitted state feel final and reassuring.
- Make the report view clean and presentable, not like a raw admin dump.

## Required Components
- `BrandPicker`
- `BrandHeader`
- `InstructionsPanel`
- `ExamplePreview`
- `AutosaveStatus`
- `RepeatableRowSection`
- `FixedQuestionSection`
- `LongTextSection`
- `SubmittedState`
- `ReportStatusTable`
- `ReportDetailSections`
- `PurgeBrandButton`

## Data Honesty Rules
- Blank values are valid.
- Blank values must not be auto-filled, normalized away, or hidden.
- The report layer must make blank answers visible as missing information.
- Do not invent extra analysis or calculated insights.
- Do not add exports that were not requested.

## Technical Bias
- Use Next.js App Router.
- Use Prisma for all DB access.
- Use PostgreSQL JSON payload storage for the questionnaire body.
- Keep dependencies lean.
- Favor server-rendered page shells with client components only where interactivity is needed.
- Route handlers or server actions are acceptable; choose the simpler implementation for reliable autosave and purge.

## Recommended Frontend Dependencies
Use a minimal modern set such as:
- `tailwindcss`
- `clsx`
- `tailwind-merge`
- `class-variance-authority`
- `lucide-react`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `date-fns`
- an optional lightweight toast library if needed

Do not add heavy admin templates, bulky data-grid libraries, or authentication packages.

## Acceptance Criteria
- The landing page renders the workbook purpose, blank-field guidance, example preview, and brand picker.
- The brand picker contains all 12 brands in the specified order.
- The form renders all questionnaire sections and questions.
- Draft changes persist and reload.
- Submitting a brand replaces the form with a `Form filled out` state.
- The report overview shows every brand and its derived status.
- The report overview includes purge.
- The report detail screen is readable and presentable.
- Missing logos fall back to text for `Herold` and `Alfahosting`.
- No user management or feature creep is introduced.

## Self-Check Before Stopping
- run Prisma migration and seed
- verify the app starts
- verify one draft roundtrip
- verify one submit roundtrip
- verify report visibility
- verify purge returns a brand to `Not started`
