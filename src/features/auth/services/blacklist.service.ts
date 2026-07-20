import { prisma } from "@/lib/prisma";
import { hashToken } from "@/utils/jwt";
import jwt from "jsonwebtoken";

export class BlacklistService {
  static async blacklistToken(token: string): Promise<void> {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 15 * 60 * 1000);

    await prisma.blacklistedToken.create({
      data: {
        tokenHash: hashToken(token),
        expiresAt,
      },
    });
  }

  static async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await prisma.blacklistedToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });
    return result !== null;
  }

  static async cleanupExpiredTokens(): Promise<void> {
    await prisma.blacklistedToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
