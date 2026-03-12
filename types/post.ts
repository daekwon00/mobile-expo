import type { SortOrder } from './api';

/** 게시글 목록 아이템 */
export interface PostListItem {
  id: number;
  boardId: string;
  title: string;
  authorName: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

/** 게시글 상세 */
export interface Post {
  id: number;
  boardId: string;
  title: string;
  content: string;
  author: PostAuthor;
  viewCount: number;
  files: FileInfo[];
  createdAt: string;
  updatedAt: string;
}

/** 게시글 작성자 */
export interface PostAuthor {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

/** 첨부파일 정보 */
export interface FileInfo {
  id: number;
  originalName: string;
  storedName: string;
  size: number;
  contentType: string;
}

/** 게시글 목록 조회 파라미터 */
export interface PostListParams {
  page?: number;
  size?: number;
  search?: string;
  searchType?: string;
  sortOrder?: SortOrder;
}

/** 게시글 작성 요청 */
export interface CreatePostRequest {
  boardId: string;
  title: string;
  content: string;
  fileIds?: number[];
}

/** 게시글 수정 요청 */
export interface UpdatePostRequest {
  title: string;
  content: string;
  fileIds?: number[];
}
