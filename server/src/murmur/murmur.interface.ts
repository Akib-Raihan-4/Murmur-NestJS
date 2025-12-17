export interface IMurmurResponse {
  id: number;
  text: string;
  createdAt: Date;
  author: {
    id: number;
    username: string;
    name: string;
  };
  likesCount: number;
  isLiked: boolean;
}
