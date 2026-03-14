# Phase 2: 인증

## 상태: 완료

## 작업 내용

- [x] API 클라이언트 (lib/api.ts)
  - Fetch API 래퍼
  - Bearer 토큰 자동 주입
  - 401 시 refresh 후 재시도 (동시 요청 큐)
  - ApiError 커스텀 에러 클래스
  - GET, POST, PUT, PATCH, DELETE 메서드
- [x] 토큰 저장 (lib/storage.ts)
  - iOS/Android: expo-secure-store (키체인)
  - Web: localStorage fallback
- [x] 인증 함수 (lib/auth.ts)
  - login(), register(), logout(), getProfile()
- [x] AuthContext (lib/auth-context.tsx)
  - user, isLoading 상태
  - signIn, signUp, signOut 액션
  - 앱 시작 시 저장된 토큰으로 자동 로그인
  - 회원가입 후 자동 로그인
