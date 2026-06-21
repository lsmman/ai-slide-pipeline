# SteelOps 캡스톤 발표 덱

`imagegen-ppt-pipeline` 스킬로 생성. 소스: `capstone/{PLAN,README,ARCHITECTURE}.md`.

- 18장 · 1920×1080 · palette `upstage-lavender`
- QA 점수 **100/100** (임계 90) — `python3 qa/score.py decks/steelops-capstone`

## 재생성

```bash
bash pipeline/run_all.sh decks/steelops-capstone
```

스테이지: 2 렌더(Playwright) → 3 PDF(Pillow) → 4 세그먼트 → 5 설명 → 6 조립(pptxgenjs) → QA.

## 산출물 (`out/`, git 미추적 — 재생성 가능)

| 파일 | 설명 |
|---|---|
| `deck-image.pptx` | 평탄 PNG 통배경 + 스피커노트 (픽셀 완벽, 편집 불가) |
| `deck-editable.pptx` | 텍스트-free 배경 + 네이티브 텍스트박스/카드 + 노트 (편집 가능) |
| `deck.pdf` | 18페이지 |
| `explain/pXX.md` | 요소별 설명 문서 (region 표 + 강사 노트) |

## 구현 메모 (자율 실행 시 결정)

- **배경**: AI 이미지생성(higgsfield) 대신 **결정적 SVG/CSS 라벤더 그라데이션** 사용 — 수렴·무크레딧. `pipeline/2_render/render.js`의 `backgroundCss()` 교체 지점.
- **Stage 4 SAM**: `META_SAM_API_URL`+`META_SAM_API_KEY` 없어 **ground-truth 박스 폴백**. 키 설정 시 자동으로 Meta SAM API 호출(`segment.py`).
- **Stage 5 설명**: 현재 ground-truth 요소맵 기반(정확). 실 SAM+Claude 비전 라벨링으로 강화 가능.
