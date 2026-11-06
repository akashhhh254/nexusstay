'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ErrorState } from '@/components/error-state';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageShell } from '@/components/page-shell';
import { ReviewCard } from '@/components/review-card';
import { getReviewQueue, submitReviewDecision } from '@/lib/api';
import type { ReviewItem } from '@/types/hotel';

export default function ReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReviewQueue();
      const saved = JSON.parse(localStorage.getItem('nexusstay-review-decisions') || '{}');
      const merged = data.map((item) => ({ ...item, decision: saved[item.id] ?? item.decision ?? null }));
      setItems(merged);
    } catch {
      setError('Unable to load the review queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const saveDecision = async (id: string, approved: boolean) => {
    const saved = JSON.parse(localStorage.getItem('nexusstay-review-decisions') || '{}');
    saved[id] = approved ? 'approved' : 'rejected';
    localStorage.setItem('nexusstay-review-decisions', JSON.stringify(saved));

    setItems((current) => current.map((item) => (item.id === id ? { ...item, decision: approved ? 'approved' : 'rejected' } : item)));

    try {
      await submitReviewDecision({ id, approved });
    } catch {
      setError('Decision saved locally; API sync failed.');
    }
  };

  return (
    <PageShell
      title="Human review queue"
      description="Evaluate uncertain hotel pairs and keep decisions visible after refresh."
      actions={
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Saved decisions persist on refresh</span>
        </div>
      }
    >
      {loading ? <LoadingSkeleton rows={3} /> : error ? <ErrorState message={error} onRetry={loadQueue} /> : items.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">The review queue is empty.</div> : (
        <div className="grid gap-5">
          {items.map((item) => (
            <ReviewCard key={item.id} item={item} onApprove={(id) => saveDecision(id, true)} onReject={(id) => saveDecision(id, false)} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
