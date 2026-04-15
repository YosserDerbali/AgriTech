#!/usr/bin/env python3
import argparse
import base64
import json
import os
import re
import httpx
import urllib.error
import urllib.request
from pathlib import Path


def load_dotenv(dotenv_path: Path, override: bool = True) -> None:
    if not dotenv_path.exists():
        return
    for line in dotenv_path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and (override or key not in os.environ):
            os.environ[key] = value


def json_error(message: str, code: str = "DISEASE_DETECTION_ERROR", status: int = 400) -> None:
    print(json.dumps({"ok": False, "error": message, "code": code, "status": status}))


def normalize_confidence(value: object, default: float = 0.0) -> float:
    try:
        parsed = float(value)
    except (TypeError, ValueError):
        return default
    return max(0.0, min(1.0, parsed))


def flatten_text(value: object) -> list[str]:
    if isinstance(value, str):
        text = value.strip()
        return [text] if text else []
    if isinstance(value, list):
        output: list[str] = []
        for item in value:
            output.extend(flatten_text(item))
        return output
    if isinstance(value, dict):
        output: list[str] = []
        for nested in value.values():
            output.extend(flatten_text(nested))
        return output
    return []


def choose_stub_output(plant_name: str, context: str) -> tuple[str, str, float, str]:
    lower_context = context.lower()
    lower_plant = plant_name.lower()

    if "tomato" in lower_plant or "tomato" in lower_context:
        return (
            "Tomato",
            "Early Blight",
            0.82,
            "Apply a copper-based fungicide, remove infected leaves, and avoid overhead irrigation.",
        )
    if "wheat" in lower_plant or "wheat" in lower_context:
        return (
            "Wheat",
            "Leaf Rust",
            0.78,
            "Use resistant cultivars and apply a triazole fungicide if disease pressure increases.",
        )

    return (
        plant_name or "Unknown Plant",
        "Leaf Spot (Possible)",
        0.55,
        "Isolate affected plants, improve airflow, and monitor for 3 to 5 days before targeted treatment.",
    )


def detect_with_custom_model(image_path: Path, plant_name: str, context: str) -> dict:
    inferred_plant, disease_name, confidence, treatment = choose_stub_output(plant_name, context)
    return {
        "ok": True,
        "plant_name": inferred_plant,
        "disease_name": disease_name,
        "confidence": normalize_confidence(confidence, default=0.0),
        "treatment": treatment,
        "model_version": "custom-local-v0",
        "model_name": "custom_local_efficientnet_placeholder",
        "model_type": "custom",
        "provider": "custom",
        "fallback_used": False,
    }


def extract_suggestions(payload: dict) -> list[dict]:
    candidate_paths = [
        payload.get("result", {}).get("disease", {}).get("suggestions"),
        payload.get("result", {}).get("disease"),
        payload.get("health_assessment", {}).get("diseases"),
        payload.get("health_assessment", {}).get("suggestions"),
        payload.get("diseases"),
        payload.get("suggestions"),
    ]

    for suggestions in candidate_paths:
        if isinstance(suggestions, list) and suggestions:
            dict_only = [item for item in suggestions if isinstance(item, dict)]
            if dict_only:
                return dict_only

    return []


def infer_plant_name(payload: dict, fallback: str) -> str:
    if fallback:
        return fallback

    candidate_paths = [
        payload.get("result", {}).get("classification", {}).get("suggestions"),
        payload.get("classification", {}).get("suggestions"),
        payload.get("result", {}).get("plant", {}).get("suggestions"),
        payload.get("plant", {}).get("suggestions"),
    ]

    for suggestions in candidate_paths:
        if not isinstance(suggestions, list):
            continue
        for item in suggestions:
            if not isinstance(item, dict):
                continue
            name = (item.get("name") or "").strip()
            if name:
                return name

    return "Unknown Plant"


def normalize_disease_name(name: str) -> str:
    cleaned = " ".join((name or "").strip().split())
    if not cleaned:
        return "Unknown disease"

    key = cleaned.lower().replace("-", " ")
    key = " ".join(key.split())

    corrections = {
        "brotrytis": "Botrytis",
        "botritis": "Botrytis",
        "botrytis": "Botrytis",
        "botrytis cinera": "Botrytis cinerea",
    }

    return corrections.get(key, cleaned)


