/** 대시보드 통계 */
export interface DashboardStats {
  totalPosts: number;
  todayPosts: number;
  totalUsers: number;
  myPosts: number;
}

/** 차트 데이터 */
export interface ChartData {
  date: string;
  count: number;
}
