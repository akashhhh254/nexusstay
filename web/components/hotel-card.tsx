import Link from 'next/link';
import type { Hotel } from '@/types/hotel';

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const bestOffer = hotel.best_offer || hotel.supplier_offers[0];
  const bestPrice = bestOffer?.price ?? 0;

  return (
    <Link href={`/hotels/${hotel.id}`} className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-slate-900">{hotel.hotel_name}</div>
          <div className="mt-1 text-sm text-slate-500">{hotel.city}</div>
        </div>
        <span className="badge border-emerald-200 bg-emerald-50 text-emerald-700">Best value</span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>{hotel.address}</p>
        <div className="flex items-center justify-between">
          <span>Star rating</span>
          <span className="font-semibold text-slate-800">{hotel.star_rating || 0}★</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Offers</span>
          <span className="font-semibold text-slate-800">{hotel.supplier_offers.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Best offer</span>
          <span className="font-semibold text-primary-600">₹{bestPrice}</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
        <div className="font-medium text-slate-900">Why this offer?</div>
        <p className="mt-1 line-clamp-3">{hotel.best_offer_explanation || 'Recommended based on price, flexibility, and reliability.'}</p>
      </div>
    </Link>
  );
}
