// Stage 6 — assemble two decks with pptxgenjs:
//   out/deck-image.pptx    : flat render PNG as full-bleed bg + speaker notes
//   out/deck-editable.pptx : text-free bg PNG + native editable text boxes + notes
// Usage: node pipeline/6_assemble/assemble.js decks/<deck>
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const deck = process.argv[2] || "decks/steelops-capstone";
const slides = JSON.parse(fs.readFileSync(path.join(deck, "design", "slides.json"), "utf-8")).slides;

const CW = 13.333, CH = 7.5;          // inches (16:9)
const PX = CW / 1920;                  // inch per px
const inX = (px) => +(px * PX).toFixed(3);

// class -> point size (px * 0.75) ; chrome.css px values
const CLASS_PT = {
  "t-cover-title": 64, "t-section-title": 60, "t-section-num": 40,
  "t-title": 40, "t-title-sm": 34, "t-h2": 28, "t-h3": 24,
  "t-body": 18, "t-body-bold": 18, "t-small": 15, "t-tiny": 13,
  "t-tag": 17, "crumb": 17, "edu-mark": 14, "page-num": 13,
};
const BOLD = new Set(["t-cover-title", "t-section-title", "t-section-num", "t-title", "t-title-sm", "t-h2", "t-body-bold", "t-tag", "crumb"]);
const CARD_FILL = { "card": "FFFFFF", "card-soft": "E8E9FF", "card-softer": "F0F0FF", "card-purple": "4F46E5", "card-deep": "312E81" };
const CARD_WHITE_TEXT = new Set(["card-purple", "card-deep"]);
const PURPLE = "6366F1", INK = "1A1A1A";

function notesOf(s) { return s.notes || ""; }

function textColor(s, e) {
  const v = (e.style || {}).variant;
  if (v && CARD_WHITE_TEXT.has(v)) return "FFFFFF";
  if (s.type === "closing") return "FFFFFF";
  if ((e.style || {}).class === "crumb" || e.role === "crumb") return PURPLE;
  if ((e.style || {}).class === "t-section-num") return PURPLE;
  return INK;
}

function buildImage(pres) {
  for (const s of slides) {
    const slide = pres.addSlide();
    const png = path.join(deck, "render", `${s.id}.png`);
    slide.background = { path: png };
    slide.addNotes(notesOf(s));
  }
}

function buildEditable(pres) {
  for (const s of slides) {
    const slide = pres.addSlide();
    const bg = path.join(deck, "assets", "backgrounds", `${s.id}.png`);
    if (fs.existsSync(bg)) slide.background = { path: bg };
    else slide.background = { color: s.type === "closing" ? "14193C" : "F4F4FF" };

    for (const e of s.elements || []) {
      const [x, y, w, h] = e.box;
      const cls = (e.style || {}).class || "t-body";
      const variant = (e.style || {}).variant;
      if (variant && CARD_FILL[variant]) {
        slide.addShape(pres.ShapeType.roundRect, {
          x: inX(x), y: inX(y), w: inX(w), h: inX(h),
          fill: { color: CARD_FILL[variant] }, line: { type: "none" }, rectRadius: 0.12,
        });
      }
      slide.addText(String(e.text), {
        x: inX(x), y: inX(y), w: inX(w), h: inX(h),
        fontSize: CLASS_PT[cls] || 18, bold: BOLD.has(cls),
        color: textColor(s, e), fontFace: "Noto Sans KR",
        align: "left", valign: variant ? "middle" : "top",
        margin: variant ? 8 : 2, wrap: true,
      });
    }
    slide.addNotes(notesOf(s));
  }
}

(async () => {
  fs.mkdirSync(path.join(deck, "out"), { recursive: true });

  const img = new pptxgen();
  img.defineLayout({ name: "C", width: CW, height: CH });
  img.layout = "C";
  buildImage(img);
  await img.writeFile({ fileName: path.join(deck, "out", "deck-image.pptx") });

  const ed = new pptxgen();
  ed.defineLayout({ name: "C", width: CW, height: CH });
  ed.layout = "C";
  buildEditable(ed);
  await ed.writeFile({ fileName: path.join(deck, "out", "deck-editable.pptx") });

  console.log(`assembled image + editable pptx (${slides.length} slides each)`);
})();
