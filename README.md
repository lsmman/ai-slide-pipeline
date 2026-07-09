# ai-slide-pipeline

Claude Code로 슬라이드 덱을 **기획 → 디자인 → 검증 → 내보내기**까지 자동 생성하는 프로젝트.
두 개의 파이프라인, 재사용 스킬 하나, MCP 서버 하나, 그리고 그것들로 실제 뽑은 덱 4종이 들어 있다.

## 결과물 미리보기

| 덱 | 파이프라인 | 스타일 | 내용 |
|---|---|---|---|
| `decks/steelops-capstone` | imagegen (JSON 주도) | 화이트 + Pretendard + codex AI 배경 | 멀티에이전트 캡스톤 발표, 18장, QA 100/100 |
| `decks/claude-code-intro` | slides-grab (HTML 주도) | 화이트 + 인디고, AI 이미지 3장 | Claude Code 사내 소개, 12장 |
| `decks/skill-intro` | slides-grab | 화이트 + 인디고 | 스킬 자기소개(셀프 데모), 11장 |
| `decks/j-space` | slides-grab | **executive-navy** (이미지 없음) | Anthropic J-space 연구 브리핑, 12장 |

각 덱의 `slides/*.html`이 소스, `out/`(pdf·pptx)과 렌더 PNG는 git 미추적 — 아래 명령으로 재생성.

## 파이프라인 1 — imagegen (JSON 주도, 편집 가능 pptx)

```
slides.json → 렌더(Playwright) → PDF → 세그먼트 → 설명문서 → 조립(pptxgenjs) → QA 점수
```

- 단일 소스 `design/slides.json` (요소별 좌표 박스) → 결정적 재생성
- 산출물: 픽셀 완벽 이미지 pptx + **네이티브 텍스트박스 편집 pptx** + PDF + 요소 설명문서
- 정량 QA: `python3 qa/score.py decks/<deck>` (0–100, 임계 90)

```bash
npm install && npx playwright install chromium
bash pipeline/run_all.sh decks/steelops-capstone
```

## 파이프라인 2 — slides-grab (HTML 주도, 디자인 게이트)

```
아웃라인 → slide-NN.html → validate(린트) → 디자인 게이트(리뷰어 A/B) → PDF/PPTX/뷰어
```

- 슬라이드당 자립형 HTML(720×405pt), 자유 디자인
- **디자인 게이트**: 서브에이전트 리뷰어 2명(A 계약 무결성 / B 청중 가독성)이 렌더 PNG를
  전수 검토, 둘 다 PASS + `design-gate proceed` 영수증 없으면 export가 차단됨
- 게이트 산출물이 덱마다 남아 있음: `gate-pass-a.md` / `gate-pass-b.md` / `design-debt.md`

```bash
npx slides-grab install-skills --target claude-code --scope project   # .claude/ 벤더 스킬 복원
npx slides-grab validate --slides-dir decks/j-space/slides
npx slides-grab pdf --slides-dir decks/j-space/slides --output decks/j-space/out/deck.pdf
```

## 재사용 스킬 — `skills/slide-decks-start`

위 slides-grab 흐름 전체를 어느 프로젝트에서든 한 줄로 돌리는 Claude Code 스킬.
`~/.claude/skills/`에 복사하면 `/slide-decks-start <path|주제>` 또는 "PPT 만들어줘"로 발동.

- 실측 기반 함정 표(한글 keep-all, 10pt 하한, flex 장식 소멸, 게이트 영수증 등) 내장
- `references/image-prompting.md` — AI 이미지 프롬프트 **7슬롯 템플릿**
  (은유 라이브러리 · 텍스트존 예약 · 스타일 앵커 · 네거티브 세트)
- `styles/executive-navy.slides.md` — 컨설팅 보고서 톤 커스텀 스타일 (네이비+브론즈, 타이포 주도)
- TDD로 제작: 실패 기록(RED) → 서브에이전트 드라이런 검증(GREEN) → 갭 봉합(REFACTOR)

## MCP 서버 — `tools/slides-grab-mcp`

slides-grab CLI를 function calling으로 노출하는 MCP stdio 서버 (`.mcp.json` 등록, 툴 11개):
validate · design_gate · render_png · export_pdf/pptx · generate_image(codex 로그인 재사용, API 키 불필요) 등.

## 요구 사항

- Node 18+, Python 3.10+ (Pillow, python-pptx — imagegen 파이프라인용)
- Playwright Chromium
- AI 이미지 생성: `codex login` (선택 — 없으면 CSS 배경 폴백)

## 구조

```
pipeline/    imagegen 파이프라인 스크립트 (render/pdf/segment/explain/assemble)
qa/          imagegen 정량 QA 스코어러
decks/       덱 4종 (소스 + 기획/게이트 문서)
skills/      slide-decks-start 스킬 + 레거시 imagegen 스킬
tools/       slides-grab MCP 서버
config/      공용 chrome.css · palette.json · Pretendard 폰트
docs/        초기 설계 스펙
```
