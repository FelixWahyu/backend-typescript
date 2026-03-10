import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT}/api/${env.API_VERSION}`);
  console.log(`📦 Environment: ${env.NODE_ENV}`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("✅ Server closed.");
    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    console.error("⚠️  Forcing shutdown after timeout.");
    process.exit(1);
  }, 10_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: Error) => {
  console.error("Unhandled Rejection:", reason.message);
  server.close(() => process.exit(1));
});
