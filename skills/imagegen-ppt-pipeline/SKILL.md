---
name: imagegen-ppt-pipeline
description: 커리큘럼/주제를 AI 이미지생성 기반 슬라이드 덱으로 만들 때 사용한다. 슬라이드를 평탄 이미지로 렌더하고(codex+이미지생성), 그 평탄 이미지에서 요소를 다시 인식해(SAM 세그먼트+Claude 비전) 요소별 설명 문서와 편집 가능한 pptx까지 뽑아야 하는 상황. 트리거 예시는 "이미지로 PPT 뽑아줘", "codex로 슬라이드 이미지 만들고 SAM으로 요소 인식해줘", "AI 도구 실무 교안 이미지 파이프라인 돌려줘", "세그먼트로 슬라이드 요소 설명문서 만들어줘", "curriculum to image deck" 등.
---

# 이미지생성 PPT 파이프라인

커리큘럼 내용을 입력받아 교육 슬라이드 덱을 **AI 이미지생성 기반**으로 만드는 재사용 파이프라인.
한 번 쓰고 버리는 덱이 아니라, 분량이 가변인 커리큘럼을 그때그때 받아 돌리는 도구다.

```
1 설계 → 2 렌더 → 3 PDF → 4 세그먼트 → 5 설명문서 → 6 조립
Claude   codex+img   스크립트   SAM API    Claude비전    pptxgenjs
```

## 핵심 원칙 — 왜 이렇게 동작하나

- **이미지에는 텍스트를 넣지 않는다.** AI 이미지모델은 글자(특히 한글)를 뭉갠다. 이미지모델은 배경/일러스트만 생성하고, 진짜 텍스트는 HTML로 합성한 뒤 **평탄 PNG로 export**한다 (접근법 B).
- 결과물은 여전히 **불투명 평탄 이미지**라, 그 안의 요소를 SAM 세그먼트로 다시 인식하는 단계가 의미를 가진다.
- 합성 단계에서 요소 좌표(ground-truth box)를 확보하므로, SAM은 그 맵을 **대조·검증**하는 인식 레이어로 쓴다.
- SAM은 마스크/박스만 준다. "제목/카드/아이콘" 같은 의미 라벨은 **Claude 비전이 라벨링+OCR**로 붙인다.

## 단계별 흐름

| 단계 | 담당 | 입력 → 출력 |
|---|---|---|
| **1 설계** | Claude | 커리큘럼 내용 → `design/slides.json` + `design/planning.md`. **유저 검토 체크포인트 — 확정 후 다음 단계.** |
| **2 렌더** | codex + 이미지생성 | 슬라이드별: ①이미지모델로 배경/일러스트만 생성(no text) ②HTML(chrome.css)에 배경+진짜 텍스트 배치 ③Playwright 스크린샷 → 평탄 PNG 1920×1080. 실제 렌더 박스를 slides.json에 역기록. |
| **3 PDF** | 스크립트 | `render/*.png` → `out/deck.pdf` |
| **4 세그먼트** | Meta SAM API (SAM2 폴백) | 평탄 PNG → 영역 마스크/박스 `segment/pXX.json` |
| **5 설명문서** | Claude 비전 | PNG + SAM 박스 → 영역 라벨링+OCR → ground-truth 대조 → `explain/pXX.md`. 불일치는 QA 신호로 플래그. |
| **6 조립** | pptxgenjs | ①이미지 pptx(평탄 PNG 통배경+notes) ②편집 pptx(배경+박스 위치 네이티브 텍스트박스+notes) |

각 단계 상세 구현은 `references/pipeline_stages.md` 참고.

## Stage 1 — 설계 (먼저 확정 안 하면 다음 단계 금지)

`references/slides_schema.md`의 `slides.json` 계약을 따른다. 슬라이드당 기준:

```
title:   20자 이내
본문/카드/부제 텍스트: 한 요소 40자 이내 (넘으면 두 장으로 분리)
elements[].box: 1920×1080 픽셀 [x, y, w, h]  (Stage1 추정 → Stage2 실측 갱신)
elements[].style.class: assets/chrome.css 실재 클래스만 (목록은 slides_schema.md)
image_prompt: 반드시 "no text" — 배경/일러스트 전용
notes: 강사 멘트 150자 이상 (슬라이드 비표시)
```

슬라이드 타입: `cover / agenda / concept / compare / steps / practice / summary / assignment / closing`

분량 기준: 30분 10-15장 · 60분 18-25장 · 90분 28-40장.

**Stage 1 산출 후 반드시 유저에게 확인 요청한다:**
> "기획 문서(slides.json + planning.md) 만들었어요. 구성/내용 수정할 부분 있으면 알려주세요. 확정되면 렌더링부터 진행할게요."

## 디자인 시스템

- 캔버스 1920×1080, 라벤더-화이트 `#F4F4FF`, 퍼플 액센트 `#6366F1 / #4F46E5 / #312E81`, Noto Sans KR.
- 좌상단 섹션 크럼 + 우상단 로크업 크롬, 다크 인터루드 페이지, theory/practice 2-pane (Know→Do→Prove).
- 타입스케일·팔레트·크롬 위치는 `assets/chrome.css`가 정의 (HTML 합성 시 그대로 link).
- 팔레트 변형은 `assets/palette.json`.

## QA 루프

```bash
node 6_assemble/create_pptx.js
python -m markitdown out/deck-editable.pptx   # 편집 pptx 텍스트 확인
# out/deck.pdf 육안 검토 → 문제 시 해당 단계 재실행
```

**최소 1회 fix-and-verify 사이클 없이 완료 선언 금지.**

## 폴더 구조

```
<project>/
  pipeline/{1_design,2_render,3_pdf,4_segment,5_explain,6_assemble}/
  decks/<deck-name>/
    design/  slides.json  planning.md
    assets/  backgrounds/*.png
    render/  *.png        segment/ *.json     explain/ *.md
    out/     deck.pdf  deck-image.pptx  deck-editable.pptx
  config/  palette.json  chrome.css
```

## 자주 하는 실수

- 이미지 프롬프트에 텍스트를 넣음 → 글자 깨짐. `image_prompt`는 항상 "no text".
- Stage 1 미확정 상태로 렌더 시작 → 재작업 폭발. 체크포인트 지킬 것.
- SAM 박스만으로 설명문서 작성 → 의미 라벨 없음. 반드시 Claude 비전 라벨링.
- pptxgenjs hex에 `#` 사용 → 파일 손상. shadow 객체 재사용 금지(makeShadow 패턴). 모든 슬라이드 `addNotes`.
- 편집 pptx를 픽셀 완벽으로 기대 → 근사 편집임. 픽셀 완벽은 이미지 pptx.

## 참고 파일

- `references/slides_schema.md` — slides.json 계약 + 요소 box 포맷
- `references/pipeline_stages.md` — 단계별 상세(codex 프롬프트, SAM API, 비전 라벨링, pptxgenjs)
- `assets/chrome.css` — skill_b 비주얼 시스템 (HTML 합성용)
- `assets/palette.json` — 컬러 팔레트
