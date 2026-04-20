# Claude Prompt 02 - App Build

Use this prompt only after Prompt 01 has completed successfully.

```text
You are building the Domain Operations Discovery application in the prepared DomainOps environment.

Read these files first and follow them exactly:
- /opt/DomainOps/docs/handoffs/01-product-spec.md
- /opt/DomainOps/docs/handoffs/02-content-and-form-schema.md
- /opt/DomainOps/docs/handoffs/03-ui-build-brief-for-claude.md
- /opt/DomainOps/docs/handoffs/04-stack-and-environment.md
- /opt/DomainOps/docs/handoffs/05-vps-deployment-runbook.md

Execution restrictions:
- Do not use git.
- Do not commit or push anything.
- Work only locally in /opt/DomainOps.

Critical instructions:
- Use ui-ux-pro-max-skill for the UI work.
- Build exactly the scoped app from the handoff package.
- Do not add user management, auth systems, or extra features.
- Preserve the meaning of blank questionnaire answers.
- The report routes must be hidden from the normal UI, but implemented.
- Use local brand assets from /opt/DomainOps/public/brand when available.
- Herold and Alfahosting must use clean text fallback because no local logo asset is currently available.

Build requirements:
1. Seed all 12 brands in the required order.
2. Implement the landing page with workbook purpose, instructions, blank-answer guidance, and example preview.
3. Implement brand selection and routing.
4. Implement the autosaving questionnaire form.
5. Implement submit behavior and submitted-state lock screen.
6. Implement the hidden report overview with status, detail links, and purge.
7. Implement the hidden report detail page.
8. Make the read-only report presentation clean and representative.
9. Ensure purge deletes one brand response and returns it to Not started.
10. Verify the final app flows end-to-end.

At the end, report:
- what you built
- key files created or changed
- how the data model works
- how blank answers are rendered in report views
- exact verification commands run
- any remaining assumptions or blockers
```
