---
version: alpha
name: Executive Navy
description: 컨설팅 보고서 톤의 정제된 네이비·화이트 슬라이드 — 절제된 브론즈 포인트, 촘촘한 그리드, 큰 숫자.
derived-from: none (custom-authored for slide medium)
medium: slides-16x9
colors:
  bg: "#FFFFFF"
  navy: "#10243E"
  navy-2: "#1B3A5C"
  ink: "#0F172A"
  ink-2: "#334155"
  muted: "#64748B"
  bronze: "#A67C37"
  surface: "#F4F6F9"
  rule: "#D8DEE6"
  on-navy: "#FFFFFF"
  on-navy-muted: "#B8C4D4"
---

## Overview
경영 보고서의 침착함. 화이트 캔버스 위 딥 네이비가 구조를 잡고, 브론즈는 슬라이드당
한 곳에만 허락되는 포인트다. 타이포는 크고 확신 있게, 장식은 얇은 룰과 숫자뿐.
에너지는 낮고 밀도는 높다 — 화려함 대신 정확함.

## Background
- 기본: 순백 `#FFFFFF` (본문 슬라이드)
- 다크: 딥 네이비 `#10243E` 단색 (커버 · 섹션 디바이더 · 클로징)
- 보조: `#F4F6F9` 서피스는 표·스탯 블록 배경으로만, 전면 캔버스로 쓰지 않는다

## Colors
| 역할 | 토큰 | 값 |
|---|---|---|
| 캔버스 | bg | #FFFFFF |
| 다크 캔버스/구조 | navy | #10243E |
| 구조 보조(차트 바·박스) | navy-2 | #1B3A5C |
| 본문 잉크 | ink | #0F172A |
| 보조 잉크 | ink-2 | #334155 |
| 캡션·뮤트 | muted | #64748B |
| 포인트(슬라이드당 1곳) | bronze | #A67C37 |
| 표·스탯 배경 | surface | #F4F6F9 |
| 헤어라인 룰 | rule | #D8DEE6 |
| 다크 위 텍스트 | on-navy | #FFFFFF |
| 다크 위 뮤트 | on-navy-muted | #B8C4D4 |

## Typography
- Display(헤드라인): **Pretendard 800**, letter-spacing -0.02em, 행간 1.15
  — CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css`
- Body(본문): **Pretendard 400/600**, 12.5–14pt, 행간 1.6
- Mono(eyebrow·번호·수치 라벨): `ui-monospace, 'SF Mono', Menlo, monospace`, 10–11pt, letter-spacing 1.5–2.5pt
- 한글 조판: body에 `word-break: keep-all; text-wrap: pretty` 필수
- 폴백: `'Pretendard', 'Noto Sans KR', sans-serif`

## Slide Layouts
- **Cover** — 네이비 풀블리드. 좌측 정렬 화이트 헤드라인 40–52pt 단독 지배,
  상단 mono eyebrow, 하단 얇은 attribution 라인. CTA·이미지 금지, 브론즈는 eyebrow 언더라인 한 줄만.
- **Section divider** — 네이비 풀블리드 + 좌상단 대형 mono 섹션 번호(brozne), 짧은 앵커 헤드라인.
  본문 금지, 요소 3개 이하.
- **Content** — 화이트. 상단 얇은 네이비 헤더 룰(2pt) 아래 헤드라인, 본문은 60/40 또는 50/50.
  코너에는 mono 페이지 번호만. 카드보다 헤어라인 룰로 구획.
- **Statistic** — 화이트 또는 surface 블록. 오버사이즈 숫자(44–64pt, ink) + 브론즈 단위/증감,
  캡션 한 줄. 숫자는 슬라이드당 최대 3개, 그 이상이면 표로.
- **Table/Compare** — surface 배경 표, 헤더 행만 navy 배경 + on-navy 텍스트, 바디는 헤어라인 룰.
- **Closing** — 네이비 풀블리드, 최종 테제 한 줄 + 얇은 푸터 스트립(출처·페이지).

## Signature Motifs
- **네이비 헤더 룰**: 본문 슬라이드 상단, 좌측 패딩부터 우측 패딩까지 2pt `#10243E` 라인
- **브론즈 언더라인**: 헤드라인 핵심 단어 하나에만 3pt `#A67C37` 밑줄 (슬라이드당 1회)
- **mono 섹션 번호**: `01 /` 형식, muted, eyebrow 위치 고정
- **오버사이즈 스탯**: 숫자만 크게, 단위는 브론즈 소형
- **얇은 푸터 스트립**: 다크 슬라이드 하단 1px on-navy-muted 라인 + 좌 출처 / 우 페이지

## Avoid
- top-nav 바, 스티키 헤더, 메뉴 행
- 클릭형 CTA 버튼 ("Sign up", "자세히 보기")
- 하단 멀티 컬럼 푸터 밴드 (attribution+페이지 번호 한 줄 스트립만 허용)
- 프라이싱 그리드, hover/focus 상태 스타일
- 다단계 그라데이션 배경 (네이비는 항상 단색)
- 브론즈 남용 — 슬라이드당 1개 요소 초과 금지
- 좌측 보더 액센트 카드, 획일적 3×2 아이콘 그리드, 더미 수치
- 사진/일러스트 배경 위 텍스트 (이 스타일은 이미지 없이 타이포·그리드로 승부)

## Source mapping (for traceability)
- custom-authored — 웹 DESIGN.md 원본 없음, 슬라이드 전용으로 직접 설계
- 컨설팅 보고서 관례(표지 네이비, 큰 숫자, 헤어라인 표) → Cover/Statistic/Table 레이아웃
- 골드 포인트 관례 → bronze 토큰(채도 낮춘 #A67C37)으로 절제 적용
