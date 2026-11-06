from src.offers import best_offer, value_score


def test_more_expensive_free_cancellation_offer_beats_cheapest_non_refundable_offer():
    offers = [
        {"supplier": "Supplier A", "price": 4100, "cancellation_policy": "non-refundable", "payment_terms": "pay now", "supplier_reliability": 0.55},
        {"supplier": "Supplier B", "price": 4200, "cancellation_policy": "free cancellation 48 hours", "payment_terms": "pay at hotel", "supplier_reliability": 0.52},
    ]

    winner = best_offer(offers)

    assert winner["supplier"] == "Supplier B"
    assert winner["value_score"] >= value_score(offers[0], offers)


def test_more_reliable_supplier_wins_when_other_factors_are_equal():
    offers = [
        {"supplier": "Supplier A", "price": 4000, "cancellation_policy": "free cancellation 24 hours", "payment_terms": "pay later", "supplier_reliability": 0.60},
        {"supplier": "Supplier B", "price": 4000, "cancellation_policy": "free cancellation 24 hours", "payment_terms": "pay later", "supplier_reliability": 0.90},
    ]

    winner = best_offer(offers)

    assert winner["supplier"] == "Supplier B"


def test_single_offer_is_returned_as_best_offer():
    offers = [
        {"supplier": "Supplier C", "price": 3500, "cancellation_policy": "partial refund", "payment_terms": "pay at hotel", "supplier_reliability": 0.75},
    ]

    winner = best_offer(offers)

    assert winner["supplier"] == "Supplier C"
    assert winner["price"] == 3500
