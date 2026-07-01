export interface BlogRequest {
  title: string;
  slug: string;
  description: string;
}

export interface BlogResponse {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
