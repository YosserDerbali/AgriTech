# test_groq.py
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

api_key = os.environ.get("GROQ_API_KEY")
print(f"API Key loaded: {'Yes' if api_key else 'No'}")
print(f"API Key prefix: {api_key[:10] if api_key else 'None'}...")
print(f"API Key length: {len(api_key) if api_key else 0}")

if api_key and api_key.startswith('gsk_'):
    print("✅ API key format looks correct")
else:
    print("❌ API key format is incorrect. Should start with 'gsk_'")