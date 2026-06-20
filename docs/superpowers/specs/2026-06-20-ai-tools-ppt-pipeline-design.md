# AI 도구 실무 PPT — 재사용 파이프라인 설계

- **Date:** 2026-06-20
- **Status:** Approved (design)
- **First deck topic:** AI 도구 실무 활용
- **References:** `ai-literacy-pptx.skill` (skill_a), `upstage-edu-uct-deck.skill` (skill_b)

## 1. 목표

커리큘럼 내용을 입력받아 교육용 슬라이드 덱을 생성하는 **재사용 파이프라인**을 구축한다.
한 번 쓰고 버리는 덱이 아니라, 분량이 가변인 커리큘럼을 그때그때 받아 돌리는 도구다.
첫 적용 주제는 "AI 도구 실무 활용".

핵심 흐름: **Claude 설계 → codex 이미지 렌더 → PDF → SAM 세그먼트 → 설명 문서 → pptx (2종)**

## 2. 핵심 결정 사항

| 결정 | 선택 | 근거 |
|---|---|---|
| 이미지 생성 방식 | **B: 배경+텍스트 합성 후 평탄화** | 순수 AI 이미지생성은 한글 텍스트가 깨짐. 이미지모델은 배경/일러스트만 생성(텍스트 0), 진짜 텍스트는 HTML로 합성 후 평탄 PNG export. 결과물은 여전히 불투명 평탄 이미지라 SAM 세그먼트 명분 유지 + 글자 선명. |
| 세그먼트 모델 | **Meta SAM API 우선, SAM2 폴백** | SAM3 로컬 미설치/접근 불확실. SAM2는 공개. 로컬 설치 없이 API 우선. |
| 요소 인식 깊이 | **SAM 마스크 + Claude 비전 라벨링** | SAM은 마스크/박스만 줄 뿐 "제목/카드/아이콘" 의미 라벨 없음. Claude 비전이 각 영역 라벨+OCR. |
| 최종 PPT | **이미지 pptx + 편집 pptx 둘 다** | 이미지: 픽셀 완벽 재현(편집 불가). 편집: 근사 네이티브 텍스트박스(편집 가능). |
| 분량 | **slides.json 길이로 파라미터화** | 커리큘럼 양에 따라 가변. |

## 3. 데이터 계약 — `slides.json`

파이프라인 전체를 구동하는 단일 소스. Claude(Stage 1)가 생성.
`elements[].box`가 **요소 ground-truth 맵** — Stage 2 합성 때 확보되고 Stage 4 SAM이 대조/검증한다.

```json
{
  "deck": "ai-tools-practical",
  "palette": "midnight-executive",
  "canvas": { "w": 1920, "h": 1080 },
  "slides": [
    {
      "id": "p01",
      "type": "cover",
      "title": "...",
      "subtitle": "...",
      "elements": [
        { "role": "title", "text": "...", "box": [x, y, w, h], "style": {} },
        { "role": "subtitle", "text": "...", "box": [x, y, w, h], "style": {} }
      ],
      "image_prompt": "lavender abstract arc background, NO text, ...",
      "notes": "강사 멘트 150자 이상"
    }
  ]
}
```

- `box`는 1920×1080 픽셀 좌표 `[x, y, w, h]`.
- `image_prompt`는 **반드시 "no text"** — 배경/일러스트 전용.
- `type`은 skill_a 슬라이드 타입(cover/agenda/concept/compare/steps/practice/summary/assignment/closing).
- `notes`는 슬라이드 비표시, 강사 멘트(skill_a 기준 150자+).

## 4. 6단계 파이프라인

