import hashlib
import json
import os
import re
import sqlite3
import time
from typing import Any, Dict, Iterable, Optional, Tuple

try:
    from groq import Groq
except ImportError:  # pragma: no cover - handled by runtime fallback
    Groq = None

ALLOWED_FIELDS = ("name", "address", "city", "pincode", "lat", "lon", "phone", "stars")
CACHE_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "outputs", "llm_cache.db")


def _ensure_cache_db() -> str:
    os.makedirs(os.path.dirname(CACHE_DB_PATH), exist_ok=True)
    conn = sqlite3.connect(CACHE_DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS llm_cache (
            cache_key TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.close()
    return CACHE_DB_PATH


def _normalize_row(row: Dict[str, Any]) -> Dict[str, Any]:
    normalized: Dict[str, Any] = {}
    for field in ALLOWED_FIELDS:
        if field in row:
            normalized[field] = row[field]
    return normalized


def _order_independent_hash(row_a: Dict[str, Any], row_b: Dict[str, Any]) -> str:
    first = json.dumps(_normalize_row(row_a), sort_keys=True, separators=(",", ":"), default=str)
    second = json.dumps(_normalize_row(row_b), sort_keys=True, separators=(",", ":"), default=str)
    pair = sorted([first, second])
    return hashlib.sha256(("hotel-pair:" + "|".join(pair)).encode("utf-8")).hexdigest()


def _get_cache(cache_key: str) -> Optional[Dict[str, Any]]:
    _ensure_cache_db()
    conn = sqlite3.connect(CACHE_DB_PATH)
    try:
        row = conn.execute(
            "SELECT payload FROM llm_cache WHERE cache_key = ?",
            (cache_key,),
        ).fetchone()
    finally:
        conn.close()

    if row is None:
        return None

    try:
        payload = json.loads(row[0])
        if isinstance(payload, dict):
            return payload
    except json.JSONDecodeError:
        return None
    return None


def _set_cache(cache_key: str, payload: Dict[str, Any]) -> None:
    _ensure_cache_db()
    conn = sqlite3.connect(CACHE_DB_PATH)
    try:
        conn.execute(
            "INSERT OR REPLACE INTO llm_cache (cache_key, payload) VALUES (?, ?)",
            (cache_key, json.dumps(payload, sort_keys=True, default=str)),
        )
        conn.commit()
    finally:
        conn.close()


def _strip_markdown_fence(content: str) -> str:
    cleaned = content.strip()
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", cleaned, flags=re.IGNORECASE | re.DOTALL)
    if match:
        return match.group(1).strip()
    return cleaned


def _build_system_prompt() -> str:
    return (
        "You are a hotel record matching judge. Compare the two hotel listings based only on the approved fields. "
        "Return JSON with keys same, confidence, and reason. Use same as true or false, confidence as a float between 0 and 1, "
        "and reason as a brief explanation."
    )


def _extract_allowed_payload(row: Dict[str, Any]) -> Dict[str, Any]:
    return {key: row.get(key) for key in ALLOWED_FIELDS if key in row}


def _call_model(model_name: str, row_a: Dict[str, Any], row_b: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or Groq is None:
        return None

    messages = [
        {"role": "system", "content": _build_system_prompt()},
        {
            "role": "user",
            "content": json.dumps(
                {
                    "row_a": _extract_allowed_payload(row_a),
                    "row_b": _extract_allowed_payload(row_b),
                },
                sort_keys=True,
            ),
        },
    ]

    last_error = None
    for attempt in range(4):
        try:
            client = Groq(api_key=api_key)
            response = client.chat.completions.create(
                model=model_name,
                messages=messages,
                temperature=0,
                response_format={"type": "json_object"},
            )
            raw = response.choices[0].message.content
            if not isinstance(raw, str):
                return None

            cleaned = _strip_markdown_fence(raw)
            payload = json.loads(cleaned)
            if not isinstance(payload, dict):
                return None

            same_value = payload.get("same")
            confidence_value = payload.get("confidence")
            reason_value = payload.get("reason", "")

            if same_value is None or confidence_value is None:
                return None

            return {
                "same": bool(same_value),
                "confidence": float(confidence_value),
                "reason": str(reason_value),
            }
        except Exception as exc:  # pragma: no cover - exact exceptions are runtime-specific
            last_error = exc
            if attempt < 3:
                delay = 0.5 * (2 ** attempt)
                time.sleep(delay)
                continue

    if last_error is not None:
        raise last_error
    return None


def judge_pair(row_a: Dict[str, Any], row_b: Dict[str, Any]) -> Dict[str, Any]:
    """Judge whether two hotel rows represent the same property.

    Returns a dict with keys: same, confidence, reason.
    If all attempts fail, returns {"same": None, "confidence": None, "reason": "..."}.
    """
    normalized_a = _normalize_row(row_a)
    normalized_b = _normalize_row(row_b)
    cache_key = _order_independent_hash(normalized_a, normalized_b)
    cached = _get_cache(cache_key)
    if cached is not None:
        return cached

    fast_model = os.getenv("GROQ_MODEL_FAST", "llama-3.1-8b-instant")
    strong_model = os.getenv("GROQ_MODEL_STRONG", "llama-3.3-70b-versatile")

    attempts = [
        (fast_model, "fast"),
        (strong_model, "strong"),
    ]

    last_error = "No valid response from Groq models."
    for model_name, _ in attempts:
        try:
            payload = _call_model(model_name, normalized_a, normalized_b)
        except Exception as exc:  # pragma: no cover - defensive
            last_error = str(exc)
            payload = None

        if payload is None:
            continue

        confidence = payload.get("confidence")
        if isinstance(confidence, (int, float)) and confidence < 0.7:
            continue

        result = {
            "same": payload.get("same"),
            "confidence": payload.get("confidence"),
            "reason": payload.get("reason", "Groq judged the hotel pair."),
        }
        _set_cache(cache_key, result)
        return result

    failure = {
        "same": None,
        "confidence": None,
        "reason": last_error,
    }
    _set_cache(cache_key, failure)
    return failure
