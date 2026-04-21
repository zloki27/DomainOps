'use client';

export interface ColumnDef<T extends object> {
  key: Extract<keyof T, string>;
  label: string;
  placeholder?: string;
  multiline?: boolean;
}

interface Props<T extends object> {
  title: string;
  intro: string;
  columns: ColumnDef<T>[];
  rows: T[];
  onChange: (rows: T[]) => void;
  emptyRow: () => T;
  disabled?: boolean;
}

export default function RepeatableSection<T extends object>({
  title,
  intro,
  columns,
  rows,
  onChange,
  emptyRow,
  disabled = false,
}: Props<T>) {
  function update(i: number, key: Extract<keyof T, string>, value: string) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)) as T[]);
  }
  function add() {
    onChange([...rows, emptyRow()]);
  }
  function remove(i: number) {
    onChange(rows.filter((_, idx) => idx !== i) as T[]);
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-[#1C1917]">{title}</h2>
        <p className="text-sm text-[#44403C] mt-1">{intro}</p>
      </div>

      <div className="space-y-4">
        {rows.length === 0 && (
          <p className="text-sm text-stone-400 italic py-2">No rows yet. Add one below.</p>
        )}
        {rows.map((row, i) => (
          <div
            key={i}
            className="bg-stone-50 rounded-xl border border-stone-100 p-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {columns.map(col => {
                const rawValue = row[col.key];
                const fieldValue = typeof rawValue === 'string' ? rawValue : '';

                return (
                <div key={col.key} className={col.multiline ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-medium text-[#44403C] mb-1">
                    {col.label}
                  </label>
                  {col.multiline ? (
                    <textarea
                      value={fieldValue}
                      placeholder={col.placeholder}
                      onChange={e => update(i, col.key, e.target.value)}
                      disabled={disabled}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white resize-y focus:outline-none focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10 disabled:bg-stone-100 disabled:text-stone-400 transition-colors"
                    />
                  ) : (
                    <input
                      type="text"
                      value={fieldValue}
                      placeholder={col.placeholder}
                      onChange={e => update(i, col.key, e.target.value)}
                      disabled={disabled}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10 disabled:bg-stone-100 disabled:text-stone-400 transition-colors"
                    />
                  )}
                </div>
              )})}
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="mt-3 text-xs text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Remove row
              </button>
            )}
          </div>
        ))}
      </div>

      {!disabled && (
        <button
          type="button"
          onClick={add}
          className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#CA8A04] hover:text-[#A16207] transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Add row
        </button>
      )}
    </section>
  );
}
