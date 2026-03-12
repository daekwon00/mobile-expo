/** 공통 API 응답 래퍼 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** 페이지네이션 응답 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

/** 정렬 순서 */
export type SortOrder = 'DESC' | 'ASC';
