#!/usr/bin/env python3
"""Stage 5 — element explanation docs.

Matches SAM/fallback regions (segment/) to ground-truth elements (slides.json)
by IoU, labels each region, and writes explain/pXX.md with a region table.
Chrome elements (crumb/lockup/page-num) are excluded from IoU core matching.

NOTE: with a real SAM run + Claude vision, region labels/OCR come from vision.
Here labels/text come from the ground-truth element map (deterministic, exact).

Usage: explain.py decks/<deck>
"""
import sys, os, json

deck = sys.argv[1] if len(sys.argv) > 1 else "decks/steelops-capstone"
slides = json.load(open(os.path.join(deck, "design", "slides.json"), encoding="utf-8"))["slides"]
CHROME = {"crumb", "lockup", "page-num"}


def iou(a, b):
    ax, ay, aw, ah = a; bx, by, bw, bh = b
    ix1, iy1 = max(ax, bx), max(ay, by)
    ix2, iy2 = min(ax + aw, bx + bw), min(ay + ah, by + bh)
    iw, ih = max(0, ix2 - ix1), max(0, iy2 - iy1)
    inter = iw * ih
    union = aw * ah + bw * bh - inter
    return inter / union if union else 0.0


os.makedirs(os.path.join(deck, "explain"), exist_ok=True)

for s in slides:
    seg = json.load(open(os.path.join(deck, "segment", f"{s['id']}.json"), encoding="utf-8"))
    regions = seg["regions"]
    els = s.get("elements", [])
    rows = []
    matched_el = set()
    for r in regions:
        best, best_iou = None, 0.0
        for j, e in enumerate(els):
            v = iou(r["box"], e["box"])
            if v > best_iou:
                best, best_iou, best_j = e, v, j
        if best and best_iou >= 0.5:
            matched_el.add(best_j)
            label = best["role"]
            text = best["text"].replace("\n", " / ")
            gt = "✅ " + best["role"] + ("  (chrome)" if best["role"] in CHROME else "")
        else:
            label, text, gt = "unknown", "(OCR 필요)", "⚠️ 미매칭"
        rows.append((r["id"], label, text, r["box"], round(best_iou, 2), gt))
    unmatched = [els[j]["role"] for j in range(len(els)) if j not in matched_el]

    lines = [f"# Slide {s['id']} — {s.get('title','')}", ""]
    lines.append(f"- type: `{s['type']}`  · segment source: `{regions[0]['source'] if regions else 'n/a'}`")
    lines.append(f"- 누락(요소 있으나 region 미매칭): {unmatched if unmatched else '없음'}")
    lines.append("")
    lines.append("| region | label | text(OCR) | box | IoU | gt매칭 |")
    lines.append("|---|---|---|---|---|---|")
    for rid, label, text, box, v, gt in rows:
        lines.append(f"| {rid} | {label} | {text} | {box} | {v} | {gt} |")
    lines.append("")
    lines.append("## 설명")
    lines.append(s.get("notes", ""))
    open(os.path.join(deck, "explain", f"{s['id']}.md"), "w", encoding="utf-8").write("\n".join(lines))

print(f"explained {len(slides)} slides")
