# mobile-expo — Progress

## Phase 1: 프로젝트 초기 설정

- [x] Expo 55 프로젝트 생성
- [x] NativeWind (Tailwind) 설정
- [x] Expo Router 파일 기반 라우팅
- [x] TypeScript 타입 정의 (types/)
- [x] 다크모드 지원 (useColorScheme)

## Phase 2: 인증

- [x] API 클라이언트 (lib/api.ts) — JWT 자동 주입 + 갱신
- [x] expo-secure-store 토큰 저장 (lib/storage.ts)
- [x] AuthContext (lib/auth-context.tsx) — signIn, signUp, signOut
- [x] 로그인 화면 (app/(auth)/login.tsx)
- [x] 회원가입 화면 (app/(auth)/register.tsx)
- [x] 자동 로그인 (저장된 토큰으로 세션 복원)

## Phase 3: 메인 탭 화면

- [x] 탭 네비게이션 (Dashboard, Board, Admin, Profile)
- [x] 대시보드 — 통계 카드 4종 + 최근 게시글
- [x] 게시판 — 게시판 선택 탭 + 게시글 목록 + 페이지네이션
- [x] 프로필 — 사용자 정보 + 로그아웃

## Phase 4: 게시글 관리

- [x] 게시글 상세 (app/posts/[id].tsx)
- [x] 게시글 작성 (app/posts/create.tsx)
- [x] 게시글 삭제 (작성자만)
- [ ] 게시글 수정

## Phase 5: 관리자 기능

- [x] 관리자 대시보드 (app/(tabs)/admin.tsx)
- [x] 사용자 관리 (app/admin/users.tsx) — 검색 + 활성화 토글
- [x] 사용자 수정 (app/admin/user-edit.tsx)
- [x] 게시판 관리 (app/admin/boards.tsx) — 생성/수정 모달 + 활성화 토글

## Phase 6: 빌드 및 배포

- [x] EAS Build 설정 (eas.json)
- [x] expo-dev-client 설정
- [ ] iOS 빌드
- [ ] Android 빌드
