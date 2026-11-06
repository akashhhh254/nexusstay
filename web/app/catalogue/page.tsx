'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ErrorState } from '@/components/error-state';
import { HotelCard } from '@/components/hotel-card';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageShell } from '@/components/page-shell';
import { getCatalogue } from '@/lib/api';
import type { Hotel } from '@/types/hotel';

export default function CataloguePage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [query, setQuery] = useState('');
  const [showLookAlikes, setShowLookAlikes] = useState(false);

  const loadCatalogue = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCatalogue(city, query);
      setHotels(data);
    } catch {
      setError('Unable to load the merged catalogue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogue();
  }, [city, query]);

  const visibleHotels = useMemo(() => {
    if (showLookAlikes) return hotels;
    return hotels.filter((hotel) => hotel.id !== 'hotel-2');
  }, [hotels, showLookAlikes]);

  return (
    <PageShell
      title="Merged hotel catalogue"
      description="See the consolidated hotel inventory with best-value offers and supplier comparisons."
      actions={
        <div className="flex flex-col gap-3 sm:flex-row">
          <select value={city} onChange={(event) => setCity(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="">All cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bengaluru">Bengaluru</option>
          </select>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-500">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hotel" className="w-44 bg-transparent text-sm outline-none" />
          </div>
          <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <input type="checkbox" checked={showLookAlikes} onChange={() => setShowLookAlikes((value) => !value)} />
            Show look-alikes
          </label>
        </div>
      }
    >
      {loading ? <LoadingSkeleton rows={4} /> : error ? <ErrorState message={error} onRetry={loadCatalogue} /> : visibleHotels.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No hotels match the current filters.</div> : (
        <div className="card-grid">
          {visibleHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
