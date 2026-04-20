'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BrandDef } from '@/lib/brands';
import type { PersonRow, QuestionnairePayload, SupplierRow } from '@/lib/types';
import {
  emptyGovernanceAnswer,
  emptyOwnershipAnswer,
  emptyPayload,
  emptyPersonRow,
  emptySupplierRow,
} from '@/lib/payload';
import { GOVERNANCE_QUESTIONS, OWNERSHIP_QUESTIONS } from '@/lib/questions';
import RepeatableSection, { type ColumnDef } from '@/app/components/RepeatableSection';
import FixedQuestionSection from '@/app/components/FixedQuestionSection';

const PERSON_COLS: ColumnDef<PersonRow>[] = [
  { key: 'name', label: 'Name', placeholder: 'Anna Meier' },
  { key: 'title', label: 'Title', placeholder: 'Hostmaster' },
  { key: 'department', label: 'Department / Team', placeholder: 'Domain Operations' },
  { key: 'primaryAssignment', label: 'Primary assignment', placeholder: 'Domain operations' },
  {
    key: 'domainTasks',
    label: 'Domain-related tasks they perform',
    placeholder: 'Primary contact for restores, transfers, registrant changes…',
    multiline: true,
  },
  { key: 'estimatedPercent', label: 'Estimated % on domain work', placeholder: '100' },
];

const SUPPLIER_COLS: ColumnDef<SupplierRow>[] = [
  { key: 'registryName', label: 'Registry / Wholesale registrar', placeholder: 'DENIC (.de)' },
  { key: 'type', label: 'Type (direct accreditation / wholesale)', placeholder: 'Direct accreditation' },
  { key: 'primaryContact', label: 'Primary contact (name, title)', placeholder: 'Anna Meier, Hostmaster' },
];

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type PageStatus = 'loading' | 'ready' | 'submitted';

function padArray<T>(arr: T[], count: number, empty: () => T): T[] {
  if (arr.length >= count) return arr;
  const result = [...arr];
  while (result.length < count) result.push(empty());
  return result;
}

interface ApiResponse {
  status: string;
  completedBy: string;
  questionnaireDate: string;
  payload: QuestionnairePayload;
  submittedAt: string | null;
}

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === 'idle') return null;
  const map: Record<Exclude<SaveState, 'idle'>, string> = {
    saving: 'text-stone-400',
    saved: 'text-emerald-600',
    error: 'text-red-500',
  };
  const label: Record<Exclude<SaveState, 'idle'>, string> = {
    saving: 'Saving…',
    saved: 'Saved',
    error: 'Save failed',
  };
  return (
    <span className={`text-xs font-medium ${map[state]}`}>{label[state]}</span>
  );
}

interface BrandHeaderProps {
  brand: BrandDef;
  saveState: SaveState | null;
}

