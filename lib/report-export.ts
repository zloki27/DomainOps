import type {
  ReportBrandRow,
  PersonRow,
  OwnershipAnswer,
  SupplierRow,
  GovernanceAnswer,
} from '@/lib/types';

const NP = 'Not provided';
const NE = 'No entries provided';

function val(v: string | null | undefined): string {
  return v?.trim() || NP;
}

function fmtDate(d: Date | null | undefined): string {
  if (!d) return NP;
  return d instanceof Date ? d.toISOString().split('T')[0] : NP;
}

// ── Markdown helpers ──────────────────────────────────────────────────────────

function mdPersonTable(rows: PersonRow[]): string {
  if (!rows.length) return NE;
  const header = '| Name | Title | Department | Primary Assignment | Domain Tasks | Est. % |';
  const sep = '|---|---|---|---|---|---|';
  const body = rows
    .map(
      (r) =>
        `| ${val(r.name)} | ${val(r.title)} | ${val(r.department)} | ${val(r.primaryAssignment)} | ${val(r.domainTasks)} | ${val(r.estimatedPercent)} |`,
    )
    .join('\n');
  return [header, sep, body].join('\n');
}

function mdOwnershipTable(rows: OwnershipAnswer[]): string {
  if (!rows.length) return NE;
  const header = '| Responsible | Comments |';
  const sep = '|---|---|';
  const body = rows.map((r) => `| ${val(r.responsible)} | ${val(r.comments)} |`).join('\n');
  return [header, sep, body].join('\n');
}

function mdSupplierTable(rows: SupplierRow[]): string {
  if (!rows.length) return NE;
  const header = '| Registry Name | Type | Primary Contact |';
  const sep = '|---|---|---|';
  const body = rows
    .map((r) => `| ${val(r.registryName)} | ${val(r.type)} | ${val(r.primaryContact)} |`)
    .join('\n');
  return [header, sep, body].join('\n');
}

function mdGovernanceTable(rows: GovernanceAnswer[]): string {
  if (!rows.length) return NE;
  const header = '| Responsible | Comments |';
  const sep = '|---|---|';
  const body = rows.map((r) => `| ${val(r.responsible)} | ${val(r.comments)} |`).join('\n');
  return [header, sep, body].join('\n');
}

function mdBrand(brand: ReportBrandRow): string {
  const p = brand.payload;
  const lines: string[] = [
    `## ${brand.displayName}`,
    '',
    `**Status:** ${brand.status}`,
    `**Completed by:** ${val(brand.completedBy)}`,
    `**Submitted at:** ${fmtDate(brand.submittedAt)}`,
    `**Last updated:** ${fmtDate(brand.updatedAt)}`,
    '',
  ];

  if (!p) {
    lines.push('_No questionnaire data submitted._');
    return lines.join('\n');
  }

  lines.push('### Domain Personnel', '', mdPersonTable(p.domainPersonnel), '');
  lines.push('### Technical Resources', '', mdPersonTable(p.technicalResources), '');
  lines.push('### Operational Ownership', '', mdOwnershipTable(p.operationalOwnership), '');
  lines.push(
    '### Registries & Suppliers',
    '',
    mdSupplierTable(p.registriesAndSuppliers),
    '',
  );
  lines.push(
    '### Communication & Governance',
    '',
    mdGovernanceTable(p.communicationAndGovernance),
    '',
  );
  lines.push(
    '### Additional Information',
    '',
    p.additionalInformation?.trim() || NP,
    '',
  );

  return lines.join('\n');
}

export function toMarkdown(brand: ReportBrandRow): string {
  return mdBrand(brand);
}

export function toMarkdownAll(brands: ReportBrandRow[]): string {
  return (
    `# DomainOps Brand Report\n\n` +
    brands.map(mdBrand).join('\n\n---\n\n')
  );
}

