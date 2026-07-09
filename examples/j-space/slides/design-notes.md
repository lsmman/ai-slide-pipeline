# j-space 덱 — 디자인 시스템 선언 (executive-navy 적용)

스타일 소스: `~/.claude/skills/slide-decks-start/styles/executive-navy.slides.md` (show-design 로드 완료)

## Visual thesis
경영 브리핑의 침착함 — 화이트 캔버스 + 딥 네이비 구조, 브론즈는 슬라이드당 1곳.
이미지 없음: 타이포·헤어라인 룰·오버사이즈 숫자·표가 전부다.

## Content plan
opener(1 네이비 커버) → framing(2 목차, 3 연구 질문) → 개념·숫자(4, 5 스탯) →
proof(6·7·8 실험 3종) → 적용(9 안전) → 논쟁·한계(10, 11) → close(12 네이비).

## System declaration
- 배경 2색: #FFFFFF(2–11) · #10243E 네이비 단색(1, 12). 그라데이션 금지.
- 서체 2종: Pretendard(디스플레이 800 + 본문 400/600), ui-monospace(eyebrow·번호·수치 라벨).
- 토큰(스타일 스펙 그대로): bg #FFFFFF · navy #10243E · navy-2 #1B3A5C · ink #0F172A ·
  ink-2 #334155 · muted #64748B · bronze #A67C37 · surface #F4F6F9 · rule #D8DEE6 ·
  on-navy #FFFFFF · on-navy-muted #B8C4D4.
- 타입 스케일: 디스플레이 40–46pt(커버) · 헤드라인 26–30pt · 서브헤드 13.5–17pt ·
  본문 12.5–13.5pt · 캡션 12pt · mono 기능 라벨 10.5–11pt — 절대 하한 10pt.
- 한글 조판: 전 슬라이드 body `word-break: keep-all; text-wrap: pretty` + `position: relative`.
- 반복 레이아웃: 본문 슬라이드 상단 2pt 네이비 헤더 룰 → mono eyebrow(`01 / …`) → 헤드라인.
  하단 헤어라인 푸터(좌 출처, 우 mono 페이지 번호). 좌우 패딩 52pt.
- 브론즈 규율(슬라이드당 1곳): 본문 슬라이드 = 헤드라인 핵심 단어 밑줄 3pt 1회.
  Statistic 슬라이드(5)는 스펙의 시그니처 모티프 "오버사이즈 스탯(단위는 브론즈 소형)"을
  단일 모티프 1회 사용으로 적용 — 단위 라벨 외 브론즈 없음. 커버/클로징 = eyebrow 언더라인 1회.
- 표: 헤더 행만 navy 배경 + on-navy 텍스트, 바디는 헤어라인 룰, 배경 surface.
- 이미지·일러스트 없음(스펙 Avoid). box-shadow 등 알파 장식 미사용.
- 금지: 좌측 보더 카드, CTA 버튼, 멀티 컬럼 푸터, 그라데이션, 브론즈 남용, 더미 수치
  (모든 수치는 Anthropic 연구 원문 출처: <10%, ~100배, 수십 개, 8→6, ≈0 등).
