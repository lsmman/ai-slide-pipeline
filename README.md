# slide-decks-start

콘텐츠 경로나 주제 한 줄을 **검증된 슬라이드 덱(PDF/PPTX)** 으로 만들어주는 Claude Code 스킬.

```
/slide-decks-start docs/onboarding.md
```

```
아웃라인 → HTML 슬라이드 → validate → 디자인 게이트(리뷰어 2명) → PDF/PPTX → 편집 루프
```

## 설치

```bash
git clone https://github.com/lsmman/ai-slide-pipeline.git
cp -r ai-slide-pipeline/skills/slide-decks-start ~/.claude/skills/
```

끝. 어느 프로젝트에서든 Claude Code가 자동으로 인식한다.

### 요구 사항

| 항목 | 용도 | 필수 |
|---|---|---|
| Node 18+ | slides-grab CLI (`npx -y slides-grab`, 설치 불필요) | ✅ |
| Playwright Chromium | 렌더·검증 | ✅ (`npx playwright install chromium`) |
| `codex login` | AI 이미지 생성 (API 키 불필요) | 선택 — 없으면 CSS 배경 폴백 |

## 사용법

```bash
/slide-decks-start docs/plan.md              # 파일을 덱으로
/slide-decks-start "우리 팀 온보딩 가이드"      # 주제만으로
```

자연어 트리거도 동작: "이 문서로 PPT 만들어줘", "슬라이드로 정리해줘".

흐름:
1. **Plan** — 아웃라인 생성 → 사용자 승인
2. **Design** — 슬라이드당 자립형 HTML(720×405pt, Pretendard) + 필요 시 AI 이미지
3. **Validate** — Playwright 린트 (클리핑·프레임 이탈·빈 캔버스)
4. **Design Gate** — 리뷰어 서브에이전트 2명이 렌더 PNG 전수 검토
   (A: 디자인 시스템 계약 / B: 청중 가독성·한글 조판). **둘 다 PASS 전엔 export 차단**
5. **Export** — PDF(주력) + PPTX(실험적) + 브라우저 뷰어
6. **Edit** — "n번 슬라이드 고쳐줘" → 수정 → 재검증 → 재내보내기

## 특징

- **한글 조판 규칙 내장** — `word-break: keep-all`, 하이픈 토큰 nowrap, 10pt 하한 등
  실제 게이트에서 걸렸던 함정들이 처방과 함께 스킬에 박제되어 첫 렌더부터 회피
- **7슬롯 이미지 프롬프트** (`references/image-prompting.md`) —
  MEDIUM · SUBJECT(은유) · COMPOSITION(**텍스트존 예약**) · COLOR(헥스+비율) ·
  STYLE ANCHOR(덱 전체 일관성) · RENDER · NEGATIVES. 텍스트와 안 싸우는 배경을 뽑는다
- **스타일 시스템** — 기본 clean-white+인디고, 동봉 `styles/executive-navy.slides.md`
  (컨설팅 보고서 톤: 네이비+브론즈, 타이포 주도), slides-grab 번들 35종도 선택 가능
- **품질 증빙** — 게이트 보고서에 렌더 PNG 파일명 + 소스 sha256 지문 첨부, 잔여 이슈는 design-debt로 추적

## 예제

| 경로 | 스타일 | 설명 |
|---|---|---|
| `examples/j-space` | executive-navy (이미지 없음) | Anthropic J-space 연구 브리핑 12장 |
| `examples/claude-code-intro` | clean-white + AI 이미지 3장 | Claude Code 소개 12장 |

```bash
npx slides-grab pdf --slides-dir examples/j-space/slides --output j-space.pdf
npx slides-grab build-viewer --slides-dir examples/j-space/slides && open examples/j-space/slides/viewer.html
```

## 선택: MCP 서버 (`tools/slides-grab-mcp`)

slides-grab CLI를 function calling 툴 11개로 노출하는 stdio 서버
(validate / design_gate / render_png / export_pdf·pptx / generate_image 등).
프로젝트에 `.mcp.json`을 복사하고 `npm install` 하면 활성화. CLI만으로도 스킬은 완전 동작한다.

## 구조

```
skills/slide-decks-start/
├── SKILL.md                        # 파이프라인 절차 + 함정 퀵레퍼런스
├── references/image-prompting.md   # 7슬롯 이미지 프롬프트 가이드
└── styles/executive-navy.slides.md # 커스텀 스타일 스펙
tools/slides-grab-mcp/              # (선택) MCP 서버
examples/                           # 완성 덱 소스 2종
```

## License

MIT
