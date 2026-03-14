# CLAUDE.md

## 프로젝트 개요

사내 인트라넷 모바일 앱 (Expo). React Native 기반 크로스플랫폼 앱.

## Commands

```bash
npm start            # Expo 개발 서버
npm run android      # Android 실행
npm run ios          # iOS 실행
npm run web          # Web 실행
```

## Architecture

- Expo 55 + React Native 0.83 + React 19
- Expo Router (파일 기반 라우팅)
- NativeWind (Tailwind CSS for React Native)
- Fetch API (HTTP 클라이언트)

### 디렉토리 구조

- `app/` — Expo Router 파일 기반 라우팅
  - `(auth)/` — 인증 (로그인/회원가입)
  - `(tabs)/` — 메인 탭 (대시보드/게시판/관리자/프로필)
  - `posts/` — 게시글 CRUD
  - `admin/` — 관리자 화면
- `lib/` — API 클라이언트, 인증, 토큰 저장
- `types/` — TypeScript 타입 정의
- `components/` — 공유 컴포넌트

### 인증

- expo-secure-store로 JWT 토큰 저장 (네이티브 키체인)
- Fetch API 래퍼에서 Bearer 토큰 자동 주입 + 401 갱신
- AuthContext (React Context) 기반 전역 인증 상태

### 백엔드 연동

- 환경변수: `EXPO_PUBLIC_API_URL=http://localhost:8081`
- API 스펙: `/api/v1/*`

## Git 커밋 규칙

- 커밋 메시지는 한글로 작성
- 커밋 메시지에 `Co-Authored-By` 줄을 포함하지 않는다

## SDD (Spec-Driven Development)

- `prd.md` — 프로젝트 요구사항 정의
- `docs/progress.md` — Phase/Step별 진행 체크리스트
- `docs/phase-N/step-NN-*.md` — 단계별 작업 명세
- 새 작업 시작 전 progress.md 확인, 완료 시 체크 표시 업데이트
