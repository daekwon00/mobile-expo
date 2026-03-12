/** 관리자 대시보드 통계 */
export interface AdminDashboardStats {
  totalUsers: number;
  todayRegistered: number;
  activeBoards: number;
  todayPosts: number;
}

/** 최근 가입 사용자 */
export interface RecentUser {
  id: number;
  username: string;
  name: string;
  email: string;
  createdAt: string;
}

/** 관리자용 사용자 정보 */
export interface AdminUser {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  position: string | null;
  createdAt: string;
  isActive: boolean;
  lastLoginAt: string | null;
}

/** 사용자 생성 요청 */
export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
}

/** 사용자 수정 요청 */
export interface UpdateUserRequest {
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  position?: string;
}

/** 관리자용 게시판 정보 */
export interface AdminBoard {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  postCount: number;
}

/** 게시판 생성 요청 */
export interface CreateBoardRequest {
  id: string;
  name: string;
  description: string;
}

/** 게시판 수정 요청 */
export interface UpdateBoardRequest {
  name: string;
  description: string;
}