def extract_treatment_texts(top_suggestion: dict, payload: dict) -> list[str]:
    candidate_values = [
        top_suggestion.get("details", {}).get("treatment", {}),
        top_suggestion.get("treatment", {}),
        top_suggestion.get("details", {}).get("recommendations", {}),
        top_suggestion.get("details", {}).get("recommendation", {}),
        top_suggestion.get("details", {}).get("management", {}),
        top_suggestion.get("details", {}).get("description", ""),
        top_suggestion.get("description", ""),
        payload.get("result", {}).get("disease", {}).get("treatment", {}),
        payload.get("health_assessment", {}).get("treatment", {}),
    ]

    result: list[str] = []
    for value in candidate_values:
        result.extend(flatten_text(value))

    # Preserve order while removing duplicates and empty values.
    unique: list[str] = []
    seen: set[str] = set()
    for item in result:
        normalized = " ".join(item.split())
        if not normalized:
            continue
        lowered = normalized.lower()
        if lowered in seen:
            continue
        seen.add(lowered)
        unique.append(normalized)

    return unique


def parse_json_object_from_text(raw_text: str) -> dict:
    text = (raw_text or "").strip()
    if not text:
        raise ValueError("Groq returned an empty response")

    # Handle Markdown fenced JSON blocks first.
    fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, flags=re.DOTALL | re.IGNORECASE)
    if fence_match:
        text = fence_match.group(1).strip()

    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    # Fallback: find the first JSON object in mixed text output.
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("Groq response did not contain a valid JSON object")

    candidate = text[start : end + 1]
    try:
        parsed = json.loads(candidate)
    except json.JSONDecodeError as exc:
        raise ValueError("Groq response JSON could not be parsed") from exc

    if not isinstance(parsed, dict):
        raise ValueError("Groq response JSON root must be an object")

    return parsed


def detect_with_groq_vision(image_path: Path, plant_name: str, context: str) -> dict:
    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        raise ValueError("Missing GROQ_API_KEY in backend .env")

    api_url = os.environ.get("GROQ_VISION_API_URL", "https://api.groq.com/openai/v1/chat/completions").strip()
    if not api_url:
        raise ValueError("GROQ_VISION_API_URL cannot be empty")

    model_name = os.environ.get("GROQ_VISION_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct").strip()
    if not model_name:
        raise ValueError("GROQ_VISION_MODEL cannot be empty")

    image_mime_type = os.environ.get("GROQ_IMAGE_MIME_TYPE", "image/jpeg").strip() or "image/jpeg"

    with image_path.open("rb") as image_file:
        image_b64 = base64.b64encode(image_file.read()).decode("utf-8")

    user_text = (
        f"Farmer plant name (optional): {plant_name or '[not provided]'}\n"
        f"Farmer context (optional): {context or '[not provided]'}"
    )

    system_prompt = (
        "You are an agricultural disease detection assistant. "
        "Analyze the plant image and farmer text. "
        "Return ONLY a valid JSON object with these keys: "
        "plant_name (string), plant_confidence (number 0..1), disease_name (string), "
        "confidence (number 0..1), symptoms (string), treatment (string), cause (string), prevention (string). "
        "If uncertain, still return best estimate and lower confidence. "
        "Do not include markdown or any text outside JSON."
    )

    payload = {
        "model": model_name,
        "temperature": 0.1,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": user_text,
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{image_mime_type};base64,{image_b64}",
                        },
                    },
                ],
            },
        ],
    }

    try:
        with httpx.Client(
            timeout=90.0,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Accept": "application/json",
                "Content-Type": "application/json",
                "User-Agent": "AgriTech-DiseaseDetection/1.0",
            },
        ) as client:
            response = client.post(api_url, json=payload)
            response.raise_for_status()
            provider_payload = response.json()
    except httpx.HTTPStatusError as exc:
        details = ""
        try:
            details = exc.response.text.strip()
        except Exception:
            details = ""
        raise ValueError(f"Groq request failed ({exc.response.status_code}): {details or exc.response.reason_phrase}") from exc
    except httpx.RequestError as exc:
        raise RuntimeError(f"Groq network error: {exc}") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("Groq returned a non-JSON response") from exc

    choices = provider_payload.get("choices")
    if not isinstance(choices, list) or not choices:
        raise RuntimeError("Groq response did not include choices")

    message_content = (
        choices[0].get("message", {}).get("content")
        if isinstance(choices[0], dict)
        else ""
    )
    parsed = parse_json_object_from_text(str(message_content or ""))

    resolved_plant_name = (str(parsed.get("plant_name") or "").strip() or plant_name or "Unknown Plant")
    resolved_disease_name = normalize_disease_name(str(parsed.get("disease_name") or "Unknown disease"))
    resolved_confidence = normalize_confidence(parsed.get("confidence"), default=0.0)
    resolved_plant_confidence = normalize_confidence(parsed.get("plant_confidence"), default=0.0)
    resolved_symptoms = str(parsed.get("symptoms") or "").strip() or None
    resolved_treatment = str(parsed.get("treatment") or "").strip() or "No treatment guidance returned by provider."

    return {
        "ok": True,
        "plant_name": resolved_plant_name,
        "disease_name": resolved_disease_name,
        "confidence": resolved_confidence,
        "symptoms": resolved_symptoms,
        "treatment": resolved_treatment,
        "cause": str(parsed.get("cause") or "").strip() or None,
        "prevention": str(parsed.get("prevention") or "").strip() or None,
        "model_version": str(provider_payload.get("model") or model_name).strip(),
        "model_name": model_name,
        "model_type": "hosted",
        "provider": "groq",
        "fallback_used": False,
        "plant_confidence": resolved_plant_confidence,
    }


