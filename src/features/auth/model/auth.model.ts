export type RegisterDto = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type TokenPayload = {
  id: string;
  email: string;
  role: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: {
    id: string;
    name: string | null;
    username: string;
    email: string;
    role: string;
  };
  tokens: AuthTokens;
};
