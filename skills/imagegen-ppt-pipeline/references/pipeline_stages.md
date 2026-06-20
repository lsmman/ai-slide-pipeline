# 단계별 상세 구현

각 단계는 `pipeline/<n>_<name>/`의 스크립트로 구현한다. 데이터는 `decks/<deck>/`에 쌓인다.

---

## Stage 1 — 설계 (Claude)

입력: 커리큘럼 내용(텍스트/마크다운/구두). 출력: `design/slides.json` + `design/planning.md`.

1. 커리큘럼을 레슨 단위로 분해 → 슬라이드 타입 매핑
   (레슨 제목→concept, 비교표→compare, 실습 단계→steps, 과제→assignment).
2. 슬라이드당 `elements[]`와 `box`를 chrome.css 타입스케일에 맞춰 배치.
3. `image_prompt`는 배경 전용("NO text") — 타입별 톤 가이드:
   - cover/section: 큰 추상 아치/그라데이션, 여백 많음.
   - concept/practice: 은은한 기하 패턴, 카드 자리 비움.
   - 다크 인터루드: deep navy 그라데이션 + 스파클.
4. `planning.md` 동시 출력 → **유저 검토 체크포인트.** 확정 전 Stage 2 금지.

---

## Stage 2 — 렌더 (codex + 이미지생성)

codex가 오케스트레이션. 슬라이드별 3스텝.

### 2a. 배경 생성 (이미지모델)
- higgsfield `generate_image` MCP 사용. 모델 미정 시 `models_explore(action:'recommend')`로 추천 받기.
- 프롬프트 = `image_prompt` + 공통 스타일 토큰(`1920x1080, lavender #F4F4FF base, purple accents, editorial minimal, NO text, NO letters, NO words`).
- 출력 → `assets/backgrounds/pXX.png`.

### 2b. HTML 합성 (텍스트 = 진짜 글자)
- chrome.css를 link한 HTML 슬라이드 생성. 배경 PNG를 `.slide-container` background로.
- 각 `element`를 절대좌표 div로 배치 (skill_b 패턴):
  ```html
  <div data-object="true" data-object-type="textbox"
       style="position:absolute; left:90px; top:120px; width:1200px;">
    <div class="t-title">프롬프트는 대화다</div>
  </div>
  ```
- `data-object`/`box`는 ground-truth 좌표 그대로.

### 2c. 평탄화 (Playwright 스크린샷)
- viewport 1920×1080, `page.screenshot`으로 `render/pXX.png`.
- 실제 렌더 후 div의 `getBoundingClientRect`를 읽어 slides.json `box`에 역기록(정확도 보정).

결과물은 평탄 PNG — 편집 불가 불투명 이미지. (그래서 Stage 4 세그먼트가 필요.)

---

## Stage 3 — PDF

`render/*.png`(id 순) → `out/deck.pdf`. `img2pdf` 또는 Pillow 한 장씩 append. 페이지 = 1920×1080 비율 유지.

---

## Stage 4 — 세그먼트 (Meta SAM API, SAM2 폴백)

평탄 PNG에서 요소 영역 추출.

- **우선:** Meta SAM API(호스티드)로 호출 — 로컬 설치 없이. 키/엔드포인트는 `config`에서.
- **폴백:** SAM2(공개 가중치) 로컬/호스티드. SAM3 가용 시 SAM3 우선.
- 입력: `render/pXX.png`. 출력: `segment/pXX.json`
  ```json
  { "image": "pXX.png", "regions": [
    { "id": 0, "box": [x,y,w,h], "area": 12345, "score": 0.97 }
  ] }
  ```
- 자동 마스크 생성(automatic mask generator) 모드. 너무 잘게 쪼개지면 최소 area 필터 + box 병합.

---

## Stage 5 — 설명문서 (Claude 비전)

SAM은 의미를 모른다. Claude 비전이 라벨을 붙인다.

1. `render/pXX.png` + `segment/pXX.json` 박스를 Claude 비전에 전달.
2. 각 region에 대해: 의미 라벨(title/card/icon/…) + OCR 텍스트 캡션.
3. ground-truth `elements[].box`와 IoU 매칭 → 라벨 확정. 불매칭 영역 = "미식별/추가" 플래그(QA 신호).
4. 출력 `explain/pXX.md`:
   ```markdown
   # Slide pXX — 프롬프트는 대화다
   | region | label | text(OCR) | box | gt매칭 |
   |---|---|---|---|---|
   | 0 | title | 프롬프트는 대화다 | [90,120,1200,90] | ✅ title |
   | 1 | card-do | 직접 해보기 | [980,260,760,400] | ✅ card-do |
   설명: 이 슬라이드는 ... (요소별 의미/배치 의도)
   ```

---

## Stage 6 — 조립 (pptxgenjs)

단일 `.js`, `node` 실행. pptxgenjs 규칙: hex에 `#` 금지, shadow는 makeShadow() 패턴, 모든 슬라이드 `addNotes(notes)`.

### 6a. 이미지 pptx (`out/deck-image.pptx`)
- 슬라이드 = `render/pXX.png` 통배경(`slide.background = { path }` 또는 full-bleed addImage) + `addNotes(notes)`.
- 픽셀 완벽. 편집 불가.

### 6b. 편집 pptx (`out/deck-editable.pptx`)
- 배경: AI 배경 PNG(`assets/backgrounds/pXX.png`)만.
- 그 위에 ground-truth/SAM 박스 위치로 **네이티브 텍스트박스** 생성(복구 텍스트, chrome.css 색/크기 매핑).
- `addNotes(notes)`.
- 근사 편집 — 픽셀 완벽 아님(문서에 명시).

```javascript
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.defineLayout({ name: "FULL", width: 13.333, height: 7.5 }); // 1920x1080 @96dpi
pres.layout = "FULL";
const PX = 13.333 / 1920; // px → inch
function makeShadow() { return { type: "outer", blur: 3, offset: 2, angle: 45, color: "888888", opacity: 0.3 }; }
// slides.json 순회: type별 함수로 image/editable 분기
```

box(px) → inch 변환: `x_in = box[0] * PX` (1920px = 13.333in, 1080px = 7.5in).
