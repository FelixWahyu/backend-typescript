import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { CreateUserDto, UpdateUserDto, UserResponse, PaginateQuery } from "../types/user.type";
import bcrypt from "bcrypt";

const userSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  role: true,
  createdAt: true,
} as const;

export const findAllUsers = async (query: PaginateQuery = {}) => {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 10));
  const skip = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      select: userSelect,
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const createUser = async (data: CreateUserDto) => {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: data.email,
        },
        {
          username: data.username,
        },
      ],
    },
  });

  if (existing) {
    if (existing.email === data.email) {
      throw new AppError("Email already register", 409);
    }
    throw new AppError("Username already taken", 409);
  }

  const hashPassword = await bcrypt.hash(data.password, 10);

  const createData = await prisma.user.create({ data: { ...data, password: hashPassword }, select: userSelect });

  return createData;
};
