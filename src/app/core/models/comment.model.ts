import { PostUser } from './post.model';

export interface Comment {
  _id: string;
  content: string;
  image?: string;
  commentCreator: PostUser;
  post: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
  repliesCount?: number; 
}