#!/usr/bin/env python3
import json
import mimetypes
import os
import subprocess
import sys
import uuid
from typing import Optional
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
        if override or key not in os.environ:
            os.environ[key] = value


def json_error(message: str, code: str = "TRANSCRIPTION_ERROR", status: int = 400) -> None:
    print(json.dumps({"ok": False, "error": message, "code": code, "status": status}))


def build_multipart_body(audio_bytes: bytes, filename: str, content_type: str, model: str) -> tuple[bytes, str]:
    boundary = f"----AgriTechBoundary{uuid.uuid4().hex}"
    chunks = [
        f"--{boundary}\r\n".encode("utf-8"),
        b'Content-Disposition: form-data; name="model"\r\n\r\n',
        model.encode("utf-8"),
        b"\r\n",
        f"--{boundary}\r\n".encode("utf-8"),
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode("utf-8"),
        f"Content-Type: {content_type}\r\n\r\n".encode("utf-8"),
        audio_bytes,
        b"\r\n",
        f"--{boundary}--\r\n".encode("utf-8"),
    ]

    return b"".join(chunks), boundary


def call_transcription_api_via_curl(api_url: str, api_key: str, audio_path: Path, model: str) -> str:
    content_type = mimetypes.guess_type(audio_path.name)[0] or "application/octet-stream"
    command = [
        "curl",
        "-sS",
        "-X",
        "POST",
        api_url,
        "-H",
        f"Authorization: Bearer {api_key}",
        "-F",
        f"model={model}",
        "-F",
        f"file=@{audio_path};type={content_type}",
    ]

    result = subprocess.run(command, capture_output=True, text=True, timeout=120)
    stdout = (result.stdout or "").strip()
    stderr = (result.stderr or "").strip()

    if result.returncode != 0:
        raise RuntimeError(stderr or "Failed to reach transcription provider")

    try:
        payload = json.loads(stdout)
    except json.JSONDecodeError as exc:
        raise RuntimeError(stdout or "Failed to parse transcription provider response") from exc

    if isinstance(payload, dict) and "error" in payload:
        error_obj = payload.get("error")
        if isinstance(error_obj, dict):
            message = error_obj.get("message") or "Failed to transcribe audio"
            error_type = str(error_obj.get("type") or "")
        else:
            message = str(error_obj)
            error_type = ""

        if "auth" in error_type or "1010" in message.lower():
            raise PermissionError(message)

        raise RuntimeError(message)

    text = payload.get("text") if isinstance(payload, dict) else ""
    return (text or "").strip()


def transcribe_with_groq(audio_path: Path) -> str:
    """Transcribe audio using Groq's Whisper API"""
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("Missing GROQ_API_KEY in backend .env")

    model = os.environ.get("GROQ_TRANSCRIPTION_MODEL", "whisper-large-v3-turbo")
    try:
        return call_transcription_api_via_curl(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            api_key,
            audio_path,
            model,
        )
    except PermissionError as exc:
        provider_message = (str(exc) or "Groq authentication failed").strip()
        if "1010" in provider_message:
            provider_message = (
                "Groq authentication failed (error code 1010). "
                "Verify GROQ_API_KEY and restart the backend server."
            )
        raise PermissionError(provider_message) from exc


def transcribe_with_openai(audio_path: Path) -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("Missing OPENAI_API_KEY in backend .env")

    model = os.environ.get("OPENAI_TRANSCRIPTION_MODEL", "whisper-1")
    try:
        return call_transcription_api_via_curl(
            "https://api.openai.com/v1/audio/transcriptions",
            api_key,
            audio_path,
            model,
        )
    except PermissionError as exc:
        raise PermissionError(str(exc) or "OpenAI authentication failed") from exc


def transcribe_with_local_whisper(audio_path: Path) -> str:
    try:
        from faster_whisper import WhisperModel
    except Exception as exc:
        raise RuntimeError(
            "Local speech recognition dependency is missing. Install with: pip install faster-whisper"
        ) from exc

    model_size = os.environ.get("WHISPER_MODEL_SIZE", "base")
    compute_type = os.environ.get("WHISPER_COMPUTE_TYPE", "int8")
    device = os.environ.get("WHISPER_DEVICE", "cpu")

    model = WhisperModel(model_size, device=device, compute_type=compute_type)
    segments, _info = model.transcribe(str(audio_path))

    transcript_parts = [segment.text.strip() for segment in segments if segment.text and segment.text.strip()]
    return " ".join(transcript_parts).strip()


def transcribe(audio_path: Path) -> str:
    env_path = Path(__file__).resolve().parents[1] / ".env"
    load_dotenv(env_path)

    if not audio_path.exists() or not audio_path.is_file():
        raise ValueError("Audio file not found")

    provider_env: Optional[str] = os.environ.get("STT_PROVIDER")
    provider = (provider_env or "").strip().lower()

    # Provider-specific routing
    if provider == "groq":
        return transcribe_with_groq(audio_path)
    
    if provider == "openai":
        return transcribe_with_openai(audio_path)

    if provider == "local":
        return transcribe_with_local_whisper(audio_path)

    if provider:
        raise ValueError("Invalid STT_PROVIDER. Use 'groq', 'openai', or 'local'.")

    # Auto-detect: try groq first, then openai, then local
    if os.environ.get("GROQ_API_KEY"):
        try:
            return transcribe_with_groq(audio_path)
        except Exception:
            pass  # Fall through to next option
    
    if os.environ.get("OPENAI_API_KEY"):
        try:
            return transcribe_with_openai(audio_path)
        except Exception:
            pass  # Fall through to next option

    return transcribe_with_local_whisper(audio_path)


def main() -> int:
    if len(sys.argv) < 2:
        json_error("Audio file path is required", code="BAD_INPUT", status=400)
        return 1

    audio_path = Path(sys.argv[1]).resolve()

    try:
        text = transcribe(audio_path)
        print(json.dumps({"ok": True, "text": text}))
        return 0
    except ValueError as exc:
        json_error(str(exc), code="BAD_INPUT", status=400)
    except PermissionError as exc:
        json_error(str(exc), code="AUTH_ERROR", status=401)
    except Exception as exc:
        json_error(str(exc), code="TRANSCRIPTION_ERROR", status=500)

    return 1


if __name__ == "__main__":
    raise SystemExit(main())