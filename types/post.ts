import { Timestamp } from "firebase/firestore";

export type PostType = "achievement" | "event" | "article" | "news";

export interface Post {
  id: string;
  title: string;
  description: string;
  type: PostType;
  imageUrl?: string;
  links?: string[];
  eventDate?: Date;
  authorId: string;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreatePostData {
  title: string;
  description: string;
  type: PostType;
  imageUrl?: string;
  links?: string[];
  eventDate?: Date;
}
