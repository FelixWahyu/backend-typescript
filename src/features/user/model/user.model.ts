import { Role } from "@/generated/prisma/enums";

export type CreateUser = {
  name?: string | null;
  username: string;
  email: string;
  password: string;
  role?: Role;
};

export type UpdateUser = {
  name?: string | null;
  username?: string;
  email?: string;
  role?: Role;
};

export type ResponseUser = {
  id: string;
  name: string | null;
  username: string;
  email: string;
  role: Role;
  createdAt: Date;
};

export type PaginateUserQuery = {
  limit?: number;
  page?: number;
};

export const toUserResponse = (user: any): ResponseUser => {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};
