import os
from types import SimpleNamespace

from src.llm_judge import judge_pair


def _reset_cache():
    cache_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "outputs", "llm_cache.db")
    if os.path.exists(cache_path):
        os.remove(cache_path)


class DummyResponse:
    def __init__(self, content):
        self.choices = [SimpleNamespace(message=SimpleNamespace(content=content))]


def test_judge_pair_uses_fast_model_then_strong_model(monkeypatch):
    _reset_cache()
    calls = []

    class DummyClient:
        def __init__(self, api_key):
            self.api_key = api_key

        @property
        def chat(self):
            return self

        @property
        def completions(self):
            return self

        def create(self, **kwargs):
            calls.append(kwargs["model"])
            if kwargs["model"] == "fast-model":
                return DummyResponse('{"same": true, "confidence": 0.65, "reason": "Looks like the same hotel."}')
            return DummyResponse('```json\n{"same": true, "confidence": 0.81, "reason": "The address matches."}\n```')

    monkeypatch.setenv("GROQ_API_KEY", "test-key")
    monkeypatch.setenv("GROQ_MODEL_FAST", "fast-model")
    monkeypatch.setenv("GROQ_MODEL_STRONG", "strong-model")
    monkeypatch.setattr("src.llm_judge.Groq", DummyClient)

    row_a = {"name": "Ibis Mumbai", "address": "Andheri East", "city": "Mumbai", "pincode": "400069", "lat": 19.1, "lon": 72.9, "phone": "111", "stars": 4}
    row_b = {"name": "Ibis Mumbai", "address": "Andheri East", "city": "Mumbai", "pincode": "400069", "lat": 19.1, "lon": 72.9, "phone": "222", "stars": 4}

    result = judge_pair(row_a, row_b)

    assert calls == ["fast-model", "strong-model"]
    assert result["same"] is True
    assert result["confidence"] == 0.81
    assert "address" in result["reason"].lower()


def test_judge_pair_returns_none_when_all_attempts_fail(monkeypatch):
    _reset_cache()
    class DummyClient:
        def __init__(self, api_key):
            self.api_key = api_key

        @property
        def chat(self):
            return self

        @property
        def completions(self):
            return self

        def create(self, **kwargs):
            raise RuntimeError("429 rate limited")

    monkeypatch.setenv("GROQ_API_KEY", "test-key")
    monkeypatch.setenv("GROQ_MODEL_FAST", "fast-model")
    monkeypatch.setenv("GROQ_MODEL_STRONG", "strong-model")
    monkeypatch.setattr("src.llm_judge.Groq", DummyClient)

    result = judge_pair({"name": "Hotel A"}, {"name": "Hotel B"})

    assert result["same"] is None
    assert result["confidence"] is None
    assert "No valid response" in result["reason"] or "rate limited" in result["reason"]
