"""
enrich_collection.py
--------------------
Batch-insert URLs into your Supabase `collection` table using the
`enrich-collection` Edge Function.

Usage:
  1. Fill in your SUPABASE_ANON_KEY below (or set it as an env variable).
  2. Add your URLs to the URLS list at the bottom of the file.
  3. Run:  python enrich_collection.py
"""

import os
import time
import json
import requests

# ── Config ────────────────────────────────────────────────────────────────────

SUPABASE_URL = "https://bgfxtzrkjskrjocwqazt.supabase.co"
FUNCTION_NAME = "enrich-collection"
ENDPOINT = f"{SUPABASE_URL}/functions/v1/{FUNCTION_NAME}"

# Set your anon key here or via the SUPABASE_ANON_KEY environment variable
ANON_KEY = os.getenv(
    "SUPABASE_ANON_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZnh0enJranNrcmpvY3dxYXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjcyMzIsImV4cCI6MjA4NTgwMzIzMn0.3UUmWP7zbDd7dY-dj_h-d2t6zHC0Ia6t38YbWE3Gh_E",
)

HEADERS = {
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
}

# Delay between requests (seconds) — helps avoid rate limiting
REQUEST_DELAY = 1.5


# ── URL List ──────────────────────────────────────────────────────────────────
#
# Each entry is a dict with:
#   url               (required)  Full URL of the website
#   primary_category  (required)  List — choose from:
#                                   AI, Engineering, Artsy, Misc, Crypto,
#                                   OSINT, Investing, Learning, Social
#   primary_subcategory (required) List — choose from your subcategory options
#
# Example:
#   {"url": "https://vercel.com", "primary_category": ["Engineering"], "primary_subcategory": ["Infrastructure"]},

URLS = [
    # ── Add your URLs here ──
    {"url": "https://widemoatresearch.com", "primary_category": ["Investing"], "primary_subcategory": ["Research (Investing)", "Newsletters"]},
    {"url": "https://capitalistexploits.at", "primary_category": ["Investing"], "primary_subcategory": ["Research (Investing)", "Newsletters"]},
    {"url": "https://investingvisuals.io", "primary_category": ["Investing"], "primary_subcategory": ["Tools (Investing)"]},
]


# ── Core Logic ────────────────────────────────────────────────────────────────

def enrich(entry: dict) -> dict:
    """Call the Edge Function for a single URL entry."""
    payload = {
        "url": entry["url"],
        "primary_category": entry.get("primary_category", []),
        "primary_subcategory": entry.get("primary_subcategory", []),
    }
    response = requests.post(ENDPOINT, headers=HEADERS, json=payload, timeout=30)
    return response.json()


def run():
    total = len(URLS)
    succeeded = []
    failed = []

    print(f"\n{'─' * 60}")
    print(f"  enrich-collection  |  {total} URL(s) to process")
    print(f"{'─' * 60}\n")

    for i, entry in enumerate(URLS, start=1):
        url = entry["url"]
        print(f"[{i}/{total}] {url}")

        try:
            result = enrich(entry)

            if result.get("success"):
                extracted = result.get("extracted", {})
                print(f"  ✓ name        : {extracted.get('name')}")
                print(f"    description : {str(extracted.get('description', ''))[:80]}...")
                print(f"    logo        : {extracted.get('logo')}")
                print(f"    twitter     : {extracted.get('twitter')}")
                print(f"    linkedin    : {extracted.get('linkedin')}")
                print(f"    youtube     : {extracted.get('youtube')}")
                print(f"    github      : {extracted.get('github')}")
                print(f"    community   : {extracted.get('community')}")
                succeeded.append(url)
            else:
                error = result.get("error", "Unknown error")
                print(f"  ✗ Error: {error}")
                failed.append({"url": url, "error": error})

        except requests.exceptions.Timeout:
            print(f"  ✗ Request timed out")
            failed.append({"url": url, "error": "timeout"})
        except Exception as e:
            print(f"  ✗ Exception: {e}")
            failed.append({"url": url, "error": str(e)})

        print()

        # Pause between requests (skip delay after last item)
        if i < total:
            time.sleep(REQUEST_DELAY)

    # ── Summary ───────────────────────────────────────────────────────────────
    print(f"{'─' * 60}")
    print(f"  Done  |  ✓ {len(succeeded)} succeeded  |  ✗ {len(failed)} failed")
    print(f"{'─' * 60}\n")

    if failed:
        print("Failed URLs:")
        for f in failed:
            print(f"  • {f['url']} — {f['error']}")
        print()


if __name__ == "__main__":
    run()