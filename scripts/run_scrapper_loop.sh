#!/usr/bin/env bash

# === Configuration ===
INTERVAL_MINUTES=1   # ⏰ how often to run (in minutes)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Move to project root
cd "$PROJECT_DIR" || exit 1

echo "🔁 Starting periodic scraper loop..."
echo "   Interval: every $INTERVAL_MINUTES minutes"
echo "   Working directory: $PROJECT_DIR"
echo

while true; do
  echo "🕒 $(date '+%Y-%m-%d %H:%M:%S') - Running scraper..."

  # Run your script with Yarn
  yarn scripts

  echo "✅ Scraper finished at $(date '+%Y-%m-%d %H:%M:%S')"
  echo "💤 Sleeping for $INTERVAL_MINUTES minutes..."
  echo

  sleep $((INTERVAL_MINUTES * 60))
done
