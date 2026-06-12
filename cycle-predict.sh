#!/bin/bash

# ── PredictEarn Color + Fixture Cycler ───────────────────────────────────────
# Cycles CSS theme colors AND football fixtures every 5 minutes, one at a time
# Usage: chmod +x cycle-predict.sh && ./cycle-predict.sh
# Run from: predictNearn- project root
# ─────────────────────────────────────────────────────────────────────────────

CSS_FILE="app/globals.css"
PAGE_FILE="app/page.tsx"   # adjust if your page is elsewhere
INTERVAL=300

# ── Color themes (acid, ink, card per theme) ──────────────────────────────────
# Format: "ACID|INK|CARD|DARK_BG|DARK_FG|LIGHT_BG"

COLOR_THEMES=(
  "#C8FF00|#060809|#131619|#575454|#d8d8d8|#5fe803"   # original acid green
  "#FF3B30|#060809|#1a1212|#4a2020|#f0c0c0|#ff6b6b"   # red heat
  "#00D4FF|#050a0d|#0d1a20|#203040|#c0e0f0|#00aacc"   # electric blue
  "#FF9500|#080600|#1a1500|#3a2800|#f0d8b0|#ff7700"   # amber fire
  "#BF5FFF|#07050d|#130d1a|#2a1840|#d8b0f0|#9933ff"   # neon purple
  "#00FFB3|#050d0a|#0d1a15|#103028|#b0f0e0|#00cc88"   # mint crypto
  "#FF0080|#0d0508|#1a0d12|#380820|#f0b0c8|#cc0066"   # hot pink
  "#FFE500|#080700|#1a1800|#383000|#f0e8a0|#ccb800"   # volt yellow
)

# ── Fixture sets (8 sets of 5 matches) ───────────────────────────────────────
# Format per match: "LEAGUE|T1|T2|ODD|LIVE|FEATURED"
# Sets separated by "---"

FIXTURE_SETS=(
  "UCL · Live|MCI|ARS|2.15|true|true;La Liga · FT|RMA|PSG|1.85|false|false;EPL · 78′|LIV|CHE|4.40|true|false;Bundesliga|BVB|FCB|3.10|true|false;Ligue 1|PSG|LYN|1.60|false|false"
  "UCL · Live|BAR|INT|3.25|true|true;EPL · 45′|MUN|TOT|2.10|true|false;Serie A · FT|JUV|MIL|1.75|false|false;La Liga|ATM|SEV|2.85|true|false;UCL|BYN|NAP|1.95|false|false"
  "EPL · Live|ARS|LIV|3.50|true|true;UCL · 67′|RMA|DOR|1.70|true|false;Bundesliga|LEP|FRK|2.40|false|false;Ligue 1|MAR|MON|3.00|true|false;Serie A|ROM|LAZ|2.20|false|false"
  "UCL · Live|PSG|MCI|2.75|true|true;EPL · FT|CHE|MCI|4.10|false|false;La Liga · 34′|RMA|BAR|1.90|true|false;Bundesliga|BAY|LEP|1.55|true|false;UCL|INT|ATM|2.60|false|false"
  "AFCON · Live|NGA|GHA|2.90|true|true;UCL · 89′|LIV|RMA|3.80|true|false;EPL|NEW|ARS|4.50|false|false;La Liga · FT|SEV|VAL|2.15|false|false;Serie A|NAP|JUV|2.35|true|false"
  "UCL · Live|MIL|PSG|3.15|true|true;EPL · 12′|MCI|LIV|2.05|true|false;Bundesliga · FT|FCB|DOR|1.65|false|false;La Liga|BAR|ATM|1.80|true|false;Ligue 1 · 55′|PSG|REN|1.45|true|false"
  "UCL · Live|ARS|BAR|3.70|true|true;EPL · FT|TOT|CHE|2.95|false|false;Serie A · 72′|INT|ROM|1.85|true|false;La Liga|VAL|RMA|5.20|false|false;UCL|DOR|PSG|2.50|true|false"
  "UCL · Live|MCI|BAY|2.30|true|true;EPL · 38′|LIV|MUN|1.95|true|false;Bundesliga|DOR|LEP|2.80|false|false;La Liga · FT|ATM|SEV|1.70|false|false;Serie A|JUV|INT|2.45|true|false"
)

