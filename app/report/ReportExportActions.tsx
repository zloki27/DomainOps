'use client';

import { useState } from 'react';

interface ReportExportActionsProps {
  markdown: string;
  html: string;
  plainText: string;
  compact?: boolean;
}

type CopyState = 'idle' | 'copied' | 'fallback';

export default function ReportExportActions({
  markdown,
  html,
  plainText,
  compact = false,
}: ReportExportActionsProps) {
  const [mdState, setMdState] = useState<CopyState>('idle');
  const [htmlState, setHtmlState] = useState<CopyState>('idle');
  const [txtState, setTxtState] = useState<CopyState>('idle');

  function flash(set: (s: CopyState) => void, state: CopyState) {
    set(state);
    setTimeout(() => set('idle'), 2200);
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    flash(setMdState, 'copied');
  }

  async function copyHtml() {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([plainText], { type: 'text/plain' }),
          }),
        ]);
        flash(setHtmlState, 'copied');
        return;
      } catch {
        // fall through to fallback
      }
    }
    await navigator.clipboard.writeText(plainText);
    flash(setHtmlState, 'fallback');
  }

  async function copyPlainText() {
    await navigator.clipboard.writeText(plainText);
    flash(setTxtState, 'copied');
  }

  const label = {
    md: 'Markdown',
    html: 'HTML table',
    txt: 'Plain text',
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Markdown — primary */}
      <button
        onClick={copyMarkdown}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border cursor-pointer transition-all duration-150 bg-[var(--color-primary)] text-white border-transparent hover:opacity-90 active:opacity-80"
      >
        {mdState === 'copied' ? 'Copied!' : `Copy ${label.md}`}
      </button>

      {/* HTML table */}
      <div className="inline-flex flex-col items-start gap-0.5">
        <button
          onClick={copyHtml}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border cursor-pointer transition-all duration-150 bg-white text-stone-700 border-stone-200 hover:bg-stone-50 active:bg-stone-100"
        >
          {htmlState === 'copied'
            ? 'Copied!'
            : htmlState === 'fallback'
              ? 'Copied (plain text)'
              : `Copy ${label.html}`}
        </button>
        {htmlState === 'fallback' && (
          <span className="text-xs text-amber-600 leading-tight max-w-[220px]">
            Rich HTML clipboard not supported in this browser — plain text copied instead.
          </span>
        )}
      </div>

      {/* Plain text */}
      <button
        onClick={copyPlainText}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border cursor-pointer transition-all duration-150 bg-white text-stone-700 border-stone-200 hover:bg-stone-50 active:bg-stone-100"
      >
        {txtState === 'copied' ? 'Copied!' : `Copy ${label.txt}`}
      </button>
    </div>
  );
}
