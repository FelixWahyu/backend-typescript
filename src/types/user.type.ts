import { Role } from "@/generated/prisma/enums";

export interface CreateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserDto {
  name?: string;
  username?: string;
  email?: string;
  role?: Role;
}

export interface UserResponse {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface PaginateQuery {
  limit?: number;
  page?: number;
}
