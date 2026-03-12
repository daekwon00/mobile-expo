/** 사용자 기본 정보 */
export interface UserInfo {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

/** 사용자 프로필 */
export interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  position: string | null;
  role: string;
  createdAt: string;
}

/** 프로필 수정 요청 */
export interface UpdateProfileRequest {
  name: string;
  email: string;
  phone: string;
}

/** 비밀번호 변경 요청 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/** 로그인 이력 */
export interface LoginHistory {
  loginIp: string;
  loginSuccess: boolean;
  loginFailReason: string | null;
  loginDate: string;
}
