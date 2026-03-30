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
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);

  const result = { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };

  return result;
};

export const findUserById = async (id: string): Promise<UserResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });

  if (!existingUser) {
    throw new AppError(`User dengan ${id} tidak ditemukan`, 404);
  }

  return existingUser;
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

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({ data: { ...data, password: hashedPassword }, select: userSelect });

  return user;
};

export const userCreate = async (dto: CreateUserDto): Promise<UserResponse> => {
  const isExisting = await prisma.user.findFirst({
    where: {
      OR: [{ email: dto.email }, { username: dto.username }],
    },
  });

  if (isExisting) {
    if (isExisting.username === dto.username) throw new AppError("Username already taken", 409);

    throw new AppError("Email already taken", 409);
  }

  const hashedPass = await bcrypt.hash(dto.password, 10);
  const user = await prisma.user.create({
    data: { ...dto, password: hashedPass },
    select: userSelect,
  });

  return user;
};

export const updateUserById = async (id: string, data: UpdateUserDto): Promise<UserResponse> => {
  await findUserById(id);

  if (data.email || data.username) {
    const orCondition: { email?: string; username?: string }[] = [];

    if (data.email) orCondition.push({ email: data.email });
    if (data.username) orCondition.push({ username: data.username });

    const isExisting = await prisma.user.findFirst({
      where: {
        OR: orCondition,
        NOT: { id },
      },
    });

    if (isExisting) {
      if (isExisting.email === data.email) {
        throw new AppError("Email already taken", 409);
      }
      throw new AppError("Username already taken", 409);
    }
  }

  const updatedUser = await prisma.user.update({ where: { id }, data, select: userSelect });

  return updatedUser;
};

export const deleteUserById = async (id: string): Promise<void> => {
  await findUserById(id);

  await prisma.user.delete({ where: { id } });
};

// export class UserService {

//   // GET semua user dengan pagination
//   static async findAll(query: PaginationQuery = {}): Promise<{
//     users: UserResponse[];
//     meta: { page: number; limit: number; total: number; totalPages: number };
//   }> {
//     const page = Math.max(1, query.page ?? 1);
//     const limit = Math.min(100, Math.max(1, query.limit ?? 10)); // max 100 per page
//     const skip = (page - 1) * limit;

//     // Jalankan dua query sekaligus — lebih efisien dari sequential
//     const [users, total] = await prisma.$transaction([
//       prisma.user.findMany({
//         select: userSelect,
//         skip,
//         take: limit,
//         orderBy: { createdAt: "desc" },
//       }),
//       prisma.user.count(),
//     ]);

//     return {
//       users,
//       meta: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }

//   // GET user by ID
//   static async findById(id: string): Promise<UserResponse> {
//     const user = await prisma.user.findUnique({
//       where: { id },
//       select: userSelect,
//     });

//     if (!user) {
//       throw new AppError("User not found", 404); // ← dilempar ke errorHandler
//     }

//     return user;
//   }

//   // GET user by email — untuk auth
//   static async findByEmail(email: string) {
//     return prisma.user.findUnique({
//       where: { email },
//       // ✅ tidak pakai userSelect — butuh password untuk verifikasi
//     });
//   }

//   // CREATE user
//   static async create(dto: CreateUserDto): Promise<UserResponse> {
//     // Cek email sudah ada
//     const existing = await prisma.user.findUnique({
//       where: { email: dto.email },
//     });

//     if (existing) {
//       throw new AppError("Email already exists", 409);
//     }

//     const user = await prisma.user.create({
//       data: dto,
//       select: userSelect,
//     });

//     return user;
//   }

//   // UPDATE user
//   static async update(id: string, dto: UpdateUserDto): Promise<UserResponse> {
//     // Pastikan user ada dulu
//     await this.findById(id);

//     // Cek email baru tidak bentrok dengan user lain
//     if (dto.email) {
//       const existing = await prisma.user.findFirst({
//         where: {
//           email: dto.email,
//           NOT: { id }, // exclude user yang sedang diupdate
//         },
//       });

//       if (existing) {
//         throw new AppError("Email already taken", 409);
//       }
//     }

//     return prisma.user.update({
//       where: { id },
//       data: dto,
//       select: userSelect,
//     });
//   }

//   // DELETE user
//   static async delete(id: string): Promise<void> {
//     // Pastikan user ada dulu
//     await this.findById(id);

//     await prisma.user.delete({
//       where: { id },
//     });
//   }
// }
