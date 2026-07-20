import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/appError";
import bcrypt from "bcrypt";
import { 
  CreateUser, 
  UpdateUser, 
  ResponseUser, 
  toUserResponse, 
  PaginateUserQuery 
} from "../model/user.model";

const userSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  role: true,
  createdAt: true,
} as const;

export class UserService {
  static async getUsers(query: PaginateUserQuery = {}): Promise<{
    data: Array<ResponseUser>;
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 10));
    const skip = (page - 1) * limit;

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        select: userSelect,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    return {
      data: users.map((user) => toUserResponse(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getUserById(id: string): Promise<ResponseUser> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new AppError(`User dengan id ${id} tidak ditemukan`, 404);
    }

    return toUserResponse(user);
  }

  static async createUser(request: CreateUser): Promise<ResponseUser> {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: request.email }, { username: request.username }],
      },
    });

    if (existing) {
      if (existing.email === request.email) {
        throw new AppError("Email already registered", 409);
      }
      throw new AppError("Username already taken", 409);
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const user = await prisma.user.create({
      data: { ...request, password: hashedPassword },
      select: userSelect,
    });

    return toUserResponse(user);
  }

  static async updateUser(id: string, request: UpdateUser): Promise<ResponseUser> {
    await this.getUserById(id);

    if (request.email || request.username) {
      const orCondition: { email?: string; username?: string }[] = [];

      if (request.email) orCondition.push({ email: request.email });
      if (request.username) orCondition.push({ username: request.username });

      const existing = await prisma.user.findFirst({
        where: {
          OR: orCondition,
          NOT: { id },
        },
      });

      if (existing) {
        if (existing.email === request.email) {
          throw new AppError("Email already taken", 409);
        }
        throw new AppError("Username already taken", 409);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: request,
      select: userSelect,
    });

    return toUserResponse(updatedUser);
  }

  static async deleteUser(id: string): Promise<void> {
    await this.getUserById(id);
    await prisma.user.delete({ where: { id } });
  }
}
