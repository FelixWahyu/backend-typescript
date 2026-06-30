import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { CreateUserDto, UpdateUserDto, UserResponse, PaginateQuery } from "../types/user.type";
import bcrypt from "bcrypt";

/**
 * Field yang dipilih untuk response user (tanpa password).
 */
const userSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  role: true,
  createdAt: true,
} as const;

/**
 * Ambil semua user dengan pagination.
 */
export const findAllUsers = async (query: PaginateQuery = {}) => {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 10));
  const skip = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      select: userSelect,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

/**
 * Cari user berdasarkan ID.
 */
export const findUserById = async (id: string): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });

  if (!user) {
    throw new AppError(`User dengan id ${id} tidak ditemukan`, 404);
  }

  return user;
};

/**
 * Buat user baru. Cek duplikasi email & username.
 */
export const createUser = async (data: CreateUserDto): Promise<UserResponse> => {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existing) {
    if (existing.email === data.email) {
      throw new AppError("Email already registered", 409);
    }
    throw new AppError("Username already taken", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: { ...data, password: hashedPassword },
    select: userSelect,
  });

  return user;
};

/**
 * Update user. Cek duplikasi jika email/username diubah.
 */
export const updateUserById = async (id: string, data: UpdateUserDto): Promise<UserResponse> => {
  await findUserById(id);

  if (data.email || data.username) {
    const orCondition: { email?: string; username?: string }[] = [];

    if (data.email) orCondition.push({ email: data.email });
    if (data.username) orCondition.push({ username: data.username });

    const existing = await prisma.user.findFirst({
      where: {
        OR: orCondition,
        NOT: { id },
      },
    });

    if (existing) {
      if (existing.email === data.email) {
        throw new AppError("Email already taken", 409);
      }
      throw new AppError("Username already taken", 409);
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });

  return updatedUser;
};

/**
 * Hapus user berdasarkan ID.
 */
export const deleteUserById = async (id: string): Promise<void> => {
  await findUserById(id);
  await prisma.user.delete({ where: { id } });
};
