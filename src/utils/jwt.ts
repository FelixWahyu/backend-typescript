import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { TokenPayload, AuthTokens } from "../types/auth.type";

export const generateAccessToken = (payload: TokenPayload): string => {
  const jwtAccessToken = jwt.sign(payload, env.JWT.JWT_SECRET, {
    expiresIn: env.JWT.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  return jwtAccessToken;
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const jwtRefreshToken = jwt.sign(payload, env.JWT.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);

  return jwtRefreshToken;
};

export const generateTokens = (payload: TokenPayload): AuthTokens => {
  const tokens = {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };

  return tokens;
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const accessToken = jwt.verify(token, env.JWT.JWT_SECRET) as TokenPayload;

  return accessToken;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const refreshToken = jwt.verify(token, env.JWT.JWT_REFRESH_SECRET) as TokenPayload;

  return refreshToken;
};
