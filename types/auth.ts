import type { UserInfo } from './user';

/** 로그인 요청 */
export interface LoginRequest {
  username: string;
  password: string;
}

/** 회원가입 요청 */
export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  email: string;
}

/** 로그인 응답 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

/** 토큰 갱신 요청 */
export interface RefreshRequest {
  refreshToken: string;
}

/** 토큰 응답 */
export interface TokenResponse {
  accessToken: string;
}
