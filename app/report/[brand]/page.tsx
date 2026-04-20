export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBrandWithStatus } from '@/lib/report';
import { OWNERSHIP_QUESTIONS, GOVERNANCE_QUESTIONS } from '@/lib/questions';
import type { PersonRow, OwnershipAnswer, SupplierRow, GovernanceAnswer, ReportBrandRow } from '@/lib/types';
import PurgeButton from '../PurgeButton';

function fmt(date: Date | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function val(v: string | undefined | null, fallback = 'Not provided') {
  return v && v.trim() ? v.trim() : fallback;
}

function statusBadge(status: ReportBrandRow['status']) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  if (status === 'Submitted') return <span className={`${base} bg-emerald-100 text-emerald-800`}>Submitted</span>;
  if (status === 'In progress') return <span className={`${base} bg-amber-100 text-amber-800`}>In progress</span>;
  return <span className={`${base} bg-stone-100 text-stone-600`}>Not started</span>;
}

function SectionCard({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <h3 className="text-base font-bold text-[var(--color-primary)] mb-1">{title}</h3>
      {intro && <p className="text-sm text-stone-500 mb-4">{intro}</p>}
      {children}
    </div>
  );
}

function PersonRows({ rows }: { rows: PersonRow[] }) {
  if (!rows || rows.length === 0) {
    return (
      <div>
        <p className="text-sm text-stone-400 italic">No entries provided</p>
        <p className="text-xs text-stone-400 mt-1">This typically indicates missing ownership, process, or resource.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-2 gap-x-8 gap-y-2 bg-stone-50 rounded-lg px-4 py-3 border border-stone-100">
          <Field label="Name" value={val(row.name)} />
          <Field label="Title" value={val(row.title)} />
          <Field label="Department / Team" value={val(row.department)} />
          <Field label="Primary assignment" value={val(row.primaryAssignment)} />
          <div className="col-span-2">
            <Field label="Domain-related tasks" value={val(row.domainTasks)} />
          </div>
          <Field label="Estimated % on domain work" value={val(row.estimatedPercent)} />
        </div>
      ))}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  const isEmpty = value === 'Not provided' || value === 'No notes provided';
  return (
    <div>
      <p className="text-xs text-stone-400 mb-0.5">{label}</p>
      <p className={`text-sm ${isEmpty ? 'text-stone-400 italic' : 'text-stone-900'}`}>{value}</p>
    </div>
  );
}

function OwnershipRows({ answers, questions }: { answers: OwnershipAnswer[]; questions: string[] }) {
  return (
    <div className="space-y-3">
      {questions.map((q, i) => {
        const a = answers?.[i];
        const responsible = val(a?.responsible);
        const comments = val(a?.comments, 'No notes provided');
        return (
          <div key={i} className="bg-stone-50 rounded-lg px-4 py-3 border border-stone-100">
            <p className="text-xs font-medium text-stone-500 mb-2">{q}</p>
            <div className="grid grid-cols-2 gap-x-8">
              <Field label="Responsible" value={responsible} />
              <Field label="Notes" value={comments} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GovernanceRows({ answers, questions }: { answers: GovernanceAnswer[]; questions: string[] }) {
  return (
    <div className="space-y-3">
      {questions.map((q, i) => {
        const a = answers?.[i];
        const responsible = val(a?.responsible);
        const comments = val(a?.comments, 'No notes provided');
        return (
          <div key={i} className="bg-stone-50 rounded-lg px-4 py-3 border border-stone-100">
            <p className="text-xs font-medium text-stone-500 mb-2">{q}</p>
            <div className="grid grid-cols-2 gap-x-8">
              <Field label="Responsible" value={responsible} />
              <Field label="Notes" value={comments} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SupplierRows({ rows }: { rows: SupplierRow[] }) {
  if (!rows || rows.length === 0) {
    return (
      <div>
        <p className="text-sm text-stone-400 italic">No entries provided</p>
        <p className="text-xs text-stone-400 mt-1">This typically indicates missing ownership, process, or resource.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-3 gap-x-8 bg-stone-50 rounded-lg px-4 py-3 border border-stone-100">
          <Field label="Registry / Wholesale registrar" value={val(row.registryName)} />
          <Field label="Type" value={val(row.type)} />
          <Field label="Primary contact" value={val(row.primaryContact)} />
        </div>
      ))}
    </div>
  );
}

export default async function ReportBrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const row = await getBrandWithStatus(slug);
  if (!row) notFound();

  const p = row.payload;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-12">

        {/* Back + actions */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/report"
            className="text-sm text-stone-500 hover:text-stone-700 cursor-pointer transition-colors duration-150"
          >
            ← All brands
          </Link>
          {row.status !== 'Not started' && (
            <PurgeButton slug={row.slug} displayName={row.displayName} variant="full" />
          )}
        </div>

        {/* Brand header */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8 flex items-start justify-between" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center gap-4">
            {row.logoPath ? (
              <Image
                src={row.logoPath}
                alt={row.displayName}
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                unoptimized
              />
            ) : (
              <span className="text-2xl font-bold text-[var(--color-primary)]">{row.displayName}</span>
            )}
            {statusBadge(row.status)}
          </div>
          <div className="text-right text-sm text-stone-500 space-y-1">
            {row.completedBy && <p><span className="text-stone-400">Completed by</span> {row.completedBy}</p>}
            {row.updatedAt && <p><span className="text-stone-400">Last updated</span> {fmt(row.updatedAt)}</p>}
            {row.submittedAt && <p><span className="text-stone-400">Submitted</span> {fmt(row.submittedAt)}</p>}
          </div>
        </div>

        {/* No data state */}
        {!p && (
          <div className="bg-white rounded-xl border border-stone-200 p-10 text-center" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-stone-400 italic">No response data recorded for this brand.</p>
          </div>
        )}

        {/* Sections */}
        {p && (
          <>
            <SectionCard
              title="Domain Personnel"
              intro="All individuals with any domain-related responsibility — operational, technical, commercial, or administrative."
            >
              <PersonRows rows={p.domainPersonnel} />
            </SectionCard>

            <SectionCard
              title="Technical Resources"
              intro="Developers or technical staff working on domain-related tasks."
            >
              <PersonRows rows={p.technicalResources} />
            </SectionCard>

            <SectionCard
              title="Operational Ownership"
              intro="Who in the brand is responsible for each operational area."
            >
              <OwnershipRows answers={p.operationalOwnership} questions={OWNERSHIP_QUESTIONS} />
            </SectionCard>

            <SectionCard
              title="Registries &amp; Suppliers"
              intro="All registries and wholesale registrars the brand has a direct relationship with."
            >
              <SupplierRows rows={p.registriesAndSuppliers} />
            </SectionCard>

            <SectionCard
              title="Communication &amp; Governance"
              intro="How the brand communicates and escalates domain operations matters."
            >
              <GovernanceRows answers={p.communicationAndGovernance} questions={GOVERNANCE_QUESTIONS} />
            </SectionCard>

            <SectionCard title="Additional Information">
              {p.additionalInformation && p.additionalInformation.trim() ? (
                <p className="text-sm text-stone-800 whitespace-pre-wrap">{p.additionalInformation}</p>
              ) : (
                <div>
                  <p className="text-sm text-stone-400 italic">No additional information provided.</p>
                  <p className="text-xs text-stone-400 mt-1">This typically indicates missing ownership, process, or resource.</p>
                </div>
              )}
            </SectionCard>
          </>
        )}
      </div>
    </div>
  );
}
