import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),
  API_VERSION: process.env.API_VERSION || "v1",

  DB: {
    HOST: process.env.DB_HOST || "localhost",
    PORT: parseInt(process.env.DB_PORT || "5432", 10),
    NAME: process.env.DB_NAME || "mydb",
    USER: process.env.DB_USER || "root",
    PASS: process.env.DB_PASS || "",
  },

  JWT: {
    SECRET: process.env.JWT_SECRET || "fallback-secret",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  },

  isDev: () => env.NODE_ENV === "development",
  isProd: () => env.NODE_ENV === "production",
};