// ── HTML helpers ──────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function htmlPersonTable(rows: PersonRow[]): string {
  if (!rows.length) return `<p class="no-entries">${NE}</p>`;
  const heads = ['Name', 'Title', 'Department', 'Primary Assignment', 'Domain Tasks', 'Est. %'];
  const ths = heads.map((h) => `<th>${h}</th>`).join('');
  const trs = rows
    .map(
      (r) =>
        `<tr><td>${esc(val(r.name))}</td><td>${esc(val(r.title))}</td><td>${esc(val(r.department))}</td><td>${esc(val(r.primaryAssignment))}</td><td>${esc(val(r.domainTasks))}</td><td>${esc(val(r.estimatedPercent))}</td></tr>`,
    )
    .join('');
  return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
}

function htmlOwnershipTable(rows: OwnershipAnswer[]): string {
  if (!rows.length) return `<p class="no-entries">${NE}</p>`;
  const trs = rows
    .map((r) => `<tr><td>${esc(val(r.responsible))}</td><td>${esc(val(r.comments))}</td></tr>`)
    .join('');
  return `<table><thead><tr><th>Responsible</th><th>Comments</th></tr></thead><tbody>${trs}</tbody></table>`;
}

function htmlSupplierTable(rows: SupplierRow[]): string {
  if (!rows.length) return `<p class="no-entries">${NE}</p>`;
  const trs = rows
    .map(
      (r) =>
        `<tr><td>${esc(val(r.registryName))}</td><td>${esc(val(r.type))}</td><td>${esc(val(r.primaryContact))}</td></tr>`,
    )
    .join('');
  return `<table><thead><tr><th>Registry Name</th><th>Type</th><th>Primary Contact</th></tr></thead><tbody>${trs}</tbody></table>`;
}

function htmlGovernanceTable(rows: GovernanceAnswer[]): string {
  if (!rows.length) return `<p class="no-entries">${NE}</p>`;
  const trs = rows
    .map((r) => `<tr><td>${esc(val(r.responsible))}</td><td>${esc(val(r.comments))}</td></tr>`)
    .join('');
  return `<table><thead><tr><th>Responsible</th><th>Comments</th></tr></thead><tbody>${trs}</tbody></table>`;
}

function htmlBrand(brand: ReportBrandRow): string {
  const p = brand.payload;
  const meta = [
    `<p><strong>Status:</strong> ${esc(brand.status)}</p>`,
    `<p><strong>Completed by:</strong> ${esc(val(brand.completedBy))}</p>`,
    `<p><strong>Submitted at:</strong> ${esc(fmtDate(brand.submittedAt))}</p>`,
    `<p><strong>Last updated:</strong> ${esc(fmtDate(brand.updatedAt))}</p>`,
  ].join('');

  if (!p) {
    return `<section class="brand"><h2>${esc(brand.displayName)}</h2>${meta}<p><em>No questionnaire data submitted.</em></p></section>`;
  }

  const sections = [
    `<h3>Domain Personnel</h3>${htmlPersonTable(p.domainPersonnel)}`,
    `<h3>Technical Resources</h3>${htmlPersonTable(p.technicalResources)}`,
    `<h3>Operational Ownership</h3>${htmlOwnershipTable(p.operationalOwnership)}`,
    `<h3>Registries &amp; Suppliers</h3>${htmlSupplierTable(p.registriesAndSuppliers)}`,
    `<h3>Communication &amp; Governance</h3>${htmlGovernanceTable(p.communicationAndGovernance)}`,
    `<h3>Additional Information</h3><p>${esc(p.additionalInformation?.trim() || NP)}</p>`,
  ].join('');

  return `<section class="brand"><h2>${esc(brand.displayName)}</h2>${meta}${sections}</section>`;
}

