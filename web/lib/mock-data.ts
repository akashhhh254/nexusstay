import type { FeedRow, Hotel, Metrics, ReviewItem } from '@/types/hotel';

export const mockFeedRows: Record<string, FeedRow[]> = {
  A: [
    { supplier: 'Supplier A', id: 'a-101', name: 'Ibis Mumbai', city: 'Mumbai', address: 'Andheri East Road', pincode: '400069', phone: '9999999991', stars: 4, price: 4500, cancellation_policy: 'free cancellation 24 hours', payment_terms: 'pay later', supplier_reliability: 0.76 },
    { supplier: 'Supplier A', id: 'a-102', name: 'Hotel Pearl', city: 'Delhi', address: 'Connaught Place', pincode: '110001', phone: '9999999992', stars: 3, price: 3600, cancellation_policy: 'non-refundable', payment_terms: 'pay now', supplier_reliability: 0.7 },
    { supplier: 'Supplier A', id: 'a-103', name: 'Royal Residency', city: 'Bengaluru', address: 'Koramangala', pincode: '560095', phone: '9999999993', stars: 5, price: 6200, cancellation_policy: 'free cancellation 48 hours', payment_terms: 'pay at hotel', supplier_reliability: 0.82 },
  ],
  B: [
    { supplier: 'Supplier B', id: 'b-201', name: 'Ibis Mumbai', city: 'Mumbai', address: 'Andheri East Road', pincode: '400069', phone: '8888888881', stars: 4, price: 4700, cancellation_policy: 'free cancellation 48 hours', payment_terms: 'pay at hotel', supplier_reliability: 0.8 },
    { supplier: 'Supplier B', id: 'b-202', name: 'Hotel Pearl', city: 'Delhi', address: 'Connaught Place', pincode: '110001', phone: '8888888882', stars: 3, price: 3900, cancellation_policy: 'partial refund', payment_terms: 'pay later', supplier_reliability: 0.74 },
    { supplier: 'Supplier B', id: 'b-203', name: 'Royal Residency', city: 'Bengaluru', address: 'Koramangala', pincode: '560095', phone: '8888888883', stars: 5, price: 6100, cancellation_policy: 'free cancellation 48 hours', payment_terms: 'pay now', supplier_reliability: 0.87 },
  ],
  C: [
    { supplier: 'Supplier C', id: 'c-301', name: 'Ibis Mumbai', city: 'Mumbai', address: 'Andheri East Road', pincode: '400069', phone: '7777777771', stars: 4, price: 4400, cancellation_policy: 'free cancellation 48 hours', payment_terms: 'pay now', supplier_reliability: 0.84 },
    { supplier: 'Supplier C', id: 'c-302', name: 'Hotel Pearl', city: 'Delhi', address: 'Connaught Place', pincode: '110001', phone: '7777777772', stars: 3, price: 3700, cancellation_policy: 'free cancellation 24 hours', payment_terms: 'pay at hotel', supplier_reliability: 0.72 },
    { supplier: 'Supplier C', id: 'c-303', name: 'Royal Residency', city: 'Bengaluru', address: 'Koramangala', pincode: '560095', phone: '7777777773', stars: 5, price: 6500, cancellation_policy: 'partial refund', payment_terms: 'pay later', supplier_reliability: 0.88 },
  ],
};

export const mockCatalogue: Hotel[] = [
  {
    id: 'hotel-1',
    hotel_name: 'Ibis Mumbai',
    city: 'Mumbai',
    address: 'Andheri East Road, Mumbai 400069',
    pincode: '400069',
    star_rating: 4,
    mean_lat: 19.115,
    mean_lon: 72.846,
    supplier_offers: [
      { supplier: 'Supplier A', price: 4500, cancellation_policy: 'free cancellation 24 hours', payment_terms: 'pay later', supplier_reliability: 0.76 },
      { supplier: 'Supplier B', price: 4700, cancellation_policy: 'free cancellation 48 hours', payment_terms: 'pay at hotel', supplier_reliability: 0.8 },
      { supplier: 'Supplier C', price: 4400, cancellation_policy: 'free cancellation 48 hours', payment_terms: 'pay now', supplier_reliability: 0.84 },
    ],
    best_offer: { supplier: 'Supplier C', price: 4400, cancellation_policy: 'free cancellation 48 hours', payment_terms: 'pay now', supplier_reliability: 0.84, value_score: 0.77 },
    best_offer_explanation: 'Supplier C provides the strongest overall value because it combines a 48-hour free cancellation window, a flexible payment term, and the highest supplier reliability among the offers.',
  },
  {
    id: 'hotel-2',
    hotel_name: 'Hotel Pearl',
    city: 'Delhi',
    address: 'Connaught Place, New Delhi 110001',
    pincode: '110001',
    star_rating: 3,
    mean_lat: 28.63,
    mean_lon: 77.216,
    supplier_offers: [
      { supplier: 'Supplier A', price: 3600, cancellation_policy: 'non-refundable', payment_terms: 'pay now', supplier_reliability: 0.7 },
      { supplier: 'Supplier B', price: 3900, cancellation_policy: 'partial refund', payment_terms: 'pay later', supplier_reliability: 0.74 },
      { supplier: 'Supplier C', price: 3700, cancellation_policy: 'free cancellation 24 hours', payment_terms: 'pay at hotel', supplier_reliability: 0.72 },
    ],
    best_offer: { supplier: 'Supplier C', price: 3700, cancellation_policy: 'free cancellation 24 hours', payment_terms: 'pay at hotel', supplier_reliability: 0.72, value_score: 0.75 },
    best_offer_explanation: 'Supplier C wins because the free cancellation option and pay-at-hotel flexibility outweigh the slightly higher price compared to the cheapest rate.',
  },
];

export const mockReviewQueue: ReviewItem[] = [
  {
    id: 'review-1',
    hotel_a: mockFeedRows.A[0],
    hotel_b: mockFeedRows.B[0],
    score: 0.93,
    llm_explanation: 'The names, city, address, and star rating are highly aligned, and the geographic coordinates are nearly identical.',
    decision: null,
  },
  {
    id: 'review-2',
    hotel_a: mockFeedRows.A[1],
    hotel_b: mockFeedRows.C[1],
    score: 0.82,
    llm_explanation: 'The hotels overlap on location and brand identity, but there are minor formatting differences in the property name.',
    decision: 'approved',
  },
];

export const mockMetrics: Metrics = {
  precision: 0.91,
  recall: 0.88,
  f1_score: 0.89,
  baseline_precision: 0.74,
  baseline_recall: 0.69,
  baseline_f1_score: 0.71,
  look_alike_false_merges: 12,
  llm_calls: 248,
};
