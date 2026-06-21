// Stage 2 — render: SVG/CSS background (no AI text) + real text composite -> flat PNG.
// Also measures actual element boxes and overflow, writes render/manifest.json.
//
// Usage: node pipeline/2_render/render.js decks/<deck>
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const deck = process.argv[2] || "decks/steelops-capstone";
const root = process.cwd();
const slides = JSON.parse(
  fs.readFileSync(path.join(deck, "design", "slides.json"), "utf-8")
).slides;
const chromeCss = fs.readFileSync(path.join(root, "config", "chrome.css"), "utf-8");

const CANVAS_W = 1920, CANVAS_H = 1080, TOL = 6;

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function multiline(s) {
  return esc(s).replace(/\n/g, "<br>");
}

// Deterministic lavender / dark background per slide (NO text — pure decoration).
function backgroundCss(slide) {
  const dark = slide.type === "closing" ||
    (slide.elements || []).some(e => (e.style || {}).variant === "dark") ||
    /dark|navy/i.test(slide.image_prompt || "");
  if (dark) {
    return `background:
      radial-gradient(1200px 700px at 78% 96%, rgba(99,102,241,0.35), transparent 60%),
      radial-gradient(900px 600px at 15% 10%, rgba(49,46,129,0.55), transparent 55%),
      linear-gradient(135deg, #0B1030 0%, #14193C 55%, #1C1B4B 100%);`;
  }
  return `background:
    radial-gradient(1100px 700px at 88% 92%, rgba(99,102,241,0.18), transparent 60%),
    radial-gradient(800px 600px at 8% 6%, rgba(99,102,241,0.10), transparent 55%),
    radial-gradient(600px 600px at 95% 8%, rgba(79,70,229,0.10), transparent 60%),
    linear-gradient(160deg, #F7F7FF 0%, #F4F4FF 60%, #ECEDFF 100%);`;
}

function elementHtml(e) {
  const [x, y, w, h] = e.box;
  const cls = (e.style || {}).class || "t-body";
  const variant = (e.style || {}).variant; // card-* | dark
  const isCard = variant && variant.startsWith("card");
  const wrapStyle = `position:absolute; left:${x}px; top:${y}px; width:${w}px; height:${h}px; box-sizing:border-box;`;
  const inner = `<div class="${cls}" style="position:static; margin:0;">${multiline(e.text)}</div>`;
  if (isCard) {
    // card bg fills the box; text class controls typography
    return `<div data-el="${e.role}" class="${variant}" style="${wrapStyle} display:flex; flex-direction:column; justify-content:center;">${inner}</div>`;
  }
  return `<div data-el="${e.role}" style="${wrapStyle}">${inner}</div>`;
}

function slideHtml(slide) {
  const dark = slide.type === "closing";
  const els = (slide.elements || []).map(elementHtml).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${chromeCss}
html,body{margin:0;padding:0;}
.stage{position:relative;width:${CANVAS_W}px;height:${CANVAS_H}px;overflow:hidden;${backgroundCss(slide)}${dark ? "color:#fff;" : ""}}
</style></head><body>
<div class="stage">${els}</div>
</body></html>`;
}

(async () => {
  const outDir = path.join(deck, "render");
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: CANVAS_W, height: CANVAS_H }, deviceScaleFactor: 1 });
  const manifest = { deck, canvas: [CANVAS_W, CANVAS_H], slides: [] };

  for (const slide of slides) {
    await page.setContent(slideHtml(slide), { waitUntil: "networkidle" });
    // measure actual boxes + overflow
    const measured = await page.evaluate((tol) => {
      const W = 1920, H = 1080;
      const out = [];
      document.querySelectorAll("[data-el]").forEach((node) => {
        const r = node.getBoundingClientRect();
        const declaredH = parseFloat(node.style.height) || r.height;
        const contentH = node.scrollHeight;
        const contentW = node.scrollWidth;
        const overflow =
          contentH > declaredH + tol ||
          contentW > node.clientWidth + tol ||
          r.left < -tol || r.top < -tol ||
          r.right > W + tol || r.bottom > H + tol;
        out.push({
          role: node.getAttribute("data-el"),
          box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
          contentH: Math.round(contentH), declaredH: Math.round(declaredH),
          overflow,
        });
      });
      return out;
    }, TOL);

    const pngPath = path.join(outDir, `${slide.id}.png`);
    await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: CANVAS_W, height: CANVAS_H } });

    // text-free background (for editable pptx): hide elements, screenshot again
    const bgDir = path.join(deck, "assets", "backgrounds");
    fs.mkdirSync(bgDir, { recursive: true });
    await page.evaluate(() => document.querySelectorAll("[data-el]").forEach((n) => (n.style.display = "none")));
    await page.screenshot({ path: path.join(bgDir, `${slide.id}.png`), clip: { x: 0, y: 0, width: CANVAS_W, height: CANVAS_H } });

    const slideOverflow = measured.some((m) => m.overflow);
    // write actual boxes back into a copy
    manifest.slides.push({
      id: slide.id, png: `${slide.id}.png`, overflow: slideOverflow,
      elements: measured,
    });
    console.log(`${slide.id} rendered${slideOverflow ? "  OVERFLOW" : ""}`);
  }

  await browser.close();
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  const bad = manifest.slides.filter((s) => s.overflow).map((s) => s.id);
  console.log(`\nrendered ${manifest.slides.length} slides; overflow: ${bad.length ? bad.join(",") : "none"}`);
})();
