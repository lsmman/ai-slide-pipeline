# /slide-decks-start — 스킬의 탄생과 내부 동작

## Meta
- **Topic**: slide-decks-start 스킬이 어떻게 만들어졌고, 실행되면 내부에서 무슨 일이 일어나는지
- **Target Audience**: Claude Code 사용자 (스킬 작동 원리 궁금한 개발자)
- **Tone/Mood**: 메타적 · 실용적 · 깔끔
- **Slide Count**: 11 slides
- **Aspect Ratio**: 16:9
- style: clean white #FFFFFF + Pretendard + 인디고 #4F46E5 액센트, editorial minimal (스킬 기본값)

## Slide Composition

### Slide 1 - Cover
- **Type**: Cover
- **Title**: /slide-decks-start
- **Subtitle**: 프롬프트 한 줄이 검증된 덱이 되기까지
- **Image**: 흰 배경, 문서에서 슬라이드로 변환되는 추상 일러스트 (no text)

### Slide 2 - Contents
- **Type**: Contents
- **Items**: 01 왜 만들었나 / 02 어떻게 만들었나(TDD) / 03 내부 파이프라인 / 04 호출하기

### Slide 3 - 왜 만들었나
- **Type**: Content (statement)
- **Key Message**: 잘 만든 파이프라인도 세션이 끝나면 휘발된다 — 절차를 스킬로 박제
- **Details**: 매번 수동 조립 / 함정 재발견 비용 / 어느 프로젝트에서든 한 줄 호출

### Slide 4 - 어떻게 만들었나: 문서에도 TDD
- **Type**: Content (3-step flow)
- **Key Message**: RED(스킬 없이 실패 기록) → GREEN(스킬 작성, 서브에이전트 검증) → REFACTOR(갭 봉합)
- **Details**: 갭 6개 발견 → 수정 → 재프로브 전부 해소

### Slide 5 - RED: 실제로 터졌던 함정들
- **Type**: Content (table/rows)
- **Key Message**: 스킬의 함정 표는 이론이 아니라 이 세션의 실패 기록
- **Details**: keep-all 누락(어절 분리) / 9pt Critical / position:relative 누락 / 이미지 병렬 중복 / 게이트 없이 export 차단

### Slide 6 - 내부 파이프라인 한눈에
- **Type**: Diagram
- **Key Message**: Plan → Design → Validate → Gate → Export → Present, 6단계
- **Details**: 가로 플로우 + Validate·Gate에 루프백

### Slide 7 - Design 단계 규칙
- **Type**: Content
- **Key Message**: 720×405pt 캔버스 위 강제 규칙들이 게이트 통과율을 만든다
- **Details**: Pretendard·keep-all·12pt 하한 / 모든 색 토큰 문서화 / AI slop 금지 목록

### Slide 8 - 품질 게이트: 리뷰어 2명
- **Type**: Content (split)
- **Key Message**: 서브에이전트 A(계약 무결성)·B(청중 가독성)가 PASS 줄 때까지 export 잠금
- **Details**: PNG 증거 + sha256 지문 / Critical 수정 루프 / proceed 영수증이 열쇠

### Slide 9 - 이미지 생성
- **Type**: Content
- **Key Message**: codex 로그인 재사용(god-tibo) — API 키 없이 no-text 배경 생성
- **Details**: 항상 "NO text" / 다크는 색 계열 명시 / md5 중복 검사 / 미로그인 시 CSS 폴백

### Slide 10 - 호출하기
- **Type**: Content (steps)
- **Key Message**: 어느 프로젝트에서든 /slide-decks-start <path|주제> 한 줄
- **Details**: 자연어 트리거("PPT 만들어줘") / 산출물 PDF+viewer(+실험적 pptx) / "n번 고쳐줘" 편집 루프

### Slide 11 - Closing
- **Type**: Closing
- **Message**: 이 덱도 방금 그 파이프라인으로 만들어졌습니다
- **Image**: 다크 네이비 + 인디고 글로우 (no text, cool tones only)
