---
name: slide-decks-start
description: Use when the user asks to build a presentation/PPT/slide deck from a content path or topic — e.g. "PPT 만들어줘", "덱 만들어줘", "슬라이드로 정리해줘", "make a deck from docs/x.md" — or wants the slides-grab pipeline (outline → HTML slides → validate → design gate → export → edit) run end-to-end.
---

# Building Slide Decks (slides-grab pipeline)

## Overview
콘텐츠 경로(또는 주제)를 입력받아 slides-grab으로 HTML 슬라이드 덱을 만들고,
검증 피드백 루프(validate + design gate)를 돌린 뒤 PDF/PPTX로 내보내고,
마지막에 사용자가 직접 편집할 수 있게 viewer/editor를 제시하는 전 과정.

**Iron rule: export(pdf/convert)는 design-gate `proceed` 영수증 없이는 CLI가 차단한다.
게이트를 우회하려 하지 말고 통과시켜라.**

## Inputs
- `source`: 내용 소스 — 파일/디렉토리 경로(md, docs) 또는 주제 문장. 경로면 먼저 Read.
- `deck_dir`(선택): 덱 작업 경로. 기본 `decks/<slug>/slides` (프로젝트 안) 또는 `./<slug>-deck/slides`.
- 스타일 지정 없으면 기본: **clean white `#FFFFFF` + Pretendard + 인디고 `#4F46E5` 액센트, editorial minimal**.
- 사용자가 "전문적/보고서/컨설팅/경영진" 톤을 원하면 동봉 스타일 **executive-navy** 사용:
  `npx slides-grab show-design ~/.claude/skills/slide-decks-start/styles/executive-navy.slides.md`로
  스펙 로드 후 그 토큰·레이아웃·Avoid 규칙을 따른다 (네이비 풀블리드 커버/클로징,
  브론즈 포인트 슬라이드당 1곳). **이 스타일에서는 이미지 생성 단계를 통째로 생략** —
  커버/클로징의 네이비는 CSS 단색이고, 사진·일러스트 배경은 스펙의 Avoid 목록에 있다.
  다른 무드는 `list-styles` 번들 35종 후보.

## CLI 확보
우선순위: ① 프로젝트 `node_modules/.bin/slides-grab` ② `npx -y slides-grab` (설치 없이 실행).
npm 프로젝트가 아니거나 package.json을 건드리면 안 되면 ②만 쓴다 — `npm install` 강요 금지.
프로젝트에 `mcp__slides-grab__*` MCP 툴이 붙어 있으면 CLI 대신 그 툴 사용 가능(동일 기능).

이미지 생성 전제: `~/.codex/auth.json` 존재(= `codex login` 완료, god-tibo provider, API 키 불필요).
**미로그인이면 이미지 생성을 생략하고 CSS 배경/일러스트로 폴백**, 최종 보고에서
"`codex login` 후 이미지 추가 가능"을 안내한다. 이미지 없다고 파이프라인을 멈추지 마라.

## Workflow

### 1. Plan
1. source 읽고 청중·톤 파악 → `<deck_dir>/../slide-outline.md` 작성
   (Meta: Topic/Audience/Tone/Slide Count/Aspect 16:9 + `style:` 블록).
2. 분량: 소개·온보딩류 10–12장, 30분 발표 12–15장, 그 이상은 사용자에게 발표 시간 확인.
   애매하면 12장 기준으로 만들고 아웃라인에 명시.
3. 대화형 세션이면 아웃라인 승인받고 진행. 자율 실행이면 진행 후 최종 보고에 아웃라인 포함.

### 2. Design — slide HTML
`<deck_dir>/slide-01.html … slide-NN.html`, 각 파일 자립형. **필수 규칙:**
- body: `width:720pt; height:405pt; position:relative;` — **position:relative 누락 시
  absolute 자식(페이지 번호 등)이 `overflow-outside-frame` 에러를 낸다.**
