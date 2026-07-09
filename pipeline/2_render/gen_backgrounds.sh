#!/usr/bin/env bash
# Stage 2a — generate AI background images via codex image generation.
# Usage: bash pipeline/2_render/gen_backgrounds.sh decks/<deck> "p01 p02 ..."
# Reads image_prompt per slide from design/slides.json, writes assets/ai-backgrounds/<id>.png.
set -e
DECK="${1:-decks/steelops-capstone}"
IDS="${2:?slide ids required, e.g. \"p01 p02 p18\"}"
OUT="$DECK/assets/ai-backgrounds"
mkdir -p "$OUT"

STYLE="Wide 16:9 presentation slide background, editorial minimal, very subtle low-contrast decoration, generous negative space so overlaid text stays readable, absolutely NO text, NO letters, NO words, NO logos, NO watermarks."

gen_one() {
  id="$1"
  prompt=$(python3 -c "
import json,sys
d=json.load(open('$DECK/design/slides.json',encoding='utf-8'))
print(next(s['image_prompt'] for s in d['slides'] if s['id']=='$id'))
")
  echo "[$id] generating..."
  codex exec --sandbox workspace-write --skip-git-repo-check \
    "Use your image generation tool to create this image: ${prompt}. ${STYLE} Save it to $OUT/$id.png, then run: sips -z 1080 1920 $OUT/$id.png to make it exactly 1920x1080. Do not draw programmatically; only use the image generation model." \
    > "$OUT/$id.log" 2>&1 || { echo "[$id] FAILED"; return 1; }
  echo "[$id] done"
}

export DECK OUT STYLE
export -f gen_one
echo "$IDS" | tr ' ' '\n' | xargs -P 3 -I{} bash -c 'gen_one {}'
ls -la "$OUT"
