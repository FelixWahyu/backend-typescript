import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/appError";
import { generateTokens, verifyRefreshToken, hashToken } from "@/utils/jwt";
import { LoginDto, RegisterDto, AuthResponse } from "../model/auth.model";

const userSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  role: true,
} as const;

export class AuthService {
  static async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existing) {
      if (existing.username === dto.username) {
        throw new AppError("Username already taken", 409);
      }
      throw new AppError("Email already taken", 409);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await prisma.user.create({
      data: { ...dto, password: hashedPassword },
      select: userSelect,
    });

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.refreshToken.create({
      data: {
        token: hashToken(tokens.refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { user, tokens };
  }

  static async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new AppError("Email atau Password salah!", 401);

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new AppError("Email atau Password salah!", 401);

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.refreshToken.create({
      data: {
        token: hashToken(tokens.refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      tokens,
    };
  }

  static async refreshToken(token: string): Promise<{ accessToken: string }> {
    const payload = verifyRefreshToken(token);

    const savedToken = await prisma.refreshToken.findUnique({
      where: { token: hashToken(token) },
      include: { user: true },
    });

    if (!savedToken) {
      throw new AppError("Refresh token tidak valid", 401);
    }

    if (savedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: savedToken.id } });
      throw new AppError("Refresh token expired, silakan login kembali", 401);
    }

    const accessToken = generateTokens({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    }).accessToken;

    return { accessToken };
  }

  static async logout(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token: hashToken(token) } });
  }
}
