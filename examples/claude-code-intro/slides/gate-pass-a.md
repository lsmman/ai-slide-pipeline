# Pass A: System Contract / Constraint Integrity

VERDICT: PASS
Confidence: High
Evidence: /Users/lsmman/claude/ppt-project/decks/claude-code-intro/slides/gate-preview/slide-01.png, slide-02.png, slide-03.png, slide-04.png, slide-05.png, slide-06.png, slide-07.png, slide-08.png, slide-09.png, slide-10.png, slide-11.png, slide-12.png (rendered 17:06, after last HTML edit 17:04 and asset regeneration 17:05 — all 12 opened and inspected)
Slide fingerprints: slide-01.html: 610ae52e885dfe02a6e0b9964346ed37a217ca71f07966d76c1b1ba860515bae, slide-02.html: 4ef9de0f86cf200899704132e87f7a95dd80ec76e4e34c46b8ee68a47bbc92b6, slide-03.html: e9cb84752f85a635b93dd8e761a6d43b0d095c44b45dbeb0f9a189e8a830787b, slide-04.html: 7316c03d9ab6b70a3857b4c35bda1fd204f0bb600d7a9f3ed020e8f8637eba37, slide-05.html: 4bc47f98d1f92f90d4cf4edbacc4348d53f09f23b74b38444b90ddc4b31f0294, slide-06.html: 0d493c6eaacb13150c707939efb6cfd5e39b3d60e62a6a00b317517c16a48213, slide-07.html: 83e369f0aecd1663d3a90a9ccbad6cfc8b1bd937c4e8fd7b88b4f22cc09e3c57, slide-08.html: fbb3ffb69a5790d0033932ac8f84358a4fb1afa1e4cbe29109547d0565982c34, slide-09.html: d80db6692616bcd813444ad4797179a64f106fb452218b08645829028d25d4e1, slide-10.html: f4077a28dc90332c937b52fb110a34e11d22c1dbb3809636e0ce74543d47e1f6, slide-11.html: 010a0871d2df6e00dbaeff4bfe69cf8f42c507d407cdf508ecddbe20f558cbe9, slide-12.html: fa4931d38b134dbfaa241bb408a086a3d3ebfc4fb670d7be2c8c34985da7cdd5
(Fingerprints recomputed with `shasum -a 256` at review time — all 12 match the dispatched values.)
Unresolved Critical: 0
Blocking findings: None

## Round-1 finding verification (adversarial re-check)

| Round-1 finding | Verified resolution |
|---|---|
| Sub-10pt text (Critical) | RESOLVED. Full font-size sweep of all 12 HTML files: minimum is now 10pt (24 occurrences), and every 10pt use is a declared functional label — `.eyebrow`, `.pagenum`, slide-01 footer keys, slide-06 filecard filename, slide-07 `.col .tag`. No 9pt remains anywhere. Confirmed legible in every rendered PNG. |
| Undocumented hex tokens (Major) | RESOLVED. Exhaustive hex extraction found exactly 14 values: #4F46E5, #FFFFFF, #6B7280, #111827, #E5E7EB, #9CA3AF, #F7F8FC, #C7CBF2, #374151, #A5AAD9, #E3E5FF, #E0E3F8, #D1D5DB, #0E1330 — every one traces to the extended token table in design-notes.md (core, neutral ramp, indigo tints, dark-closing text). Zero orphan hex. (#312E81 "deep" is documented but currently unused — allowed.) |
| Gold tones in closing image (Major) | RESOLVED. assets/closing-bg.png regenerated (17:05); slide-12.png (17:06) shows exclusively deep indigo/violet light streams on the #0E1330-family dark surface — no gold/amber hue anywhere in the frame. |
| Small supporting copy (Major) | RESOLVED. Body/caption sizes now 12–13.5pt (12, 12.5, 13, 13.5pt), subhead 14–19pt — matches the declared type scale; supporting copy on slides 03, 05, 07, 10, 11 reads comfortably in the PNGs. |
| Missing `word-break: keep-all` (Major) | RESOLVED. Every one of the 12 slides carries `word-break: keep-all; text-wrap: pretty` on the body (grep: exactly 1 hit per file for each property). No mid-word 어절 break visible in any rendered PNG. |

## Regression hunt (defects the fixes could have introduced)

