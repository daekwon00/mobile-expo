/** 게시판 */
export interface Board {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  postCount: number;
}
