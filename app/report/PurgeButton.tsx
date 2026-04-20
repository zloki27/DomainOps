'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface PurgeButtonProps {
  slug: string;
  displayName: string;
  variant?: 'icon' | 'full';
}

export default function PurgeButton({ slug, displayName, variant = 'full' }: PurgeButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handlePurge() {
    setLoading(true);
    try {
      await fetch(`/api/report/${slug}/purge`, { method: 'DELETE' });
      router.refresh();
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-sm text-stone-600">Purge {displayName}?</span>
        <button
          onClick={handlePurge}
          disabled={loading}
          className="text-sm font-medium text-red-700 hover:text-red-900 cursor-pointer transition-colors duration-150 disabled:opacity-50"
        >
          {loading ? 'Purging…' : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-sm text-stone-500 hover:text-stone-700 cursor-pointer transition-colors duration-150"
        >
          Cancel
        </button>
      </span>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={() => setConfirming(true)}
        title={`Purge ${displayName}`}
        className="p-1.5 text-stone-400 hover:text-red-600 cursor-pointer transition-colors duration-150 rounded"
      >
        <Trash2 size={15} />
      </button>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer transition-all duration-150"
    >
      <Trash2 size={14} />
      Purge
    </button>
  );
}
