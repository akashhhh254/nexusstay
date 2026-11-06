export type Offer = {
  supplier: string;
  price: number;
  cancellation_policy: string;
  payment_terms: string;
  supplier_reliability: number;
};

export type Hotel = {
  id: string;
  hotel_name: string;
  name?: string;
  city: string;
  address: string;
  pincode?: string;
  star_rating?: number;
  stars?: number;
  mean_lat?: number;
  mean_lon?: number;
  supplier_offers: Offer[];
  best_offer?: Offer & { value_score?: number };
  best_offer_explanation?: string;
  explanation?: string;
};

export type FeedRow = {
  supplier: string;
  id: string;
  name: string;
  city: string;
  address: string;
  pincode?: string;
  phone?: string;
  stars?: number;
  price?: number;
  cancellation_policy?: string;
  payment_terms?: string;
  supplier_reliability?: number;
};

export type ReviewItem = {
  id: string;
  hotel_a: FeedRow;
  hotel_b: FeedRow;
  score: number;
  llm_explanation: string;
  decision?: 'approved' | 'rejected' | null;
};

export type Metrics = {
  precision: number;
  recall: number;
  f1_score: number;
  baseline_precision: number;
  baseline_recall: number;
  baseline_f1_score: number;
  look_alike_false_merges: number;
  llm_calls: number;
};
