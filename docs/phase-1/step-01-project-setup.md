# Phase 1: 프로젝트 초기 설정

## 상태: 완료

## 작업 내용

- [x] Expo 55 프로젝트 생성
  - 번들 ID: com.daekwon.mobileexpo
  - iOS, Android, Web 지원
- [x] NativeWind 설정
  - tailwind.config.js + global.css
  - metro.config.js + babel.config.js
- [x] Expo Router 파일 기반 라우팅
  - app/_layout.tsx — 루트 레이아웃 (폰트 로딩, AuthProvider)
  - app/(auth)/ — 인증 그룹
  - app/(tabs)/ — 메인 탭 그룹
  - app/posts/ — 게시글 CRUD
  - app/admin/ — 관리자 화면
- [x] TypeScript 타입 정의 (types/)
  - api.ts, auth.ts, user.ts, post.ts, board.ts, admin.ts, dashboard.ts
- [x] 다크모드 (useColorScheme)
- [x] 앱 아이콘 + 스플래시 설정 (app.json)
