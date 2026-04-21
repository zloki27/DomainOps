# Claude Prompt 03 - Report Export Extension

Use this prompt only after the base app build is already working.

```text
You are extending the existing DomainOps application in /opt/DomainOps.

Read these files first and follow them exactly:
- /opt/DomainOps/docs/handoffs/03-ui-build-brief-for-claude.md
- /opt/DomainOps/docs/handoffs/08-report-export-extension.md

Execution restrictions:
- Do not use git.
- Do not commit or push anything.
- Work only locally in /opt/DomainOps.

Critical instructions:
- Use ui-ux-pro-max-skill for the UI work.
- This is a narrow extension to the hidden report layer only.
- Do not refactor unrelated form flows.
- Do not add downloads, user management, analytics, or new admin features.
- Preserve the current blank-value semantics exactly.

Build requirements:
1. Add report export actions to `/report` for exporting the complete all-brand report.
2. Add report export actions to `/report/[brand]` for exporting the current brand only.
3. Support exactly these outputs:
   - Markdown
   - HTML table
   - Plain text
4. Make Markdown the primary visible export action.
5. Implement HTML clipboard writes with plain-text fallback when rich clipboard is unsupported.
6. Keep the export UI compact, polished, and aligned with the existing report styling.
7. Centralize export generation in a shared utility module instead of scattering string building through page components.
8. Do not break report overview, detail view, or purge.

At the end, report:
- what you built
- key files created or changed
- how Markdown, HTML, and plain-text export are generated
- how HTML fallback behaves when rich clipboard support is missing
- exact verification commands run
- any remaining assumptions or blockers
```
