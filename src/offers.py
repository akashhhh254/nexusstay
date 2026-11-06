import json
import math
from typing import Any, Dict, Iterable, List, Sequence


CANCELLATION_SCORES = {
    "free cancellation 48 hours": 1.0,
    "free cancellation 24 hours": 0.8,
    "partial refund": 0.5,
    "non-refundable": 0.1,
    "non refundable": 0.1,
    "free_cancel_48h": 1.0,
    "free_cancel_24h": 0.8,
    "partial_refund": 0.5,
    "non_refundable": 0.1,
}

PAYMENT_SCORES = {
    "pay at hotel": 1.0,
    "pay later": 0.7,
    "pay now": 0.4,
    "pay_at_hotel": 1.0,
    "pay_later": 0.7,
    "pay_now": 0.4,
}


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _normalize_text(value: Any) -> str:
    return str(value).strip().lower() if value is not None else ""


def _cancellation_score(policy: Any) -> float:
    text = _normalize_text(policy)
    if text in CANCELLATION_SCORES:
        return CANCELLATION_SCORES[text]
    for key, score in CANCELLATION_SCORES.items():
        if key in text:
            return score
    return 0.1


def _payment_score(term: Any) -> float:
    text = _normalize_text(term)
    if text in PAYMENT_SCORES:
        return PAYMENT_SCORES[text]
    for key, score in PAYMENT_SCORES.items():
        if key in text:
            return score
    return 0.4


def _price_score(price: float, all_prices: Sequence[float]) -> float:
    if not all_prices:
        return 1.0
    min_price = min(all_prices)
    if math.isclose(min_price, 0.0):
        return 1.0 if math.isclose(price, 0.0) else 0.0
    if math.isclose(price, min_price):
        return 1.0
    if price <= 0:
        return 0.0
    return min_price / price


def value_score(offer: Dict[str, Any], all_offers: Sequence[Dict[str, Any]]) -> float:
    price = _safe_float(offer.get("price"))
    all_prices = [_safe_float(item.get("price")) for item in all_offers if item.get("price") is not None]
    price_component = _price_score(price, all_prices)

    cancellation_component = _cancellation_score(offer.get("cancellation_policy"))
    payment_component = _payment_score(offer.get("payment_terms"))

    reliability_value = _safe_float(
        offer.get("supplier_reliability", offer.get("reliability", 0.5)),
        0.5,
    )
    if reliability_value < 0 or reliability_value > 1:
        reliability_value = max(0.0, min(1.0, reliability_value))

    return (
        0.45 * price_component
        + 0.25 * cancellation_component
        + 0.10 * payment_component
        + 0.20 * reliability_value
    )


def best_offer(offers: Sequence[Dict[str, Any]]) -> Dict[str, Any]:
    if not offers:
        raise ValueError("At least one offer is required to select the best offer.")

    scored = []
    for offer in offers:
        score = value_score(offer, offers)
        scored.append({**offer, "score": score})

    winner = max(scored, key=lambda item: item["score"])
    policy = winner.get("cancellation_policy", "non-refundable")
    payment = winner.get("payment_terms", "pay now")
    supplier = winner.get("supplier", "Unknown supplier")
    price = winner.get("price", 0)
    reliability = winner.get("supplier_reliability", winner.get("reliability", 0.5))
    value = winner["score"]

    explanation = (
        f"{supplier} offers the best value at INR {price}. "
        f"Its {policy.lower()} policy and {payment.lower()} terms keep the total value high, "
        f"while supplier reliability of {reliability:.2f} supports the recommendation. "
        f"Overall value score: {value:.3f}."
    )
    winner["explanation"] = explanation
    winner["value_score"] = value
    return winner


def _coerce_rows(df: Any) -> List[Dict[str, Any]]:
    if df is None:
        return []
    if isinstance(df, list):
        return [dict(item) for item in df]
    if hasattr(df, "to_dict"):
        records = df.to_dict(orient="records")
        return [dict(item) for item in records]
    return [dict(item) for item in list(df)]


def build_catalogue(df: Any, clusters: Iterable[Sequence[Any]], suppliers_df: Any):
    rows = _coerce_rows(df)
    supplier_rows = _coerce_rows(suppliers_df)
    supplier_lookup = {}
    for supplier in supplier_rows:
        supplier_lookup[supplier.get("name")] = supplier

    result = []
    for cluster in clusters:
        cluster_records = []
        for row_id in cluster:
            match = None
            for rec in rows:
                if rec.get("hotel_id") == row_id or str(rec.get("id")) == str(row_id):
                    match = rec
                    break
            if match is not None:
                cluster_records.append(match)

        if not cluster_records:
            continue

        avg_lat = sum(_safe_float(r.get("lat")) for r in cluster_records) / len(cluster_records)
        avg_lon = sum(_safe_float(r.get("lon")) for r in cluster_records) / len(cluster_records)
        hotel_name = cluster_records[0].get("name", "Unnamed hotel")
        city = cluster_records[0].get("city", "")
        address = cluster_records[0].get("address", "")
        pincode = cluster_records[0].get("pincode", "")
        stars = cluster_records[0].get("stars", 0)

        offers = []
        for record in cluster_records:
            supplier_name = record.get("supplier", "Unknown supplier")
            supplier_meta = supplier_lookup.get(supplier_name, {})
            offers.append(
                {
                    "hotel_id": record.get("hotel_id", record.get("id")),
                    "supplier": supplier_name,
                    "price": _safe_float(record.get("price"), 0.0),
                    "cancellation_policy": record.get("cancellation_policy", "non-refundable"),
                    "payment_terms": record.get("payment_terms", "pay now"),
                    "supplier_reliability": _safe_float(
                        record.get("supplier_reliability", supplier_meta.get("reliability", 0.5)),
                        0.5,
                    ),
                }
            )

        best_choice = best_offer(offers)
        result.append(
            {
                "hotel_name": hotel_name,
                "address": address,
                "pincode": pincode,
                "city": city,
                "mean_lat": avg_lat,
                "mean_lon": avg_lon,
                "star_rating": stars,
                "supplier_offers": offers,
                "best_offer": {
                    "supplier": best_choice.get("supplier"),
                    "price": best_choice.get("price"),
                    "cancellation_policy": best_choice.get("cancellation_policy"),
                    "payment_terms": best_choice.get("payment_terms"),
                    "supplier_reliability": best_choice.get("supplier_reliability"),
                    "value_score": best_choice.get("value_score"),
                },
                "best_offer_explanation": best_choice.get("explanation"),
            }
        )

    with open("outputs/catalogue.json", "w", encoding="utf-8") as handle:
        json.dump(result, handle, indent=2)

    return result