def request_plant_id_api(api_url: str, payload: dict) -> dict:
    request_data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        api_url,
        data=request_data,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            raw_body = response.read().decode("utf-8")
            return json.loads(raw_body)
    except urllib.error.HTTPError as exc:
        details = ""
        try:
            details = exc.read().decode("utf-8")
        except Exception:
            details = ""
        raise ValueError(f"Plant.id request failed ({exc.code}): {details or exc.reason}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Plant.id network error: {exc.reason}") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("Plant.id returned a non-JSON response") from exc


def detect_plant_with_plant_id(image_b64: str, fallback_plant_name: str) -> tuple[str, float]:
    api_key = os.environ.get("PLANT_ID_API_KEY", "").strip()
    if not api_key:
        raise ValueError("Missing PLANT_ID_API_KEY in backend .env")

    identify_url = os.environ.get("PLANT_ID_IDENTIFY_URL", "https://api.plant.id/v2/identify").strip()
    if not identify_url:
        raise ValueError("PLANT_ID_IDENTIFY_URL cannot be empty")

    payload = {
        "api_key": api_key,
        "images": [image_b64],
        "plant_details": [
            "common_names",
            "taxonomy",
        ],
    }

    identify_payload = request_plant_id_api(identify_url, payload)

    candidate_paths = [
        identify_payload.get("result", {}).get("classification", {}).get("suggestions"),
        identify_payload.get("classification", {}).get("suggestions"),
        identify_payload.get("result", {}).get("plant", {}).get("suggestions"),
        identify_payload.get("plant", {}).get("suggestions"),
        identify_payload.get("suggestions"),
    ]

    suggestions: list[dict] = []
    for items in candidate_paths:
        if isinstance(items, list) and items:
            suggestions = [item for item in items if isinstance(item, dict)]
            if suggestions:
                break

    if not suggestions:
        resolved_name = fallback_plant_name.strip() or "Unknown Plant"
        return resolved_name, 0.0

    def score(item: dict) -> float:
        return normalize_confidence(
            item.get("probability", item.get("confidence", item.get("score", 0.0))),
            default=0.0,
        )

    top = max(suggestions, key=score)
    detected_name = (top.get("name") or "").strip()
    resolved_name = detected_name or fallback_plant_name.strip() or "Unknown Plant"
    return resolved_name, score(top)


