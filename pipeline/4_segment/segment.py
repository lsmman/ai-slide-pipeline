#!/usr/bin/env python3
"""Stage 4 — segment flat PNG into element regions.

Prefers Meta SAM API (env META_SAM_API_URL + META_SAM_API_KEY). When not
configured, falls back to the Stage-2 ground-truth boxes from render/manifest.json
(honest recovery: we know the boxes from compositing). Output: segment/pXX.json.

Usage: segment.py decks/<deck>
"""
import sys, os, json

deck = sys.argv[1] if len(sys.argv) > 1 else "decks/steelops-capstone"
slides = json.load(open(os.path.join(deck, "design", "slides.json"), encoding="utf-8"))["slides"]
man = json.load(open(os.path.join(deck, "render", "manifest.json"), encoding="utf-8"))
mslides = {s["id"]: s for s in man["slides"]}

SAM_URL = os.environ.get("META_SAM_API_URL")
SAM_KEY = os.environ.get("META_SAM_API_KEY")
use_sam = bool(SAM_URL and SAM_KEY)

os.makedirs(os.path.join(deck, "segment"), exist_ok=True)


def sam_regions(png_path):
    """Call Meta SAM API (automatic mask generator). Returns list of boxes."""
    import base64, urllib.request
    with open(png_path, "rb") as f:
        img_b64 = base64.b64encode(f.read()).decode()
    body = json.dumps({"image": img_b64, "mode": "automatic"}).encode()
    req = urllib.request.Request(SAM_URL, data=body,
                                 headers={"Authorization": f"Bearer {SAM_KEY}",
                                          "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.load(r)
    out = []
    for i, m in enumerate(data.get("masks", [])):
        b = m.get("bbox") or m.get("box")
        out.append({"id": i, "box": [int(v) for v in b],
                    "area": int(m.get("area", b[2] * b[3])),
                    "score": float(m.get("predicted_iou", m.get("score", 1.0))),
                    "source": "sam"})
    return out


def fallback_regions(slide_id):
    ms = mslides[slide_id]
    out = []
    for i, e in enumerate(ms["elements"]):
        x, y, w, h = e["box"]
        out.append({"id": i, "box": [x, y, w, h], "area": int(w * h),
                    "score": 1.0, "source": "ground-truth-fallback"})
    return out


for s in slides:
    png = os.path.join(deck, "render", f"{s['id']}.png")
    if use_sam:
        try:
            regions = sam_regions(png)
        except Exception as ex:
            print(f"  SAM failed on {s['id']} ({ex}); using fallback")
            regions = fallback_regions(s["id"])
    else:
        regions = fallback_regions(s["id"])
    json.dump({"image": f"{s['id']}.png", "regions": regions, "sam": use_sam},
              open(os.path.join(deck, "segment", f"{s['id']}.json"), "w"), ensure_ascii=False, indent=2)

mode = "Meta SAM API" if use_sam else "ground-truth fallback (no SAM key)"
print(f"segmented {len(slides)} slides via {mode}")
