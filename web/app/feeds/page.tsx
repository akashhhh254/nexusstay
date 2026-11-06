'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ErrorState } from '@/components/error-state';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageShell } from '@/components/page-shell';
import { getSupplierFeeds } from '@/lib/api';
import type { FeedRow } from '@/types/hotel';

export default function FeedsPage() {
  const [supplier, setSupplier] = useState('A');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<FeedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeeds = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSupplierFeeds(supplier, query);
      setRows(data);
    } catch {
      setError('Unable to load supplier feeds right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeeds();
  }, [supplier, query]);

  const filteredRows = useMemo(() => rows, [rows]);

  return (
    <PageShell
      title="Supplier feeds"
      description="Monitor raw hotel listings from each supplier before they are matched and merged."
      actions={
        <div className="flex flex-col gap-3 sm:flex-row">
          <select value={supplier} onChange={(event) => setSupplier(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="A">Supplier A</option>
            <option value="B">Supplier B</option>
            <option value="C">Supplier C</option>
          </select>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-500">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-44 bg-transparent text-sm outline-none" placeholder="Search hotels" />
          </div>
        </div>
      }
    >
      {loading ? <LoadingSkeleton rows={4} /> : error ? <ErrorState message={error} onRetry={loadFeeds} /> : filteredRows.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No matching supplier rows were found.</div> : (
        <div className="table-card">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Hotel</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">Address</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Cancellation</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{row.name}</div>
                      <div className="text-xs text-slate-500">{row.supplier}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.city}</td>
                    <td className="px-4 py-3 text-slate-600">{row.address}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">₹{row.price ?? 0}</td>
                    <td className="px-4 py-3 text-slate-600">{row.cancellation_policy ?? 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.payment_terms ?? 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageShell>
  );
}
