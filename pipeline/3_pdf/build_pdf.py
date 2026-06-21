#!/usr/bin/env python3
"""Stage 3 — render PNGs -> single PDF. Usage: build_pdf.py decks/<deck>"""
import sys, os, json
from PIL import Image

deck = sys.argv[1] if len(sys.argv) > 1 else "decks/steelops-capstone"
slides = json.load(open(os.path.join(deck, "design", "slides.json"), encoding="utf-8"))["slides"]
imgs = []
for s in slides:
    p = os.path.join(deck, "render", f"{s['id']}.png")
    imgs.append(Image.open(p).convert("RGB"))
os.makedirs(os.path.join(deck, "out"), exist_ok=True)
pdf_path = os.path.join(deck, "out", "deck.pdf")
imgs[0].save(pdf_path, save_all=True, append_images=imgs[1:], resolution=96.0)
json.dump({"pages": len(imgs)}, open(os.path.join(deck, "out", "pdf_manifest.json"), "w"))
print(f"PDF {pdf_path} ({len(imgs)} pages)")
