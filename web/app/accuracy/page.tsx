'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ErrorState } from '@/components/error-state';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageShell } from '@/components/page-shell';
import { getMetrics } from '@/lib/api';
import type { Metrics } from '@/types/hotel';

export default function AccuracyPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMetrics();
      setMetrics(data);
    } catch {
      setError('Unable to load performance metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const chartData = metrics ? [
    { name: 'Precision', baseline: metrics.baseline_precision, engine: metrics.precision },
    { name: 'Recall', baseline: metrics.baseline_recall, engine: metrics.recall },
    { name: 'F1', baseline: metrics.baseline_f1_score, engine: metrics.f1_score },
  ] : [];

  return (
    <PageShell
      title="Accuracy dashboard"
      description="Compare the naive baseline with the current matching engine using API-backed performance metrics."
    >
      {loading ? <LoadingSkeleton rows={4} /> : error ? <ErrorState message={error} onRetry={loadMetrics} /> : !metrics ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No metrics available.</div> : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Precision" value={metrics.precision.toFixed(2)} />
            <MetricCard label="Recall" value={metrics.recall.toFixed(2)} />
            <MetricCard label="F1 Score" value={metrics.f1_score.toFixed(2)} />
            <MetricCard label="Look-alike false merges" value={String(metrics.look_alike_false_merges)} />
            <MetricCard label="LLM calls" value={String(metrics.llm_calls)} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-4 text-lg font-semibold text-slate-900">F1 score comparison</div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 1]} tickFormatter={(value) => value.toFixed(2)} />
                  <Tooltip formatter={(value: number) => Number(value).toFixed(2)} />
                  <Bar dataKey="baseline" fill="#cbd5e1" name="Naive baseline" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="engine" fill="#2c6bf2" name="Engine" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
    </div>
  );
}