- body에 `word-break: keep-all; text-wrap: pretty;` — **누락 시 한글 어절 중간 줄바꿈(도/구) → 게이트 블로커.**
  단, keep-all도 하이픈 토큰("J-space가")은 하이픈에서 쪼갠다 — 용어·수치 토큰은 `white-space: nowrap` span.
- 텍스트에 border-bottom 밑줄 span을 쓰면 라인박스 밖으로 삐져 `text-clipped` — 부모(h1/h2/p)에
  `padding-bottom`(밑줄 두께+여백만큼)으로 흡수.
- 고정높이 flex 컬럼(body) 안 얇은 장식 div(헤더 룰·푸터)는 내용이 꽉 차면 **flex-shrink로 0높이 소멸**
  — 렌더에서 조용히 사라지고 게이트에서 잡힌다. 장식·푸터에는 `flex-shrink: 0`.
- 폰트: `<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">`
  + `font-family:'Pretendard',sans-serif` (코드 토큰만 ui-monospace).
- 텍스트 크기: 본문 12pt 이상, 기능 라벨(페이지 번호·eyebrow) 10pt — **10pt 미만은 게이트 Critical.**
- 시맨틱 태그(p, h1-h6, ul/li) 유지. 원격 이미지 URL 금지 — 에셋은 `./assets/` 로컬.
- `<deck_dir>/design-notes.md`에 디자인 시스템 선언: 사용하는 **모든 hex를 토큰 표로 문서화**
  (미문서화 색 = 게이트 Major), 타입 스케일, 배경 2색 이내, 서체 2종 이내.
- 금지(AI slop): 좌측 보더 액센트 카드, 공격적 그라데이션, 획일적 3×2 아이콘 그리드, 더미 수치.
- 아이콘은 Lucide 인라인 SVG. 복잡한 노드/엣지 다이어그램은 tldraw, 단순 플로우는 HTML/CSS.

이미지 (적재적소 — 커버·클로징·일러스트 위주 2–4장):
```bash
npx slides-grab image --prompt "<7슬롯 프롬프트>" --slides-dir <deck_dir> --name <slug> --aspect-ratio 16:9
```
- **프롬프트 작성 전 반드시 `references/image-prompting.md`(이 스킬 동봉)를 읽고 7슬롯 템플릿으로 조립**:
  MEDIUM → SUBJECT(은유 1개, 클리셰 금지) → COMPOSITION(**텍스트존 %+명도 예약**) →
  COLOR(헥스+비율) → STYLE ANCHOR(덱 공용 1문장, 전 이미지 동일) → RENDER → NEGATIVES(전체 세트).
- 다크 이미지는 색상 계열 명시("strictly cool hues, NO warm colors, NO gold" — 안 하면 골드 유입, 게이트 Major).
- **여러 장 병렬 생성 금지 조짐: 결과가 중복될 수 있다. 생성 후 `md5`로 중복 확인, 중복 시 순차 재생성.**
- 생성 후 검수 3종(텍스트존 침범 / 덱 내 질감 일치 / 은유-메시지 정합) — 침범 시 수정 지시를 프롬프트에 명시해 재생성.

### 3. Validate 루프
```bash
npx slides-grab validate --slides-dir <deck_dir> --format concise
```
에러 0 될 때까지 수정-재실행. `text-clipped`는 line-height/폰트 축소, `overflow-outside-frame`은
body position:relative 또는 배치 수정. 의도적 오버레이(sibling-overlap 배경 이미지)는 warning으로 남아도 됨.

### 4. Design gate — 피드백 루프 (필수)
1. 증거 렌더: `npx slides-grab png --slides-dir <deck_dir> --output-dir <deck_dir>/gate-preview --resolution 1080p`
2. `shasum -a 256 <deck_dir>/slide-*.html`로 지문 확보.
3. **리뷰어 서브에이전트 2개 병렬 파견** (읽기 전용, 슬라이드 수정 금지):
   - Pass A: 시스템 계약/제약 무결성 (토큰·타입스케일·slop 검사)
   - Pass B: 청중 임팩트/가독성 (PNG 전수 육안, 한글 조판, 3–5초 스캔)
   - `.claude/skills/slides-grab-design/references/design-gate.md`가 설치돼 있으면 그 계약을 따른다.
     없으면 최소 계약: 보고서에 역할 제목, `VERDICT: PASS|FAIL`, confidence, 검토한 PNG 파일명 목록,
     `slide-*.html: <sha256>` 지문 전체, findings 표(심각도 Critical/Major/Minor/Note), PASS일 때
     `Unresolved Critical: 0` + `Blocking findings: None` 명시.
   - 보고서 저장: `<deck_dir>/gate-pass-a.md`, `<deck_dir>/gate-pass-b.md`.
