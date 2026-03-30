export interface PostAuthor {
  id: string;
  name: string | null;
  username: string;
}

export interface CreatePost {
  title: string;
  content?: string;
  published?: boolean;
  authorId: string;
}

export interface UpdatePost {
  title?: string;
  content?: string;
  published?: boolean;
  authorId?: string;
}

export interface PostResponse {
  id: string;
  title: string;
  content: string | null;
  published: boolean | null;
  author: PostAuthor;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}
