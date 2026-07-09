# 슬라이드 이미지 프롬프트 설계 — 고도화 가이드

슬라이드 이미지는 "예쁜 그림"이 아니라 **텍스트가 올라갈 무대**다.
좋은 프롬프트 = 7개 슬롯을 전부 채운 프롬프트. 슬롯 하나라도 비우면 모델이 멋대로 채운다.

## 프롬프트 해부학 — 7슬롯 템플릿

```
[1 MEDIUM] [2 SUBJECT] [3 COMPOSITION+텍스트존] [4 COLOR 헥스+비율] [5 STYLE ANCHOR] [6 RENDER] [7 NEGATIVES]
```

| # | 슬롯 | 역할 | 예 |
|---|------|------|----|
| 1 | MEDIUM | 품질의 절반. 매체 선언이 모델의 '장르'를 고정 | `premium editorial presentation background`, `minimal flat vector illustration`, `soft 3D paper-craft render` |
| 2 | SUBJECT | 슬라이드 메시지의 **은유 1개** (직역 금지) | 성장→`ascending layered planes`, 연결→`interwoven silk ribbons`, 파이프라인→`single continuous flowing path through gates` |
| 3 | COMPOSITION | **텍스트존 예약이 핵심.** 피사체 위치 + 비워둘 영역을 %로 | `subject anchored in the lower-right third, upper-left 60% kept as clean empty negative space for headline text` |
| 4 | COLOR | 덱 팔레트 헥스 + 점유 비율 | `90% pure white #FFFFFF, 8% pale gray #F1F3F7, 2% indigo #4F46E5 accents only on the subject` |
| 5 | STYLE ANCHOR | 덱 전체가 공유하는 질감·무드 한 문장 — **덱 내 모든 이미지에 동일 문구 재사용** (일관성의 열쇠) | `matte soft-touch surfaces, gentle studio light from upper left, quiet luxury mood, generous whitespace` |
| 6 | RENDER | 해상도·엣지·마감 + 16:9 세이프마진 | `high-resolution render, crisp clean edges, soft diffuse shadows, no banding. wide 16:9 composition, key shapes kept 5% away from all edges` |
| 7 | NEGATIVES | 항상 전부 | `NO text, NO letters, NO words, NO numbers, NO logos, NO watermarks, NO UI elements, NO human faces, NO human hands, NO body parts` |

## 조립 규칙

1. **덱당 STYLE ANCHOR 1문장 고정.** 첫 이미지 프롬프트를 쓸 때 확정하고, 같은 덱의
   모든 이미지에 글자 그대로 붙인다. 피사체·구도만 바꾼다. (안 지키면 커버와 클로징이 남남이 됨)
   덱에 다크 슬라이드가 있으면 앵커를 **라이트/다크 겸용 중립어**로 짠다 —
   `whitespace` 대신 `negative space`, 방향 조명(`from upper left`) 대신 `gentle diffuse light`.
2. **텍스트존 명도 지시.** 라이트 덱: 텍스트 올라갈 영역은
   `keep that area above 92% luminance, decoration there at most 5% contrast`.
   다크 덱: `keep the text area deep and even, below 20% luminance, glow away from it`.
3. **은유 선택.** 슬라이드 메시지를 명사 하나로 압축 → 그 명사의 물리적 은유를 고른다.
   직역(로켓·전구·악수·기어·두뇌 회로)은 slop — 금지. 은유 라이브러리:
   - 성장/개선: ascending planes, unfolding layers, rising thin lines
   - 연결/통합: woven ribbons, converging strands, node constellation (sparse)
   - 프로세스/파이프라인: one continuous path, sequential gates, flowing current
   - 안전/게이트: layered translucent panes, threshold of light
   - 데이터/관측: fine particle field, calm scatter settling into order
   - 도구/제작: precise geometric assembly, drafting-table composition
4. **색은 헥스로.** "purple accents" 금지 → `indigo #4F46E5`. 다크 이미지는 반드시
   `strictly cool hues only, NO warm colors, NO gold, NO orange` (경험상 안 쓰면 골드 유입).
   프롬프트에 쓴 모든 헥스는 **design-notes.md 토큰 표에도 등록** — 미문서화 색은 게이트 Major.
5. **16:9 + 세이프 마진.** `wide 16:9 composition, key shapes kept 5% away from all edges`
   — 리사이즈·크롭에도 살아남게.

## 완성 예 — 약한 프롬프트 vs 고도화

**약함 (기존):**
> clean white background with a faint speech bubble silhouette, soft indigo, no text

**고도화 (7슬롯):**
> premium editorial presentation background. a single oversized speech-bubble silhouette
> rendered as layered translucent paper sheets, anchored in the right third and bleeding
> off the right edge; left 60% kept as clean empty negative space for headline text,
> that area above 92% luminance with decoration at most 5% contrast. 90% pure white
> #FFFFFF, 8% pale gray #F1F3F7, 2% indigo #4F46E5 on the sheet edges only.
> matte soft-touch surfaces, gentle diffuse light, quiet luxury mood, generous negative space.
> high-resolution render, crisp clean edges, soft diffuse shadows, no banding.
> wide 16:9 composition, key shapes kept 5% away from all edges.
> NO text, NO letters, NO words, NO numbers, NO logos, NO watermarks, NO UI elements,
> NO human faces, NO human hands, NO body parts

## 생성 후 검수 루프 (프롬프트만큼 중요)

1. 생성 → 슬라이드에 합성 렌더 → PNG 확인.
2. 체크 3가지: ① 텍스트존 침범? ② 덱 내 다른 이미지와 질감 일치? ③ 은유가 메시지와 닿나?
3. 침범 시 재생성 프롬프트에 **수정 지시를 명시적으로 추가**:
   `move the subject fully into the lower-right quadrant, reduce its footprint to 35% of frame,
   lighten all decoration in the upper-left to near-invisible`.
4. md5 중복 검사·순차 생성 규칙은 SKILL.md 그대로.

## 흔한 실패 → 슬롯 처방

| 증상 | 비어 있던 슬롯 | 처방 |
|---|---|---|
| 텍스트와 이미지 충돌 | 3 COMPOSITION | 텍스트존 %와 명도 지시 추가 |
| 이미지끼리 톤 제각각 | 5 STYLE ANCHOR | 덱 공용 앵커 문장 고정·재사용 |
| 색이 팔레트 밖(골드 등) | 4 COLOR | 헥스+비율, 다크는 warm 금지 명시 |
| 뭉갠 글자 출현 | 7 NEGATIVES | NO numbers까지 포함 전체 세트 |
| 클리셰(전구·로켓) | 2 SUBJECT | 은유 라이브러리에서 재선택 |
| 그라데이션 밴딩 | 6 RENDER | `no banding, soft diffuse` 명시 |