# ── Ticker data matching each fixture set ─────────────────────────────────────

TICKER_SETS=(
  "Man City vs Arsenal|2.15;Real Madrid vs PSG|1.85;Liverpool vs Chelsea|4.40;Dortmund vs Bayern|3.10;Barcelona vs Atletico|1.95"
  "Barcelona vs Inter|3.25;Man United vs Tottenham|2.10;Juventus vs Milan|1.75;Atletico vs Sevilla|2.85;Bayern vs Napoli|1.95"
  "Arsenal vs Liverpool|3.50;Real Madrid vs Dortmund|1.70;Leipzig vs Frankfurt|2.40;Marseille vs Monaco|3.00;Roma vs Lazio|2.20"
  "PSG vs Man City|2.75;Chelsea vs Man City|4.10;Real Madrid vs Barcelona|1.90;Bayern vs Leipzig|1.55;Inter vs Atletico|2.60"
  "Nigeria vs Ghana|2.90;Liverpool vs Real Madrid|3.80;Newcastle vs Arsenal|4.50;Sevilla vs Valencia|2.15;Napoli vs Juventus|2.35"
  "AC Milan vs PSG|3.15;Man City vs Liverpool|2.05;Bayern vs Dortmund|1.65;Barcelona vs Atletico|1.80;PSG vs Rennes|1.45"
  "Arsenal vs Barcelona|3.70;Tottenham vs Chelsea|2.95;Inter vs Roma|1.85;Valencia vs Real Madrid|5.20;Dortmund vs PSG|2.50"
  "Man City vs Bayern|2.30;Liverpool vs Man United|1.95;Dortmund vs Leipzig|2.80;Atletico vs Sevilla|1.70;Juventus vs Inter|2.45"
)

color_index=1
fixture_index=1
turn="color"   # alternate: color → fixture → color → fixture

# ── Update CSS colors ─────────────────────────────────────────────────────────

update_colors() {
  local theme="$1"
  IFS='|' read -r acid ink card dark_bg dark_fg light_bg <<< "$theme"

  python3 - "$CSS_FILE" "$acid" "$ink" "$card" "$dark_bg" "$dark_fg" "$light_bg" <<'PYEOF'
import sys, re

css_file = sys.argv[1]
acid, ink, card, dark_bg, dark_fg, light_bg = sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6], sys.argv[7]

with open(css_file, "r") as f:
    content = f.read()

# Update :root background (light mode)
content = re.sub(r'(--background:\s*)#[0-9a-fA-F]{3,8}(;)', f'\\g<1>{light_bg}\\2', content, count=1)
# Update dark mode background
content = re.sub(r'(prefers-color-scheme: dark\}[\s\S]*?--background:\s*)#[0-9a-fA-F]{3,8}', 
                 f'\\g<1>{dark_bg}', content)
# Update dark mode foreground
content = re.sub(r'(prefers-color-scheme: dark\}[\s\S]*?--foreground:\s*)#[0-9a-fA-F]{3,8}', 
                 f'\\g<1>{dark_fg}', content)

with open(css_file, "w") as f:
    f.write(content)

print(f"  OK globals.css => acid={acid} ink={ink} light={light_bg} dark={dark_bg}")
PYEOF
}

# ── Update fixtures in page TSX ───────────────────────────────────────────────