| 단계 | 담당 | 입력 → 출력 |
|---|---|---|
| **1 설계** | Claude | 커리큘럼 내용 → `design/slides.json` + `design/planning.md`(skill_a Phase1 포맷). **유저 검토 체크포인트** — 확정 후 다음 단계. |
| **2 렌더** | codex + 이미지생성 MCP | 슬라이드별: ① 이미지모델로 배경/일러스트만 생성(no text) → `assets/backgrounds/pXX.png` ② HTML(skill_b chrome.css)에 배경 + 진짜 텍스트(elements) 배치 ③ Playwright 스크린샷 → **평탄 PNG 1920×1080** `render/pXX.png`. 실제 렌더 박스를 slides.json에 역기록. |
| **3 PDF** | 스크립트 | `render/*.png` → `out/deck.pdf` (img2pdf 또는 Pillow). |
| **4 세그먼트** | Meta SAM API (SAM2 폴백) | `render/pXX.png` → 영역 마스크/박스 `segment/pXX.json`. |
| **5 설명문서** | Claude 비전 | PNG + SAM 박스 → 각 영역 라벨링 + OCR → Stage 1 ground-truth 박스와 대조 → `explain/pXX.md` 요소 분해표. 불일치는 QA 신호로 플래그. |
| **6 조립** | pptxgenjs | ① **이미지 pptx**: 슬라이드 = 평탄 PNG 통배경 + `addNotes`. ② **편집 pptx**: 배경(또는 AI 배경) + ground-truth/SAM 박스 위치에 네이티브 텍스트박스(복구 텍스트) + `addNotes`. |

## 5. 폴더 구조

```
ppt-project/
  pipeline/
    1_design/        # 설계 보조 스크립트/스키마
    2_render/        # 이미지생성 프롬프트 빌더 + HTML 합성 + 스크린샷
    3_pdf/           # PNG → PDF
    4_segment/       # SAM API 클라이언트
    5_explain/       # 비전 라벨링 + 대조
    6_assemble/      # pptxgenjs (image / editable)
  decks/
    ai-tools-practical/
      design/   slides.json  planning.md
      assets/   backgrounds/*.png
      render/   *.png
      segment/  *.json
      explain/  *.md
      out/      deck.pdf  deck-image.pptx  deck-editable.pptx
  config/
    palette.json     # skill_a 팔레트
    chrome.css       # skill_b 비주얼 시스템
```

## 6. 기술 스택

- **Claude** — 설계(Stage 1), 비전 라벨링(Stage 5)
- **codex CLI** — Stage 2 오케스트레이션(프롬프트 빌더, 이미지 API 호출, 합성/스크린샷 스크립트)
- **이미지생성** — higgsfield `generate_image` MCP (배경 전용)
- **Node** — Playwright(HTML 합성 스크린샷), pptxgenjs(pptx 2종), PDF 조립
- **Python** — Meta SAM API 클라이언트 (SAM2 폴백)
- **디자인 자산** — skill_a 팔레트/pptx 규칙 + skill_b chrome.css/Know→Do→Prove

## 7. 디자인 시스템

- **타입**: skill_a 슬라이드 타입(cover/concept/compare/steps/summary…)
- **비주얼**: skill_b — 라벤더-화이트 캔버스(#F4F4FF), 퍼플 액센트(#6366F1/#4F46E5/#312E81), Noto Sans KR, 좌상단 섹션 크럼 + 우상단 Upstage Education 로크업 크롬, 다크 인터루드 페이지, theory/practice 2-pane(Know→Do→Prove)
- **팔레트**: `config/palette.json` (기본 `midnight-executive`)

## 8. pptxgenjs 규칙 (skill_a)

1. hex 색상에 `#` 금지 (파일 손상)
2. shadow 객체 재사용 금지 → `makeShadow()` 패턴
3. 모든 슬라이드 `addNotes(notes)`
4. 단일 `.js` 파일, `node` 실행

## 9. 검증 루프 (skill_a QA)

```
node create_pptx.js
python -m markitdown out/deck-editable.pptx   # 텍스트 확인
# PDF → 이미지 육안 검토
```
최소 1회 fix-and-verify 사이클 없이 완료 선언 금지.

## 10. 리스크 / 한계

- **AI 이미지 텍스트 깨짐** → B 접근(이미지에 텍스트 0)으로 해결.
- **SAM 마스크 무라벨** → Claude 비전 라벨+OCR로 보완.
- **SAM3 미가용** → SAM2 폴백.
- **편집 pptx 정밀도** → 근사 편집. 픽셀 완벽은 이미지 pptx 쪽. 문서에 명시.
- **이미지생성 디자인 일관성** → 배경만 생성 + 공유 chrome.css가 일관성 담보.

## 11. 비범위 (YAGNI)

- 애니메이션/트랜지션
- 실시간 협업/웹 뷰어
- 첫 주제(AI 도구 실무) 외 다른 주제 콘텐츠 (파이프라인은 가변이나 콘텐츠는 입력 시)
