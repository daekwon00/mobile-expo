# mobile-expo — PRD (Product Requirements Document)

## 프로젝트 개요

사내 인트라넷 모바일 앱 (Expo). React Native 기반 크로스플랫폼(iOS/Android/Web) 앱.
spring-cqrs 백엔드 API와 JWT 인증으로 연동.

## 기술 스택

- Expo 55 + React Native 0.83
- React 19 + TypeScript
- Expo Router (파일 기반 라우팅)
- NativeWind (Tailwind CSS for React Native)
- expo-secure-store (토큰 저장)
- Fetch API (HTTP 클라이언트)

## Phase 구성

### Phase 1: 프로젝트 초기 설정

- Expo 프로젝트 스캐폴딩
- NativeWind (Tailwind) 설정
- Expo Router 구조 (파일 기반)
- TypeScript 타입 정의

### Phase 2: 인증

- JWT 로그인/회원가입
- expo-secure-store 토큰 저장
- AuthContext + 자동 로그인
- 자동 토큰 갱신 (401 재시도)

### Phase 3: 메인 탭 화면

- 대시보드 (통계 카드 + 최근 게시글)
- 게시판 (게시판 선택 + 게시글 목록 + 페이지네이션)
- 프로필 (사용자 정보 + 로그아웃)

### Phase 4: 게시글 관리

- 게시글 상세 보기
- 게시글 작성
- 게시글 삭제

### Phase 5: 관리자 기능

- 관리자 대시보드 (통계 + 최근 가입자)
- 사용자 관리 (검색 + 목록 + 활성화 토글 + 수정)
- 게시판 관리 (목록 + 생성/수정 + 활성화 토글)

### Phase 6: 빌드 및 배포

- EAS Build 설정
- expo-dev-client 설정
- iOS/Android 빌드
