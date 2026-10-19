export interface PostUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface TopComment {
  _id: string;
  content: string;
  commentCreator: PostUser;
  post: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
}

export interface Post {
  _id: string;
  body?: string; 
  image?: string;
  privacy: string; 
  user: PostUser;
  isShare: boolean;
  sharedPost: Post | null; 
  likes: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  bookmarked: boolean;
  topComment: TopComment | null;
  createdAt: string;
}