update_fixtures() {
  local fixture_set="$1"
  local ticker_set="$2"

  python3 - "$PAGE_FILE" "$fixture_set" "$ticker_set" <<'PYEOF'
import sys, re

page_file   = sys.argv[1]
fixture_set = sys.argv[2]
ticker_set  = sys.argv[3]

# ── Build MATCHES array ──────────────────────────────────────────────────────
matches_lines = []
for i, match in enumerate(fixture_set.split(";")):
    parts = match.split("|")
    if len(parts) < 6:
        continue
    league, t1, t2, odd, live, featured = parts
    matches_lines.append(
        f"  {{ league: '{league}',   teams: ['{t1}', '{t2}'], odd: '{odd}', live: {live},  featured: {featured}  }},"
    )
matches_str = "[\n" + "\n".join(matches_lines) + "\n]"

# ── Build TICKER_DATA array ──────────────────────────────────────────────────
ticker_lines = []
for item in ticker_set.split(";"):
    parts = item.split("|")
    if len(parts) < 2:
        continue
    teams, odd = parts
    ticker_lines.append(f"  ['{teams}', '{odd}'],")
ticker_str = "[\n" + "\n".join(ticker_lines) + "\n]"

with open(page_file, "r") as f:
    content = f.read()

# Replace MATCHES array
content = re.sub(
    r'const MATCHES\s*=\s*\[[\s\S]*?\](?=\s*\n)',
    f'const MATCHES = {matches_str}',
    content
)

# Replace TICKER_DATA array
content = re.sub(
    r'const TICKER_DATA\s*=\s*\[[\s\S]*?\](?=\s*\n)',
    f'const TICKER_DATA = {ticker_str}',
    content
)

with open(page_file, "w") as f:
    f.write(content)

print(f"  OK page.tsx => {len(fixture_set.split(';'))} fixtures, {len(ticker_set.split(';'))} ticker items")
PYEOF
}

# ── Git push ──────────────────────────────────────────────────────────────────

git_push() {
  local msg="$1"
  local files=("${@:2}")
  git add "${files[@]}"
  git diff --cached --quiet && { echo "  Nothing to commit"; return; }
  git commit -m "$msg"
  git push
  echo "  Pushed to GitHub"
}

# ── Verify files exist ────────────────────────────────────────────────────────

for f in "$CSS_FILE" "$PAGE_FILE"; do
  if [ ! -f "$f" ]; then
    echo "ERROR: Not found: $f"
    echo "  Update CSS_FILE or PAGE_FILE paths at the top of this script."
    exit 1
  fi
done

echo "PredictEarn Cycler — alternating colors & fixtures every ${INTERVAL}s"
echo "  CSS  : $CSS_FILE"
echo "  Page : $PAGE_FILE"
echo "  Ctrl+C to stop"
echo ""

# ── Main loop ─────────────────────────────────────────────────────────────────

while true; do

  if [ "$turn" = "color" ]; then
    theme="${COLOR_THEMES[$color_index]}"
    color_index=$(( (color_index + 1) % ${#COLOR_THEMES[@]} ))
    IFS='|' read -r acid _ _ _ _ _ <<< "$theme"

    echo "$(date '+%H:%M:%S') COLORS => acid=$acid"
    update_colors "$theme"
    git_push "style: theme update acid=$acid" "$CSS_FILE"
    turn="fixture"

  else
    fixture_set="${FIXTURE_SETS[$fixture_index]}"
    ticker_set="${TICKER_SETS[$fixture_index]}"
    fixture_index=$(( (fixture_index + 1) % ${#FIXTURE_SETS[@]} ))

    # get first match as label
    first_match=$(echo "$fixture_set" | cut -d';' -f1 | cut -d'|' -f2,3 | tr '|' ' vs ')
    echo "$(date '+%H:%M:%S') FIXTURES => set $fixture_index ($first_match ...)"
    update_fixtures "$fixture_set" "$ticker_set"
    git_push "fixtures: rotate set $fixture_index" "$PAGE_FILE"
    turn="color"
  fi

  echo "  Next in ${INTERVAL}s..."
  echo ""
  sleep "$INTERVAL"
done