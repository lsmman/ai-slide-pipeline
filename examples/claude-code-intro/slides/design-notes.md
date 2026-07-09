# Claude Code 소개 — 디자인 시스템 선언

## Visual thesis
정돈된 화이트 캔버스 위, 인디고 한 색으로만 긴장감을 주는 editorial minimal.
에너지는 차분하고(문서 톤), 소재는 소프트웨어/터미널.

## Content plan
opener(1 커버) → framing(2 목차, 3 정의) → proof(4 루프, 5 도구, 6 메모리, 7 확장, 8 병렬)
→ context(9 플랫폼, 10 실전) → CTA(11 시작하기) → close(12).

## System declaration
- 배경 2색: #FFFFFF(1–11), #0E1330 계열 다크(12 클로징, 이미지 배경).
- 서체 2종: Pretendard(디스플레이+본문), ui-monospace(코드 토큰 전용).
- 토큰(코어): bg #FFFFFF · surface #F7F8FC · text #111827 · muted #6B7280 · accent #4F46E5 · deep #312E81 · rule #E5E7EB.
- 토큰(확장 뉴트럴 램프): text-2 #374151 · muted-2 #9CA3AF · neutral-300 #D1D5DB.
- 토큰(인디고 틴트): indigo-200 #C7CBF2 · indigo-100 #E0E3F8.
- 토큰(다크 클로징 전용 텍스트): light #E3E5FF · light-muted #A5AAD9.
- 타입 스케일: 디스플레이 46–56pt · 헤드라인 30–40pt · 서브헤드 13.5–19pt · 본문 12.5–13.5pt
  · 캡션 12pt · 기능 라벨(eyebrow·페이지 번호·파일명) 10pt — 절대 하한 10pt 준수.
- 한글 조판: 전 슬라이드 body에 `word-break: keep-all; text-wrap: pretty` — 어절 중간 줄바꿈 금지.
- 반복 레이아웃: 좌상 eyebrow(인디고 10pt, letter-spacing) · 우하 페이지 번호 · 48pt 좌우 패딩.
- 이미지 주도 슬라이드: 1(cover-hero), 9(platforms), 12(closing-bg). 나머지는 타이포/레이아웃 주도.
- 다이어그램: 4(루프), 8(서브에이전트)은 단순 노드라 HTML/CSS로 직접(복잡 다이어그램 아님).
- 아이콘: Lucide 인라인 SVG, stroke 1.75, 액센트/뮤트 색만.
- 금지: 좌측 보더 카드, 공격적 그라데이션, 3×2 아이콘 그리드, 더미 수치.
