# Claude Code 소개

## Meta
- **Topic**: Claude Code — 터미널 기반 AI 코딩 에이전트 소개
- **Target Audience**: 사내 개발자 (AI 코딩 도구 도입 검토)
- **Tone/Mood**: 실용적 · 깔끔 · 기술적이지만 접근 쉬움
- **Slide Count**: 12 slides
- **Aspect Ratio**: 16:9
- style: 커스텀 — 깔끔한 화이트(#FFFFFF) 배경, Pretendard 폰트, 인디고(#4F46E5) 액센트,
  라이트 그레이 보더 카드, editorial minimal. 이미지: codex 생성(god-tibo), no-text 배경/일러스트만.

## Slide Composition

### Slide 1 - Cover
- **Type**: Cover
- **Title**: Claude Code
- **Subtitle**: 터미널에서 일하는 AI 코딩 에이전트
- **Image**: 흰 배경 + 추상 터미널/코드 흐름 일러스트 (no text)

### Slide 2 - Table of Contents
- **Type**: Contents
- **Items**: 01 무엇인가 / 02 어떻게 동작하나 / 03 핵심 기능 / 04 시작하기

### Slide 3 - Claude Code란?
- **Type**: Content
- **Key Message**: 채팅봇이 아니라 에이전트 — 코드베이스를 직접 읽고, 고치고, 실행해 검증한다
- **Details**: Anthropic 공식 CLI · 자연어로 작업 지시 · 파일 편집 + 명령 실행 + 테스트까지 한 사이클

### Slide 4 - 에이전트 루프
- **Type**: Diagram (Content)
- **Key Message**: 탐색 → 계획 → 편집 → 실행 → 검증 루프를 스스로 돈다
- **Details**: 5단계 가로 플로우, 검증 실패 시 다시 편집으로 루프백

### Slide 5 - 도구 상자
- **Type**: Content (card grid)
- **Key Message**: 파일 읽기·편집, Bash, 코드 검색, 웹 접근, 서브에이전트 — 개발자가 쓰는 도구를 그대로
- **Details**: 4~6 카드 그리드

### Slide 6 - 컨텍스트와 메모리
- **Type**: Content (split)
- **Key Message**: CLAUDE.md로 프로젝트 규칙을 알려주면 팀 컨벤션대로 일한다
- **Details**: CLAUDE.md(프로젝트 규칙·명령어·스타일) / 자동 코드베이스 탐색 / 세션 간 메모리

### Slide 7 - 확장: Skills · MCP · Hooks
- **Type**: Content (3-column)
- **Key Message**: 반복 워크플로우는 Skill로, 외부 도구는 MCP로, 자동화 규칙은 Hook으로
- **Details**: Skills=재사용 절차, MCP=GitHub·Slack·DB 연동, Hooks=이벤트 자동 실행

### Slide 8 - 서브에이전트와 병렬 작업
- **Type**: Content
- **Key Message**: 큰 작업은 에이전트 여러 개로 쪼개 병렬 실행 — 리뷰·탐색·마이그레이션에 강함
- **Details**: 백그라운드 작업 + 알림 / 멀티에이전트 워크플로우 / git worktree 격리

### Slide 9 - 어디서나
- **Type**: Content (platform row)
- **Key Message**: 터미널 CLI · 데스크톱 앱 · claude.ai/code 웹 · VS Code / JetBrains 확장
- **Image**: 흰 배경 멀티 디바이스 미니멀 일러스트 (no text)

### Slide 10 - 실전 활용
- **Type**: Content (case cards)
- **Key Message**: 버그 수정 · 리팩토링 · PR 리뷰 · 테스트 작성 · 문서화 — 그리고 이 발표자료도 Claude Code가 만들었다
- **Details**: 사례 카드 4개 + "this deck" 캡션

### Slide 11 - 시작하기
- **Type**: Content (steps)
- **Key Message**: 설치 → 로그인 → 프로젝트에서 `claude` → CLAUDE.md 작성
- **Details**: `npm install -g @anthropic-ai/claude-code` · 첫 작업은 작은 것부터 · permission mode로 안전 제어

### Slide 12 - Closing
- **Type**: Closing
- **Message**: 감사합니다 — 오늘 바로 한 번 써보세요
- **Image**: 다크 네이비 + 인디고 글로우 클로징 배경 (no text)
