# /slide-decks-start 소개 덱 — 디자인 시스템 선언

## Visual thesis
화이트 캔버스 + 인디고 단일 액센트, editorial minimal. 메타 주제(스킬이 스킬을 설명)라
차분한 문서 톤 유지, 다이어그램·표 중심.

## Content plan
opener(1) → framing(2 목차, 3 왜) → proof(4 TDD, 5 RED 기록) → detail(6 파이프라인, 7 규칙, 8 게이트, 9 이미지)
→ CTA(10 호출법) → close(11).

## System declaration
- 배경 2색: #FFFFFF(1–10), 다크 #0E1330 계열(11 클로징, 이미지 배경).
- 서체 2종: Pretendard(디스플레이+본문), ui-monospace(코드 토큰 전용).
- 토큰(코어): bg #FFFFFF · surface #F7F8FC · text #111827 · muted #6B7280 · accent #4F46E5 · deep #312E81 · rule #E5E7EB.
- 토큰(확장 뉴트럴): text-2 #374151 · muted-2 #9CA3AF · neutral-300 #D1D5DB.
- 토큰(인디고 틴트): indigo-200 #C7CBF2 · indigo-100 #E0E3F8.
- 토큰(다크 클로징 전용 텍스트): light #E3E5FF · light-muted #A5AAD9 · white-alpha 파생(rgba(255,255,255,α) — 다크 배경 위 보더/칩).
- 타입 스케일: 디스플레이 44–56pt · 헤드라인 28–40pt · 서브헤드 13.5–19pt · 본문 12.5–13.5pt
  · 캡션 12pt · 기능 라벨(eyebrow·페이지 번호·파일명) 10pt — 절대 하한 10pt.
- 한글 조판: 전 슬라이드 body `word-break: keep-all; text-wrap: pretty`.
- 반복 레이아웃: 좌상 eyebrow(인디고 10pt letter-spacing) · 우하 페이지 번호 · 48pt 좌우 패딩.
- 이미지 주도: 1(cover-hero), 11(closing-bg). 나머지 타이포/레이아웃 주도.
- 다이어그램: 6(파이프라인 플로우)은 단순 선형 노드 → HTML/CSS.
- 아이콘: Lucide 인라인 SVG stroke 1.75, 액센트/뮤트 색만.
- 금지: 좌측 보더 카드, 공격적 그라데이션, 획일적 3×2 아이콘 그리드, 더미 수치.
