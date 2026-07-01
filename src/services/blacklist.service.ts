import { prisma } from "../lib/prisma";
import { hashToken } from "../utils/jwt";
import jwt from "jsonwebtoken";

export const blacklistToken = async (token: string): Promise<void> => {
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
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const result = await prisma.blacklistedToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  return result !== null;
};

export const cleanupExpiredTokens = async (): Promise<void> => {
  await prisma.blacklistedToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
};