4. Critical/블로커 수정 → validate → PNG 재렌더 → 재리뷰. **둘 다 VERDICT: PASS 될 때까지 반복.**
5. Minor/Note는 `<deck_dir>/design-debt.md`에 기록(무단 폐기 금지).
6. 영수증: `npx slides-grab design-gate --slides-dir <deck_dir> --verdict proceed --pass-a-report <a.md> --pass-b-report <b.md>`

### 5. Export
출력 기본 경로 `<deck_dir>/../out/` (예: `decks/<slug>/out/`).
```bash
npx slides-grab pdf --slides-dir <deck_dir> --output <deck_dir>/../out/<name>.pdf --resolution 2160p
npx slides-grab convert --slides-dir <deck_dir> --output <deck_dir>/../out/<name>.pptx --resolution 2160p
npx slides-grab build-viewer --slides-dir <deck_dir>
```
- 기본 산출물 = PDF + viewer. 사용자가 "PPT/PPTX"를 요구했으면 pptx도 생성하되
  **"실험적/best-effort 변환"임을 보고에 명시**.
- PDF 페이지 수 = 슬라이드 수 확인.

### 6. 피드백 보고 + 최종 편집 제시 (마지막 단계, 생략 금지)
사용자에게 반드시 제시:
1. **Input 요약**: 아웃라인(장수·구성·스타일) — 뭘 근거로 만들었는지.
2. **Output 피드백**: validate 결과, 게이트 A/B 판정과 수정 라운드 내역, 남은 debt.
3. **최종 편집 경로**:
   - `open <deck_dir>/viewer.html` — 뷰어는 **slides/ 안**에 생성됨 (덱 루트 아님, 경로 주의)
   - `npx slides-grab edit --slides-dir <deck_dir>` — 인터랙티브 에디터
   - "n번 슬라이드 고쳐줘" 요청 시: 해당 HTML 수정 → validate → 게이트 재실행 → 재내보내기.

## Quick reference — 이 세션에서 실제로 터졌던 함정
| 함정 | 증상 | 처방 |
|---|---|---|
| body에 position:relative 누락 | pagenum `overflow-outside-frame` ×10장 | body에 추가 |
| keep-all 누락 | 한글 어절 분리(도/구, 탐/색) → 게이트 REVISE | body에 keep-all+pretty |
| 9pt 라벨 | 게이트 Critical (10pt 하한) | 전부 10pt+ |
| 색상 미문서화 | 게이트 Major ×7색 | design-notes 토큰 표 |
| 다크 이미지 프롬프트에 색 계열 미지정 | 골드 톤 유입 → Major | "cool indigo only, NO warm/gold" |
| 이미지 병렬 생성 | 결과물 바이트 단위 중복 | md5 검사 후 순차 재생성 |
| 게이트 없이 export | CLI가 차단 | proceed 영수증 먼저 |
| viewer 경로 착각 | `open decks/<d>/viewer.html` 실패 | `decks/<d>/slides/viewer.html` |
| 밑줄 span border-bottom | `text-clipped` 에러 (라인박스 초과) | 부모에 padding-bottom 흡수 |
| flex 컬럼 속 얇은 rule/foot | 내용 넘치면 0높이로 소멸 (표 슬라이드에서 빈발) | `flex-shrink: 0` |
| 하이픈 용어 + keep-all | "J-space가" → "J-"/"space가" 분리 | 토큰에 `white-space: nowrap` |
