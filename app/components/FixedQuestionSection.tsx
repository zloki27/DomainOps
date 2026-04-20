'use client';

interface Answer {
  responsible: string;
  comments: string;
}

interface Props {
  title: string;
  intro?: string;
  questions: string[];
  answers: Answer[];
  onChange: (answers: Answer[]) => void;
  disabled?: boolean;
}

export default function FixedQuestionSection({
  title,
  intro,
  questions,
  answers,
  onChange,
  disabled = false,
}: Props) {
  function update(i: number, field: 'responsible' | 'comments', value: string) {
    onChange(answers.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)));
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-[#1C1917]">{title}</h2>
        {intro && <p className="text-sm text-[#44403C] mt-1">{intro}</p>}
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div
            key={i}
            className="bg-stone-50 rounded-xl border border-stone-100 p-5"
          >
            <p className="text-sm font-medium text-[#1C1917] mb-3">{q}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#44403C] mb-1">
                  Who is responsible? (name, title, department)
                </label>
                <input
                  type="text"
                  value={answers[i]?.responsible ?? ''}
                  placeholder="e.g. Anna Meier, Hostmaster, Domain Operations"
                  onChange={e => update(i, 'responsible', e.target.value)}
                  disabled={disabled}
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10 disabled:bg-stone-100 disabled:text-stone-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#44403C] mb-1">
                  Comments / notes
                </label>
                <textarea
                  value={answers[i]?.comments ?? ''}
                  placeholder="Optional notes"
                  onChange={e => update(i, 'comments', e.target.value)}
                  disabled={disabled}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white resize-none focus:outline-none focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10 disabled:bg-stone-100 disabled:text-stone-400 transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