const HTML_STYLE = `<style>
body{font-family:sans-serif;max-width:960px;margin:2rem auto;color:#111}
h1{border-bottom:2px solid #333;padding-bottom:.5rem}
h2{margin-top:2rem;border-bottom:1px solid #ccc}
table{border-collapse:collapse;width:100%;margin:.5rem 0 1rem}
th,td{border:1px solid #ccc;padding:.4rem .6rem;text-align:left}
th{background:#f5f5f5}
.no-entries{color:#888;font-style:italic}
hr{margin:2rem 0}
</style>`;

export function toHtml(brand: ReportBrandRow): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${esc(brand.displayName)} — DomainOps Report</title>${HTML_STYLE}</head><body>${htmlBrand(brand)}</body></html>`;
}

export function toHtmlAll(brands: ReportBrandRow[]): string {
  const body = brands
    .map(htmlBrand)
    .join('<hr>');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>DomainOps Brand Report</title>${HTML_STYLE}</head><body><h1>DomainOps Brand Report</h1>${body}</body></html>`;
}

// ── Plain text helpers ────────────────────────────────────────────────────────

function txtPersonTable(rows: PersonRow[]): string {
  if (!rows.length) return NE;
  return rows
    .map(
      (r, i) =>
        `  [${i + 1}] ${val(r.name)} | ${val(r.title)} | ${val(r.department)} | ${val(r.primaryAssignment)} | ${val(r.domainTasks)} | ${val(r.estimatedPercent)}`,
    )
    .join('\n');
}

function txtOwnershipTable(rows: OwnershipAnswer[]): string {
  if (!rows.length) return NE;
  return rows
    .map((r, i) => `  [${i + 1}] Responsible: ${val(r.responsible)} | Comments: ${val(r.comments)}`)
    .join('\n');
}

function txtSupplierTable(rows: SupplierRow[]): string {
  if (!rows.length) return NE;
  return rows
    .map(
      (r, i) =>
        `  [${i + 1}] ${val(r.registryName)} | ${val(r.type)} | ${val(r.primaryContact)}`,
    )
    .join('\n');
}

function txtGovernanceTable(rows: GovernanceAnswer[]): string {
  if (!rows.length) return NE;
  return rows
    .map((r, i) => `  [${i + 1}] Responsible: ${val(r.responsible)} | Comments: ${val(r.comments)}`)
    .join('\n');
}

function txtBrand(brand: ReportBrandRow): string {
  const divider = '─'.repeat(60);
  const p = brand.payload;
  const lines: string[] = [
    divider,
    brand.displayName.toUpperCase(),
    divider,
    `Status:        ${brand.status}`,
    `Completed by:  ${val(brand.completedBy)}`,
    `Submitted at:  ${fmtDate(brand.submittedAt)}`,
    `Last updated:  ${fmtDate(brand.updatedAt)}`,
    '',
  ];

  if (!p) {
    lines.push('No questionnaire data submitted.');
    return lines.join('\n');
  }

  lines.push(
    'DOMAIN PERSONNEL',
    txtPersonTable(p.domainPersonnel),
    '',
    'TECHNICAL RESOURCES',
    txtPersonTable(p.technicalResources),
    '',
    'OPERATIONAL OWNERSHIP',
    txtOwnershipTable(p.operationalOwnership),
    '',
    'REGISTRIES & SUPPLIERS',
    txtSupplierTable(p.registriesAndSuppliers),
    '',
    'COMMUNICATION & GOVERNANCE',
    txtGovernanceTable(p.communicationAndGovernance),
    '',
    'ADDITIONAL INFORMATION',
    `  ${p.additionalInformation?.trim() || NP}`,
  );

  return lines.join('\n');
}

export function toPlainText(brand: ReportBrandRow): string {
  return txtBrand(brand);
}

export function toPlainTextAll(brands: ReportBrandRow[]): string {
  const title = 'DOMAINOPS BRAND REPORT';
  const top = '═'.repeat(60);
  return [top, title, top, '', ...brands.map(txtBrand)].join('\n');
}
