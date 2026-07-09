<div align="center">

# slide-decks-start

**파일 경로나 주제 한 줄을 검증된 슬라이드 덱(PDF/PPTX)으로 만들어주는 Claude Code 스킬.**

[English](README.md) · [한국어](README.ko.md)

</div>

```mermaid
flowchart LR
    A["📝 Plan<br/>아웃라인 + 승인"] --> B["🎨 Design<br/>HTML 슬라이드 + AI 이미지"]
    B --> C["🔍 Validate<br/>Playwright 린트"]
    C --> D{"🚦 디자인 게이트<br/>적대적 리뷰어 2명"}
    D -- "블로커 발견" --> B
    D -- "둘 다 PASS" --> E["📦 Export<br/>PDF · PPTX · 뷰어"]
    E --> F["✏️ 편집 루프<br/>n번 수정 → 재게이트"]
    style D fill:#4F46E5,stroke:#312E81,color:#fff
    style A fill:#F7F8FC,stroke:#C7CBF2,color:#111827
    style B fill:#F7F8FC,stroke:#C7CBF2,color:#111827
    style C fill:#F7F8FC,stroke:#C7CBF2,color:#111827
    style E fill:#F7F8FC,stroke:#C7CBF2,color:#111827
    style F fill:#F7F8FC,stroke:#C7CBF2,color:#111827
```

```
/slide-decks-start docs/onboarding.md
```

내보내기는 **디자인 게이트 뒤에 잠겨 있다**: 리뷰어 서브에이전트 2명이 렌더된 전체
슬라이드를 검토(시스템 계약 무결성 + 청중 가독성)하고, 둘 다 PASS를 주기 전에는
PDF/PPTX 명령 자체가 거부된다.

## 설치

```bash
git clone https://github.com/lsmman/ai-slide-pipeline.git
cp -r ai-slide-pipeline/skills/slide-decks-start ~/.claude/skills/
```

끝 — 어느 프로젝트에서든 Claude Code가 자동 인식한다.

### 요구 사항

| 항목 | 용도 | 필수 |
|---|---|---|
| Node 18+ | slides-grab CLI (`npx -y slides-grab`, 설치 불필요) | ✅ |
| Playwright Chromium | 렌더·검증 | ✅ `npx playwright install chromium` |
| `codex login` | AI 이미지 생성 (API 키 불필요) | 선택 — 없으면 CSS 배경 폴백 |

## 사용법

```bash
/slide-decks-start docs/plan.md          # 파일을 덱으로
/slide-decks-start "우리 팀 온보딩 가이드"  # 주제만으로
```

자연어 트리거도 동작: "이 문서로 PPT 만들어줘", "슬라이드로 정리해줘".

1. **Plan** — 아웃라인 생성 → 사용자 승인 체크포인트
2. **Design** — 슬라이드당 자립형 HTML(720×405pt, Pretendard), 필요한 곳에만 AI 이미지
3. **Validate** — Playwright 린트: 텍스트 클리핑·프레임 이탈·빈 캔버스
4. **디자인 게이트** — 리뷰어 A(디자인 시스템 계약) + B(청중 가독성·한글 조판)가 렌더
   PNG 전수 검토; 증빙 = PNG 파일명 + 소스 sha256 지문
5. **Export** — PDF(주력) + PPTX(실험적) + 브라우저 뷰어
6. **Edit** — "7번 슬라이드 고쳐줘" → 수정 → 재검증 → 재게이트 → 재내보내기

## 안에 들어 있는 것

- **[SKILL.md](skills/slide-decks-start/SKILL.md)** — 파이프라인 절차 + 실측 함정 표
  (한글 `word-break: keep-all`, 10pt 하한, flex 장식 소멸, 하이픈 토큰 줄바꿈…)
  — 첫 렌더부터 같은 곳에서 안 넘어진다
- **[7슬롯 이미지 프롬프트 가이드](skills/slide-decks-start/references/image-prompting.md)** —
  MEDIUM · SUBJECT(은유) · COMPOSITION(**텍스트존 예약**) · COLOR(헥스+비율) ·
  STYLE ANCHOR(덱 전체 일관성) · RENDER · NEGATIVES. 헤드라인과 안 싸우는 배경
- **[executive-navy 스타일](skills/slide-decks-start/styles/executive-navy.slides.md)** —
  컨설팅 보고서 톤: 네이비+브론즈, 타이포 주도, 이미지 없음. 기본 스타일은
  clean-white+인디고, slides-grab 번들 35종도 선택 가능
- **[MCP 서버](tools/slides-grab-mcp/server.js)** *(선택)* — slides-grab CLI를 function
  calling 툴 11개로 노출 (`validate`, `design_gate`, `render_png`, `export_pdf`,
  `generate_image` 등). [.mcp.json](.mcp.json) 복사 + `npm install`. CLI만으로도 스킬은 완전 동작

## 예제

| 덱 | 스타일 | 비고 |
|---|---|---|
| [examples/j-space](examples/j-space) | executive-navy, 이미지 없음 | Anthropic 전역 작업공간 연구 브리핑 12장 |
| [examples/claude-code-intro](examples/claude-code-intro) | clean-white + AI 이미지 3장 | Claude Code 소개 12장 (이미지 에셋 미포함 — 스킬로 재생성) |

```bash
npx slides-grab pdf --slides-dir examples/j-space/slides --output j-space.pdf
npx slides-grab build-viewer --slides-dir examples/j-space/slides && open examples/j-space/slides/viewer.html
```

## 저장소 구조

```
skills/slide-decks-start/
├── SKILL.md                        # 절차 + 함정 퀵레퍼런스
├── references/image-prompting.md   # 7슬롯 이미지 프롬프트 가이드
└── styles/executive-navy.slides.md # 커스텀 스타일 스펙
tools/slides-grab-mcp/              # (선택) MCP 서버
examples/                           # 완성 덱 소스 2종
```

## License

MIT