function BrandHeader({ brand, saveState }: BrandHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-[800px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-[#44403C] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All brands
        </Link>

        <div className="flex items-center gap-3">
          {brand.logoPath ? (
            <Image
              src={brand.logoPath}
              alt={brand.displayName}
              width={120}
              height={36}
              className="object-contain max-h-9"
              priority
            />
          ) : (
            <span className="text-lg font-semibold text-[#1C1917]">{brand.displayName}</span>
          )}
        </div>

        <div className="min-w-[64px] text-right">
          {saveState !== null && <SaveIndicator state={saveState} />}
        </div>
      </div>
    </header>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-[var(--shadow-md)] p-6 mb-6">
      {children}
    </div>
  );
}

export default function BrandForm({ brand }: { brand: BrandDef }) {
  const [pageStatus, setPageStatus] = useState<PageStatus>('loading');
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const [completedBy, setCompletedBy] = useState('');
  const [questionnaireDate, setQuestionnaireDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [payload, setPayload] = useState<QuestionnairePayload>(() => emptyPayload());

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    fetch(`/api/brands/${brand.slug}`)
      .then(r => r.json())
      .then((data: ApiResponse | null) => {
        if (data) {
          setCompletedBy(data.completedBy ?? '');
          setQuestionnaireDate(
            data.questionnaireDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
          );
          const p: QuestionnairePayload = data.payload ?? emptyPayload();
          p.operationalOwnership = padArray(
            p.operationalOwnership ?? [],
            OWNERSHIP_QUESTIONS.length,
            emptyOwnershipAnswer
          );
          p.communicationAndGovernance = padArray(
            p.communicationAndGovernance ?? [],
            GOVERNANCE_QUESTIONS.length,
            emptyGovernanceAnswer
          );
          p.domainPersonnel = p.domainPersonnel ?? [];
          p.technicalResources = p.technicalResources ?? [];
          p.registriesAndSuppliers = p.registriesAndSuppliers ?? [];
          p.additionalInformation = p.additionalInformation ?? '';
          setPayload(p);
          setPageStatus(data.status === 'SUBMITTED' ? 'submitted' : 'ready');
        } else {
          setPageStatus('ready');
        }
      })
      .catch(() => setPageStatus('ready'))
      .finally(() => {
        loaded.current = true;
      });
  }, [brand.slug]);

  const doSave = useCallback(
    async (cb: string, date: string, pl: QuestionnairePayload) => {
      setSaveState('saving');
      try {
        const res = await fetch(`/api/brands/${brand.slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completedBy: cb, questionnaireDate: date, payload: pl }),
        });
        if (res.status === 409) {
          setPageStatus('submitted');
          setSaveState('idle');
          return;
        }
        if (!res.ok) throw new Error();
        setSaveState('saved');
        setTimeout(() => setSaveState(s => (s === 'saved' ? 'idle' : s)), 2500);
      } catch {
        setSaveState('error');
      }
    },
    [brand.slug]
  );

  const scheduleAutosave = useCallback(
    (cb: string, date: string, pl: QuestionnairePayload) => {
      if (!loaded.current) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => doSave(cb, date, pl), 1500);
    },
    [doSave]
  );

  function handleCompletedByChange(v: string) {
    setCompletedBy(v);
    scheduleAutosave(v, questionnaireDate, payload);
  }

  function handleDateChange(v: string) {
    setQuestionnaireDate(v);
    scheduleAutosave(completedBy, v, payload);
  }

  function handlePayloadChange(patch: Partial<QuestionnairePayload>) {
    const next = { ...payload, ...patch };
    setPayload(next);
    scheduleAutosave(completedBy, questionnaireDate, next);
  }

  async function handleSubmit() {
    if (!completedBy.trim()) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveState('saving');
    try {
      const res = await fetch(`/api/brands/${brand.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedBy, questionnaireDate, payload }),
      });
      if (res.status === 409) {
        setPageStatus('submitted');
        setSaveState('idle');
        return;
      }
      if (!res.ok) throw new Error();
      setPageStatus('submitted');
      setSaveState('idle');
    } catch {
      setSaveState('error');
    }
  }

  if (pageStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#1C1917] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#44403C]">Loading…</p>
        </div>
      </div>
    );
  }

  if (pageStatus === 'submitted') {
    return (
      <div className="min-h-screen bg-[#FAFAF9]">
        <BrandHeader brand={brand} saveState={null} />
        <main className="max-w-[800px] mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-[var(--shadow-md)] p-10 text-center">
            <div className="w-14 h-14 bg-[#CA8A04] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-[#1C1917] mb-2">Response Submitted</h1>
            <p className="text-[#44403C] mb-1">
              This questionnaire has been submitted and is now locked.
            </p>
            {completedBy && (
              <p className="text-sm text-stone-400 mb-8">Submitted by {completedBy}</p>
            )}
            {!completedBy && <div className="mb-8" />}
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#1C1917] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#44403C] transition-colors cursor-pointer"
            >
              Back to brand selection
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const canSubmit = completedBy.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <BrandHeader brand={brand} saveState={saveState} />

      <main className="max-w-[800px] mx-auto px-6 py-8">
        {/* Metadata block */}
        <SectionCard>
          <h2 className="text-sm font-semibold text-[#44403C] uppercase tracking-wide mb-4">
            Questionnaire Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#44403C] mb-1">Brand</label>
              <div className="px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-[#1C1917] font-medium">
                {brand.displayName}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#44403C] mb-1">
                Completed by (name and title){' '}
                <span className="text-[#CA8A04]">*</span>
              </label>
              <input
                type="text"
                value={completedBy}
                onChange={e => handleCompletedByChange(e.target.value)}
                placeholder="e.g. Anna Meier, Hostmaster"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#44403C] mb-1">Date</label>
              <input
                type="date"
                value={questionnaireDate}
                onChange={e => handleDateChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10 transition-colors"
              />
            </div>
          </div>
        </SectionCard>

        {/* Section 1 – Domain Personnel */}
        <SectionCard>
          <RepeatableSection
            title="1. Domain Personnel"
            intro="List all individuals with any domain-related responsibility — operational, technical, commercial, or administrative."
            columns={PERSON_COLS}
            rows={payload.domainPersonnel}
            onChange={rows => handlePayloadChange({ domainPersonnel: rows })}
            emptyRow={emptyPersonRow}
          />
        </SectionCard>

        {/* Section 2 – Technical Resources */}
        <SectionCard>
          <RepeatableSection
            title="2. Technical Resources"
            intro="Which developers or technical staff work on domain-related tasks such as implementing registry changes, maintaining EPP integrations, or fixing domain-related issues?"
            columns={PERSON_COLS}
            rows={payload.technicalResources}
            onChange={rows => handlePayloadChange({ technicalResources: rows })}
            emptyRow={emptyPersonRow}
          />
        </SectionCard>

        {/* Section 3 – Operational Ownership */}
        <SectionCard>
          <FixedQuestionSection
            title="3. Operational Ownership"
            intro="For each case below, who in your brand is responsible? If no one, leave blank."
            questions={OWNERSHIP_QUESTIONS}
            answers={payload.operationalOwnership}
            onChange={answers => handlePayloadChange({ operationalOwnership: answers })}
          />
        </SectionCard>

        {/* Section 4 – Registries & Suppliers */}
        <SectionCard>
          <RepeatableSection
            title="4. Registries & Suppliers"
            intro="List all registries and wholesale registrars your brand has a direct relationship with."
            columns={SUPPLIER_COLS}
            rows={payload.registriesAndSuppliers}
            onChange={rows => handlePayloadChange({ registriesAndSuppliers: rows })}
            emptyRow={emptySupplierRow}
          />
        </SectionCard>

        {/* Section 5 – Communication & Governance */}
        <SectionCard>
          <FixedQuestionSection
            title="5. Communication & Governance"
            questions={GOVERNANCE_QUESTIONS}
            answers={payload.communicationAndGovernance}
            onChange={answers => handlePayloadChange({ communicationAndGovernance: answers })}
          />
        </SectionCard>

        {/* Section 6 – Additional Information */}
        <SectionCard>
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-[#1C1917]">6. Additional Information</h2>
            </div>
            <label className="block text-sm text-[#44403C] mb-2">
              Is there anything related to domain operations not covered above that you feel is
              important for us to know?
            </label>
            <textarea
              value={payload.additionalInformation}
              onChange={e => handlePayloadChange({ additionalInformation: e.target.value })}
              placeholder="Mention missing ownership, process pain, tooling gaps, or important exceptions here."
              rows={5}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg resize-y focus:outline-none focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10 transition-colors"
            />
          </section>
        </SectionCard>

        {/* Submit bar */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-[var(--shadow-md)] p-6 mb-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#1C1917]">Ready to submit?</p>
              <p className="text-xs text-[#44403C] mt-0.5">
                {canSubmit
                  ? 'All required fields are complete. Submission is final and cannot be edited.'
                  : 'Fill in "Completed by" before submitting.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || saveState === 'saving'}
              className="shrink-0 bg-[#CA8A04] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#A16207] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              {saveState === 'saving' ? 'Saving…' : 'Submit response'}
            </button>
          </div>
          {saveState === 'error' && (
            <p className="mt-3 text-sm text-red-500">
              Save failed — check your connection and try again.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