- Size bumps → overflow/clipping: inspected all 12 PNGs; no text touches or crosses the frame edge, no cut descenders/받침, no container-clipped children (slide-03 footnote row, slide-05 five-row list, slide-07 three columns, slide-10 callout, slide-11 tip line all fit with margin).
- keep-all → ragged lines: the contract side is applied consistently; rendered wraps land on word boundaries (e.g. slide-05 two-line descriptions, slide-10 callout second line). Line-balance judgment is Pass B's charter; nothing rises to a contract violation here.
- New tokens → drift: the newly documented tint/neutral tokens are used exactly where declared (slide-06 `.dot` #D1D5DB, slide-10 callout border #E0E3F8, slide-12 subtitle #E3E5FF).

## Checks

- [x] System consistency: PASS — Two backgrounds only: #FFFFFF (slides 01–11) + #0E1330-family dark image (slide 12), per declaration. Two typefaces only: `'Pretendard', sans-serif` (all 12 files) + `ui-monospace` stack (4 files, code tokens only). One accent (#4F46E5, 24 uses). Repeated rhythm holds: indigo 10pt eyebrow top-left + 10pt page number bottom-right on all content slides 02–11; cover (01) and closing (12) are the declared poster exceptions. Image-led slides are exactly the declared 01 (cover-hero), 09 (platforms), 12 (closing-bg); 04 and 08 diagrams are simple HTML/CSS nodes as declared.
- [x] Color discipline: PASS — All 14 hex values trace to the design-notes.md token table (see round-1 verification above). Non-hex colors are limited to 4 rgba() values, each an alpha derivation of a documented token: rgba(17,24,39,0.05) = text #111827 shadow on slide-06; rgba(255,255,255,0/0.10/0.25) = #FFFFFF scrim stop (slide-01) and pill fill/border on dark slide-12. No fresh standalone color invented mid-slide. One accent across the deck; two backgrounds max.
- [x] AI slop tropes: PASS — slide-01 `linear-gradient(90deg, #FFFFFF 0%, transparent 22%)` is a left-edge scrim over the hero image, not a full-slide gradient surface. slide-09 `border-left: 1px solid #E5E7EB` is a thin column divider in the platform footer strip, not an accent-stripe card. All inline SVGs (5 on slide-05, 1 on slide-10) are Lucide icons at the declared stroke 1.75 / currentColor — the sanctioned icon system, not product imagery drawn from SVG primitives. Product/hero imagery uses real raster assets (cover-hero.png, platforms.png, closing-bg.png, all present in assets/). No emoji (unicode sweep clean). No 3×2 icon feature grid (slide-05 is a 5-row list, slide-07 is 3 typographic columns, slide-10 is a 2×2 text grid). No generic font stacks. slide-06 filecard shadow is minimal chrome on a meaningful file-window mock, not decoration of empty space.
- [x] Content discipline: PASS — No dummy stats, invented numbers, or fabricated percentages: every %-token in source is a CSS layout value, none is content. Copy claims (npm install command, /init, claude.ai/code, VS Code · JetBrains, docs.anthropic.com/claude-code) are real product facts consistent with the outline. slide-10's "이 발표자료도 Claude Code가 만들었습니다" is a provenance statement about this deck's own pipeline, not invented data. Every badge/label earns its place; nothing added beyond the approved content plan (opener → framing → proof → context → CTA → close, 12/12 present).

## Findings

| Slide | Finding | Severity | Fix | Status |
|-------|---------|----------|-----|--------|
| slide-02 | TOC numeral `.num` at 22pt sits outside the declared scale bands (subhead ≤19pt, headline ≥30pt) — ad-hoc size, though visually coherent | Minor | Either snap to a band or add a "display numeral 22pt" role to the design-notes type scale | tracked (design debt) |
| slide-12 | rgba(255,255,255,0.10)/(0.25) pill fill/border are alpha derivations of documented #FFFFFF, but alpha variants are not listed in the token table | Note | Add one line to design-notes.md documenting white-alpha derivations for the dark closing | tracked |
| slide-06 | Filecard box-shadow rgba(17,24,39,0.05) — traceable 5%-alpha of the text token; carries meaning (file-window mock), below the chrome threshold | Note | None | tracked |
| slide-05 | "수만 파일에서도" is a soft quantitative flourish, not a presented statistic; within content-truth bounds | Note | None (optional: reword to "대규모 코드베이스에서도") | tracked |
