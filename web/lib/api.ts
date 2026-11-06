import { mockCatalogue, mockFeedRows, mockMetrics, mockReviewQueue } from '@/lib/mock-data';
import type { FeedRow, Hotel, Metrics, ReviewItem } from '@/types/hotel';

const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchWithFallback<T>(endpoint: string, fallback: T): Promise<T> {
  if (!apiBase) {
    return fallback;
  }

  try {
    const response = await fetch(`${apiBase}${endpoint}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getSupplierFeeds(supplier?: string, q?: string): Promise<FeedRow[]> {
  if (!apiBase) {
    const rows = supplier ? mockFeedRows[supplier as keyof typeof mockFeedRows] || [] : Object.values(mockFeedRows).flat();
    const query = (q || '').toLowerCase();
    return rows.filter((row) => row.name.toLowerCase().includes(query) || row.city.toLowerCase().includes(query));
  }

  const params = new URLSearchParams();
  if (supplier) params.set('supplier', supplier);
  if (q) params.set('q', q);
  return fetchWithFallback(`/feeds?${params.toString()}`, [] as FeedRow[]);
}

export async function getCatalogue(city?: string, q?: string): Promise<Hotel[]> {
  if (!apiBase) {
    const rows = mockCatalogue.filter((hotel) => {
      const matchesCity = !city || hotel.city.toLowerCase() === city.toLowerCase();
      const matchesQuery = !q || hotel.hotel_name.toLowerCase().includes(q.toLowerCase()) || hotel.city.toLowerCase().includes(q.toLowerCase());
      return matchesCity && matchesQuery;
    });
    return rows;
  }

  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (q) params.set('q', q);
  return fetchWithFallback(`/catalogue?${params.toString()}`, [] as Hotel[]);
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  if (!apiBase) {
    return mockCatalogue.find((hotel) => hotel.id === id) || null;
  }

  return fetchWithFallback(`/hotels/${id}`, null as Hotel | null);
}

export async function getReviewQueue(): Promise<ReviewItem[]> {
  if (!apiBase) {
    return mockReviewQueue;
  }

  return fetchWithFallback('/review-queue', [] as ReviewItem[]);
}

export async function getMetrics(): Promise<Metrics> {
  if (!apiBase) {
    return mockMetrics;
  }

  return fetchWithFallback('/metrics', mockMetrics);
}

export async function submitReviewDecision(payload: { id: string; approved: boolean }): Promise<{ ok: boolean }> {
  if (!apiBase) {
    return { ok: true };
  }

  const response = await fetch(`${apiBase}/review-decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Unable to save review decision');
  }

  return { ok: true };
}
