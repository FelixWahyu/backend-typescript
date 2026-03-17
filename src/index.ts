import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

const PORT = Number(env.PORT);
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api/${env.API_VERSION}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Database disconnected.");
    console.log("Server closed.");
    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    console.error("Forcing shutdown after timeout.");
    process.exit(1);
  }, 10_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Rejection:", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error.message);
  server.close(() => process.exit(1));
});
