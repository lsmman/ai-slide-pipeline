# SteelOps 캡스톤 발표 — 기획 문서 (planning.md)

deck: steelops-capstone
palette: upstage-lavender
분량: 18장 (~60분 발표)
소스: capstone/PLAN.md · README.md · ARCHITECTURE.md

## Slide 01 | 표지
type: cover
title: SteelOps
subtitle: 제철소 조업 지원 멀티에이전트
notes: LangChain+LangGraph+Solar, 1~10강이 단일 흐름에서 실제 동작하는 캡스톤 소개

## Slide 02 | 오늘의 흐름
type: agenda
항목: 01 문제·시나리오 / 02 아키텍처·요청흐름 / 03 10강↔코드 / 04 데모·정리
notes: 네 꼭지 안내, 앞 셋이 데모 이해의 준비

## Slide 03 | 문제 — 현업 요청 한 줄
type: concept
title: 현업 요청 한 줄에서 시작한다
message: 한 문장에 점검·판단·의사결정·승인이 뒤섞임 → 단일 에이전트로 부족
notes: 문제 정의, 멀티에이전트+워크플로우+횡단관심사 필요성

## Slide 04 | 통합 시나리오
type: concept
title: 하나의 흐름에 10강이 녹아든다
message: 분해·위임→도구실행→HITL→추적·보호→평가·환류→버전·카나리 배포
notes: 7스텝 통합 시나리오, 강 번호 매핑

## Slide 05 | 아키텍처 — 단방향 레이어
type: concept
title: 단방향 레이어드 아키텍처
message: 진입점→API→그래프→에이전트→코어·데이터, 순환 없음
notes: 코어=횡단 관심사, 평가·배포=사이드 하네스

## Slide 06 | Agent vs Workflow · 권한 분리
type: compare
title: 두 가지 핵심 설계 결정
message: ReAct Agent vs StateGraph Workflow / read 자유 vs write 승인
notes: 자율성과 안전의 분리, 도구 권한 scoping(2강)

## Slide 07 | 요청 1건의 흐름
type: steps
title: 요청 1건이 통과하는 노드
단계: intake→orchestrate→specialists→decide→hitl_gate→act→synthesize
notes: 노드 라벨 [n]이 강 번호, 각 호출 span·보호

## Slide 08 | A2A 멀티에이전트 [3강]
type: concept
title: Orchestrator–Specialist 협업
message: 분해·위임 → 센서·품질·정비 Specialist
notes: 3강 A2A, base ReAct 재사용·권한 도구

## Slide 09 | HITL 3축 게이트 [7강]
type: concept
title: 사람이 언제 개입하나 — 3축
message: 신뢰도·비용·위험 → Autonomy Level 0~4 + interrupt
notes: 7강 HITL, MT-DESULF 승인 보류 예시

## Slide 10 | 관측·신뢰성 [5·8강]
type: concept
title: 추적하고, 실패에 견딘다
message: OTel span / timeout·retry·circuit·idempotency·sandbox
notes: 5강 InMemory 수집기, 8강 강제실패 검증

## Slide 11 | 평가 하네스 [4·6강]
type: concept
title: 응답을 채점하고 Judge를 정렬한다
message: Rubric·pass@k / Dataset·LLM-Judge·Cohen's κ
notes: 4·6강, run_eval.py 독립 실행

## Slide 12 | 진화·보안 [9강]
type: concept
title: 실패를 환류하고 공격을 막는다
message: Failure Taxonomy 4분류·회귀환류 / 인젝션·OWASP 가드
notes: 9강, 악성 '설비 정지' 차단

## Slide 13 | 배포 [10강]
type: concept
title: 버전·카나리·롤백·비용
message: Versioning / Canary·Rollback / Cost Guard
notes: 10강, run_canary.py 자동 롤백·비용

## Slide 14 | 강 ↔ 코드 매핑
type: compare
title: 10강이 코드에 1:1로 박혀 있다
message: 1~10강 → agents·core·graph·eval·deploy 실제 모듈
notes: 장식이 아닌 실행 모듈

## Slide 15 | HITL 일시정지/재개
type: concept
title: 진짜로 멈췄다가 이어서 발행
단계: chat→interrupt→awaiting_approval→approve→resume→완료
notes: 체크포인터, 비직렬화 객체 runtime 레지스트리 분리

## Slide 16 | 실행 데모
type: practice
title: 네 가지 실행 경로
카드: server.py / run_demo / run_eval / run_canary
notes: server.py로 HITL 라이브 권장

## Slide 17 | 핵심 정리
type: summary
title: 핵심 정리
포인트: 10강 통과 / 안전·추적·평가 / HITL 책임 / 평가·배포 분리 / Mock 재현
notes: 네 줄 요약 + Mock 강조

## Slide 18 | Q&A
type: closing
title: 감사합니다
subtitle: SteelOps · Q&A
notes: 다크 인터루드, 예상 질문(Solar 표준·실데이터 어댑터·Autonomy 조정·LangSmith)
