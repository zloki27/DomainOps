# Claude Prompt 01 - Environment Bootstrap

Use this prompt in the builder session on the VPS.

```text
You are bootstrapping the DomainOps project environment on the VPS.

Read these files first and follow them exactly:
- /opt/DomainOps/docs/handoffs/04-stack-and-environment.md
- /opt/DomainOps/docs/handoffs/05-vps-deployment-runbook.md

Execution restrictions:
- Do not use git.
- Do not commit or push anything.
- Work only locally in /opt/DomainOps.

Important context:
- /opt/DomainOps is effectively an empty repository with no commits yet.
- You must prepare the environment first, before building the app itself.
- The UI phase later must use ui-ux-pro-max-skill, so install and verify that prerequisite during this environment phase.

Your tasks in this phase:
1. Install required OS packages.
2. Install Node.js 22 LTS and npm.
3. Install Docker Engine and Docker Compose plugin.
4. Install Caddy.
5. Install and verify ui-ux-pro-max-skill for Claude. If GitHub download fails, try the offline path described in the handoff.
6. Bootstrap a clean Next.js + TypeScript + Tailwind project in /opt/DomainOps.
7. Install the required npm dependencies.
8. Initialize Prisma and create the initial schema scaffolding.
9. Create the initial Docker Compose and Caddy scaffolding.
10. Create any required env example files.
11. Verify the environment gates listed in the handoff.

Stop after the environment is ready and verified.
Do not build the Domain Operations Discovery product features yet.
At the end, report:
- what you installed
- what files you created
- exact verification commands run
- any blockers or assumptions
```