def detect_with_plant_id(image_path: Path, plant_name: str, context: str) -> dict:
    api_key = os.environ.get("PLANT_ID_API_KEY", "").strip()
    if not api_key:
        raise ValueError("Missing PLANT_ID_API_KEY in backend .env")

    api_url = os.environ.get("PLANT_ID_API_URL", "https://api.plant.id/v2/health_assessment").strip()
    if not api_url:
        raise ValueError("PLANT_ID_API_URL cannot be empty")

    with image_path.open("rb") as image_file:
        image_b64 = base64.b64encode(image_file.read()).decode("utf-8")

    # Step 1: identify plant first.
    identified_plant_name, identified_plant_confidence = detect_plant_with_plant_id(
        image_b64,
        plant_name,
    )

    payload = {
        "api_key": api_key,
        "images": [image_b64],
        "health": "all",
        "classification_level": "species",
    }

    # Step 2: assess disease/health.
    provider_payload = request_plant_id_api(api_url, payload)

    suggestions = extract_suggestions(provider_payload)
    if not suggestions:
        raise RuntimeError("Plant.id response did not include disease suggestions")

    def score(item: dict) -> float:
        return normalize_confidence(
            item.get("probability", item.get("confidence", item.get("score", 0.0))),
            default=0.0,
        )

    top = max(suggestions, key=score)
    disease_name = normalize_disease_name((top.get("name") or top.get("disease") or "Unknown disease"))
    confidence = score(top)

    treatment_texts = extract_treatment_texts(top, provider_payload)

    treatment = " ".join(treatment_texts).strip() or "No treatment guidance returned by provider."

    return {
        "ok": True,
        # Keep response stable and deterministic for the app.
        "plant_name": identified_plant_name,
        "disease_name": disease_name,
        "confidence": confidence,
        "treatment": treatment,
        "model_version": str(provider_payload.get("model_version") or "plant.id-health-v2").strip(),
        "model_name": "plant.id_health_assessment",
        "model_type": "hosted",
        "provider": "plantid",
        "fallback_used": False,
        "plant_confidence": identified_plant_confidence,
    }


def detect_disease(image_path: Path, plant_name: str, context: str) -> dict:
    if not image_path.exists() or not image_path.is_file():
        raise ValueError("Image file does not exist")

    provider = os.environ.get("DISEASE_PROVIDER", "stub").strip().lower()

    if provider == "groq":
        return detect_with_groq_vision(image_path, plant_name, context)

    if provider == "plantid":
        return detect_with_plant_id(image_path, plant_name, context)

    if provider == "custom":
        return detect_with_custom_model(image_path, plant_name, context)

    if provider == "hybrid":
        custom_result = detect_with_custom_model(image_path, plant_name, context)
        threshold_raw = os.environ.get("CUSTOM_FALLBACK_THRESHOLD", "0.75").strip()
        threshold = normalize_confidence(threshold_raw, default=0.75)

        if normalize_confidence(custom_result.get("confidence"), default=0.0) >= threshold:
            return custom_result

        plant_id_result = detect_with_plant_id(image_path, plant_name, context)
        plant_id_result["fallback_used"] = True
        return plant_id_result

    if provider == "stub":
        inferred_plant, disease_name, confidence, treatment = choose_stub_output(plant_name, context)
        return {
            "ok": True,
            "plant_name": inferred_plant,
            "disease_name": disease_name,
            "confidence": normalize_confidence(confidence, default=0.0),
            "treatment": treatment,
            "model_version": "stub-v1",
            "model_name": "stub_rule_based",
            "model_type": "stub",
            "provider": "stub",
            "fallback_used": False,
        }

    raise ValueError("Invalid DISEASE_PROVIDER. Use 'groq', 'plantid', 'hybrid', 'custom', or 'stub'.")


def main() -> int:
    load_dotenv(Path(__file__).resolve().parents[1] / ".env")

    parser = argparse.ArgumentParser(description="AgriTech disease detection stub")
    parser.add_argument("image_path", help="Path to uploaded plant image")
    parser.add_argument("--plant-name", dest="plant_name", default="")
    parser.add_argument("--context", dest="context", default="")
    parser.add_argument("--mime-type", dest="mime_type", default="")
    args = parser.parse_args()

    if args.mime_type:
        os.environ["GROQ_IMAGE_MIME_TYPE"] = args.mime_type.strip()

    try:
        image_path = Path(args.image_path)
        result = detect_disease(image_path, args.plant_name.strip(), args.context.strip())
        print(json.dumps(result))
        return 0
    except Exception as exc:
        json_error(str(exc), status=400)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
