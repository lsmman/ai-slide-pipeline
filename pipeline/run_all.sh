#!/usr/bin/env bash
# Run the full imagegen-ppt-pipeline for a deck and score it.
set -e
DECK="${1:-decks/steelops-capstone}"
echo "== Stage 2 render ==";   node   pipeline/2_render/render.js   "$DECK"
echo "== Stage 3 pdf ==";      python3 pipeline/3_pdf/build_pdf.py  "$DECK"
echo "== Stage 4 segment ==";  python3 pipeline/4_segment/segment.py "$DECK"
echo "== Stage 5 explain ==";  python3 pipeline/5_explain/explain.py "$DECK"
echo "== Stage 6 assemble =="; node   pipeline/6_assemble/assemble.js "$DECK"
echo "== QA score ==";         python3 qa/score.py "$DECK"
