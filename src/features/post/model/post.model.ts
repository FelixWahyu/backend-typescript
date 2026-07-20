export type PostAuthor = {
  id: string;
  name: string | null;
  email: string;
};

export type CreatePost = {
  title: string;
  content?: string;
  published?: boolean;
  authorId: string;
};

export type UpdatePost = {
  title?: string;
  content?: string;
  published?: boolean;
  authorId?: string;
};

export type ResponsePost = {
  id: string;
  title: string;
  content: string | null;
  published: boolean | null;
  author: PostAuthor;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatePostQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export const toPostResponse = (post: any): ResponsePost => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    published: post.published,
    author: {
      id: post.author.id,
      name: post.author.name,
      email: post.author.email,
    },
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};
