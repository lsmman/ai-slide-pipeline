# slides.json 계약

파이프라인 전체를 구동하는 단일 소스. Stage 1(Claude 설계)이 생성하고, 이후 모든 단계가 읽는다.

## 최상위 구조

```json
{
  "deck": "ai-tools-practical",
  "palette": "midnight-executive",
  "canvas": { "w": 1920, "h": 1080 },
  "slides": [ /* Slide 객체 배열 */ ]
}
```

| 키 | 설명 |
|---|---|
| `deck` | 덱 식별자(kebab-case). `decks/<deck>/` 폴더명과 일치. |
| `palette` | `assets/palette.json`의 키. 없으면 `upstage-lavender` (디자인 시스템 기본). |
| `canvas` | 항상 1920×1080. |
| `slides` | 길이가 곧 분량. 커리큘럼 양에 따라 가변. |

## Slide 객체

```json
{
  "id": "p01",
  "type": "concept",
  "title": "프롬프트는 대화다",
  "subtitle": "선택",
  "elements": [
    { "role": "title", "text": "프롬프트는 대화다", "box": [90, 120, 1200, 90],  "style": { "class": "t-title" } },
    { "role": "body",  "text": "맥락→지시→예시 순서로", "box": [90, 260, 760, 400], "style": { "class": "t-body" } },
    { "role": "card",  "text": "직접 해보기", "box": [980, 260, 760, 400], "style": { "class": "t-h2", "variant": "card-deep" } }
  ],
  "image_prompt": "soft lavender abstract gradient with faint geometric arcs, lots of negative space, NO text, NO letters, editorial minimal",
  "notes": "프롬프트를 명령이 아니라 대화로 보는 관점 전환을 강조. 맥락-지시-예시 3요소를 예시와 함께 설명. 질문 2개 받기. (150자 이상)"
}
```

### 필드 규칙

모든 enum은 **닫힌 집합**이다 — "등/기타" 없음. 새 값이 필요하면 chrome.css와 이 문서를 먼저 고친다.

| 필드 | 규칙 |
|---|---|
| `id` | `pNN` 형식. 렌더/세그먼트/설명 파일명에 그대로 쓰임(`pNN.png`, `pNN.json`, `pNN.md`). |
| `type` | (닫힘) `cover / agenda / concept / compare / steps / practice / summary / assignment / closing` |
| `subtitle` | (선택) 슬라이드 부제 **메타데이터**. 실제 렌더되는 부제 텍스트는 `elements[]`에 `role:"subtitle"`로 넣는다. 둘이 같으면 `elements` 쪽이 권위. |
| `title` | 표시 제목, **20자 이내**. |
| `elements[]` | 슬라이드의 표시 요소(텍스트/카드/크롬). |
| `elements[].role` | (닫힘) `title / subtitle / body / card / step / stat / number / caption / crumb / lockup / page-num`. **Stage 5 비전 라벨링이 이 값과 대조하므로 이 목록 밖 값 금지.** `crumb`/`lockup`/`page-num`은 chrome 요소 → Stage 5 IoU 대조에서 제외. |
| `elements[].text` | 실제 표시 텍스트. **본문/카드/부제 한 요소는 40자 이내**(넘으면 두 슬라이드로 분리). title은 20자. |
| `elements[].box` | `[x, y, w, h]` 픽셀 좌표(1920×1080). Stage 1에서는 **설계 추정치**, Stage 2 렌더 후 실측으로 갱신되며 그 갱신값이 SAM 대조 기준(ground-truth)이 된다. |
| `elements[].style.class` | (닫힘, chrome.css에 실재하는 클래스만) 텍스트: `t-cover-title / t-section-title / t-section-num / t-title / t-title-sm / t-h2 / t-h3 / t-body / t-body-bold / t-small / t-tiny / t-tag`. 크롬: `crumb / edu-mark / page-num`. **이 목록 밖 클래스(t-h1, t-caption 등) 쓰면 Stage 2 HTML이 조용히 깨진다 — 작성 전 `assets/chrome.css` 확인.** |
| `elements[].style.variant` | (닫힘) 카드 배경 클래스 매핑: `card`(기본) / `card-deep`(Do·Prove, 딥퍼플) / `card-purple`(퍼플) / `card-soft`(연라벤더 이론) / `card-softer`(최연). 카드가 아니면 생략. |
| `image_prompt` | **반드시 "NO text" 포함.** 배경/일러스트 전용. 한글 글자 요청 금지. |
| `notes` | 강사 멘트 150자 이상. 슬라이드 비표시. pptx `addNotes`로 들어감. |

## box 생애주기 — 추정 → 실측 → ground-truth

1. **Stage 1**: `box`는 설계 추정치(레이아웃 의도).
2. **Stage 2**: HTML 합성 시 각 `element`를 `data-object`/절대좌표 div로 배치 → `getBoundingClientRect`로 **실측 박스를 slides.json에 역기록**. 이 갱신값이 ground-truth.
3. **Stage 4**: SAM이 평탄 PNG에서 영역 박스 추출.
4. **Stage 5**: SAM 박스를 ground-truth `box`와 IoU 매칭해 라벨 확정. `crumb`/`lockup`/`page-num`(크롬)은 대조 제외. 매칭 안 되는 영역은 "미식별/추가요소"로 플래그.

## planning.md (사람 검토용)

같은 내용을 사람이 읽기 쉬운 마크다운으로도 출력한다(skill_a Phase 1 포맷):

```markdown
## Slide 01 | 표지
type: cover
title: AI 도구 실무 활용
subtitle: 1일차
notes: 강사 소개 후 오늘 다룰 도구 3가지 예고
```
