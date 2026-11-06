'use client';

import { useEffect, useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import { ErrorState } from '@/components/error-state';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageShell } from '@/components/page-shell';
import { getHotelById } from '@/lib/api';
import type { Hotel } from '@/types/hotel';

export default function HotelDetailPage({ params }: { params: { id: string } }) {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLookAlikes, setShowLookAlikes] = useState(false);

  const loadHotel = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHotelById(params.id);
      setHotel(data);
    } catch {
      setError('Unable to load hotel details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotel();
  }, [params.id]);

  if (loading) return <PageShell title="Hotel details" description="Loading hotel record..."><LoadingSkeleton rows={4} /></PageShell>;
  if (error) return <PageShell title="Hotel details" description="Review the selected hotel."><ErrorState message={error} onRetry={loadHotel} /></PageShell>;
  if (!hotel) return <PageShell title="Hotel details" description="No hotel found."><div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No hotel matched the supplied identifier.</div></PageShell>;

  const bestOffer = hotel.best_offer || hotel.supplier_offers[0];

  return (
    <PageShell
      title={hotel.hotel_name}
      description="Complete hotel overview and supplier comparison."
      actions={
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          <input type="checkbox" checked={showLookAlikes} onChange={() => setShowLookAlikes((value) => !value)} />
          Show look-alike hotels
        </label>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{hotel.hotel_name}</div>
              <div className="mt-2 flex items-center gap-3 text-slate-600">
                <span className="inline-flex items-center gap-1"><MapPin size={16} /> {hotel.city}</span>
                <span className="inline-flex items-center gap-1"><Star size={16} /> {hotel.star_rating || hotel.stars || 0}★</span>
              </div>
            </div>
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-right">
              <div className="text-xs uppercase tracking-wide text-emerald-700">Best offer</div>
              <div className="text-2xl font-bold text-emerald-700">₹{bestOffer?.price ?? 0}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Address</div><div className="mt-2 text-sm">{hotel.address}</div></div>
            <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Pincode</div><div className="mt-2 text-sm">{hotel.pincode || 'N/A'}</div></div>
            <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Coordinates</div><div className="mt-2 text-sm">{hotel.mean_lat?.toFixed(3)}, {hotel.mean_lon?.toFixed(3)}</div></div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-4 text-xl font-semibold text-slate-900">All supplier offers</div>
            <div className="space-y-3">
              {hotel.supplier_offers.map((offer, index) => (
                <div key={`${offer.supplier}-${index}`} className={`rounded-xl border p-4 ${offer.supplier === bestOffer?.supplier ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{offer.supplier}</div>
                      <div className="text-sm text-slate-500">Member row id: {offer.supplier}</div>
                    </div>
                    {offer.supplier === bestOffer?.supplier && <span className="badge border-emerald-200 bg-emerald-100 text-emerald-700">Recommended</span>}
                  </div>
                  <div className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                    <div>Price: ₹{offer.price}</div>
                    <div>Cancellation: {offer.cancellation_policy}</div>
                    <div>Payment: {offer.payment_terms}</div>
                    <div>Reliability: {offer.supplier_reliability}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="text-xl font-semibold text-slate-900">Recommendation</div>
            <div className="mt-4 rounded-xl border border-primary-200 bg-primary-50 p-4">
              <div className="text-sm text-primary-700">Recommended supplier</div>
              <div className="mt-1 text-xl font-bold text-slate-900">{bestOffer?.supplier}</div>
              <div className="mt-2 text-sm text-slate-700">{hotel.best_offer_explanation || 'This offer balances price, flexibility, and reliability.'}</div>
            </div>
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Matching decisions</div>
              <p className="mt-2">Hotel records were merged based on name, address, city, and GPS alignment. The best offer is selected using weighted scoring across cost, cancellation flexibility, payment terms, and supplier reliability.</p>
            </div>
          </div>
        </div>

        {showLookAlikes && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
            Additional look-alike candidates are available for human review under the review queue.
          </div>
        )}
      </div>
    </PageShell>
  );
}
