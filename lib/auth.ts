import { api } from './api';
import { tokenStorage } from './storage';
import type { LoginRequest, LoginResponse, RegisterRequest, UserInfo, UserProfile } from '@/types';

/** 로그인 */
export async function login(params: LoginRequest): Promise<LoginResponse> {
  const result = await api.post<LoginResponse>('/api/v1/auth/login', params, { noAuth: true });
  await tokenStorage.setTokens(result.data.accessToken, result.data.refreshToken);
  return result.data;
}

/** 회원가입 */
export async function register(params: RegisterRequest): Promise<UserInfo> {
  const result = await api.post<UserInfo>('/api/v1/auth/register', params, { noAuth: true });
  return result.data;
}

/** 로그아웃 */
export async function logout(): Promise<void> {
  await tokenStorage.clearTokens();
}

/** 내 프로필 조회 */
export async function getMyProfile(): Promise<UserProfile> {
  const result = await api.get<UserProfile>('/api/v1/users/me');
  return result.data;
}

/** 로그인 상태 확인 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await tokenStorage.getAccessToken();
  return token !== null;
}
