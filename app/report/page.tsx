export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { getBrandsWithStatus } from '@/lib/report';
import { OWNERSHIP_QUESTIONS, GOVERNANCE_QUESTIONS } from '@/lib/questions';
import type { ReportBrandRow, PersonRow, OwnershipAnswer, SupplierRow, GovernanceAnswer } from '@/lib/types';
import PurgeButton from './PurgeButton';
import ReportExportActions from './ReportExportActions';
import { toMarkdownAll, toHtmlAll, toPlainTextAll } from '@/lib/report-export';

function statusBadge(status: ReportBrandRow['status']) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  if (status === 'Submitted') return <span className={`${base} bg-emerald-100 text-emerald-800`}>Submitted</span>;
  if (status === 'In progress') return <span className={`${base} bg-amber-100 text-amber-800`}>In progress</span>;
  return <span className={`${base} bg-stone-100 text-stone-600`}>Not started</span>;
}

function fmt(date: Date | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function BrandLogo({ row }: { row: ReportBrandRow }) {
  if (row.logoPath) {
    return (
      <Image
        src={row.logoPath}
        alt={row.displayName}
        width={80}
        height={28}
        className="h-7 w-auto object-contain"
        unoptimized
      />
    );
  }
  return <span className="font-semibold text-[var(--color-primary)]">{row.displayName}</span>;
}

function val(v: string | undefined | null, fallback = 'Not provided') {
  return v && v.trim() ? v.trim() : fallback;
}

function PersonTable({ rows, title }: { rows: PersonRow[]; title: string }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-stone-700 mb-1">{title}</h4>
        <p className="text-sm text-stone-400 italic">No entries provided</p>
        <p className="text-xs text-stone-400 mt-0.5">This typically indicates missing ownership, process, or resource.</p>
      </div>
    );
  }
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-stone-700 mb-2">{title}</h4>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm bg-stone-50 rounded-lg px-3 py-2.5 border border-stone-100">
            <div><span className="text-stone-400 text-xs">Name</span><p className="font-medium text-stone-900">{val(row.name)}</p></div>
            <div><span className="text-stone-400 text-xs">Title</span><p className="text-stone-800">{val(row.title)}</p></div>
            <div><span className="text-stone-400 text-xs">Department / Team</span><p className="text-stone-800">{val(row.department)}</p></div>
            <div><span className="text-stone-400 text-xs">Primary assignment</span><p className="text-stone-800">{val(row.primaryAssignment)}</p></div>
            <div className="col-span-2"><span className="text-stone-400 text-xs">Domain-related tasks</span><p className="text-stone-800">{val(row.domainTasks)}</p></div>
            <div><span className="text-stone-400 text-xs">Estimated % on domain work</span><p className="text-stone-800">{val(row.estimatedPercent)}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FixedQuestionList({ answers, questions, title }: { answers: (OwnershipAnswer | GovernanceAnswer)[]; questions: string[]; title: string }) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-stone-700 mb-2">{title}</h4>
      <div className="space-y-2">
        {questions.map((q, i) => {
          const a = answers?.[i];
          const responsible = val(a?.responsible);
          const comments = val(a?.comments, 'No notes provided');
          return (
            <div key={i} className="text-sm bg-stone-50 rounded-lg px-3 py-2.5 border border-stone-100">
              <p className="text-xs text-stone-400 mb-1">{q}</p>
              <p className="font-medium text-stone-900">{responsible}</p>
              {comments !== 'No notes provided' && <p className="text-stone-600 mt-0.5">{comments}</p>}
              {comments === 'No notes provided' && <p className="text-stone-400 italic">{comments}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SupplierTable({ rows }: { rows: SupplierRow[] }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-stone-700 mb-1">Registries &amp; Suppliers</h4>
        <p className="text-sm text-stone-400 italic">No entries provided</p>
        <p className="text-xs text-stone-400 mt-0.5">This typically indicates missing ownership, process, or resource.</p>
      </div>
    );
  }
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-stone-700 mb-2">Registries &amp; Suppliers</h4>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-x-6 text-sm bg-stone-50 rounded-lg px-3 py-2.5 border border-stone-100">
            <div><span className="text-stone-400 text-xs">Registry / Wholesale registrar</span><p className="font-medium text-stone-900">{val(row.registryName)}</p></div>
            <div><span className="text-stone-400 text-xs">Type</span><p className="text-stone-800">{val(row.type)}</p></div>
            <div><span className="text-stone-400 text-xs">Primary contact</span><p className="text-stone-800">{val(row.primaryContact)}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandSummaryBlock({ row }: { row: ReportBrandRow }) {
  const p = row.payload;
  return (
    <div className="border border-stone-200 rounded-xl p-6 bg-white" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <BrandLogo row={row} />
          {statusBadge(row.status)}
        </div>
        <Link href={`/report/${row.slug}`} className="text-sm text-[var(--color-cta)] hover:underline cursor-pointer">
          Full detail →
        </Link>
      </div>
      {!p ? (
        <p className="text-sm text-stone-400 italic">No response data recorded.</p>
      ) : (
        <>
          <PersonTable rows={p.domainPersonnel} title="Domain Personnel" />
          <PersonTable rows={p.technicalResources} title="Technical Resources" />
          <FixedQuestionList answers={p.operationalOwnership} questions={OWNERSHIP_QUESTIONS} title="Operational Ownership" />
          <SupplierTable rows={p.registriesAndSuppliers} />
          <FixedQuestionList answers={p.communicationAndGovernance} questions={GOVERNANCE_QUESTIONS} title="Communication &amp; Governance" />
          <div className="mb-2">
            <h4 className="text-sm font-semibold text-stone-700 mb-1">Additional Information</h4>
            {p.additionalInformation && p.additionalInformation.trim()
              ? <p className="text-sm text-stone-800 whitespace-pre-wrap">{p.additionalInformation}</p>
              : <p className="text-sm text-stone-400 italic">No additional information provided.</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default async function ReportPage() {
  const brands = await getBrandsWithStatus();

  const exportMd = toMarkdownAll(brands);
  const exportHtml = toHtmlAll(brands);
  const exportTxt = toPlainTextAll(brands);

  const submitted = brands.filter(b => b.status === 'Submitted').length;
  const inProgress = brands.filter(b => b.status === 'In progress').length;
  const notStarted = brands.filter(b => b.status === 'Not started').length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">Internal — Not for distribution</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-1">Report Overview</h1>
              <p className="text-stone-500">Domain Operations Discovery · All brands</p>
            </div>
            <ReportExportActions markdown={exportMd} html={exportHtml} plainText={exportTxt} compact />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl p-5 border border-stone-200" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-2xl font-bold text-emerald-700">{submitted}</p>
            <p className="text-sm text-stone-500 mt-0.5">Submitted</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-stone-200" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-2xl font-bold text-amber-700">{inProgress}</p>
            <p className="text-sm text-stone-500 mt-0.5">In progress</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-stone-200" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-2xl font-bold text-stone-600">{notStarted}</p>
            <p className="text-sm text-stone-500 mt-0.5">Not started</p>
          </div>
        </div>

        {/* Overview table */}
        <div className="bg-white rounded-xl border border-stone-200 mb-14 overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="text-left px-5 py-3 font-semibold text-stone-600">Brand</th>
                <th className="text-left px-5 py-3 font-semibold text-stone-600">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-stone-600">Completed by</th>
                <th className="text-left px-5 py-3 font-semibold text-stone-600">Last updated</th>
                <th className="text-left px-5 py-3 font-semibold text-stone-600">Submitted</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {brands.map((row, i) => (
                <tr key={row.slug} className={`border-b border-stone-100 last:border-0 ${i % 2 === 1 ? 'bg-stone-50/50' : 'bg-white'}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      {row.logoPath ? (
                        <Image src={row.logoPath} alt={row.displayName} width={64} height={22} className="h-5 w-auto object-contain" unoptimized />
                      ) : (
                        <span className="font-medium text-[var(--color-primary)]">{row.displayName}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">{statusBadge(row.status)}</td>
                  <td className="px-5 py-3 text-stone-700">{row.completedBy ?? <span className="text-stone-400">—</span>}</td>
                  <td className="px-5 py-3 text-stone-600">{fmt(row.updatedAt)}</td>
                  <td className="px-5 py-3 text-stone-600">{fmt(row.submittedAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/report/${row.slug}`}
                        className="text-xs font-medium text-[var(--color-cta)] hover:underline cursor-pointer"
                      >
                        View
                      </Link>
                      {row.status !== 'Not started' && (
                        <PurgeButton slug={row.slug} displayName={row.displayName} variant="icon" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Long-scroll read section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--color-primary)] mb-1">Full Response Summary</h2>
          <p className="text-sm text-stone-500 mb-8">All brands in order. Scroll to skim all responses.</p>
          <div className="space-y-8">
            {brands.map(row => (
              <BrandSummaryBlock key={row.slug} row={row} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
