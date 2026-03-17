import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import routes from "./routes/index";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import path from "path";

const app: Application = express();

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: env.isDev() ? "*" : process.env.ALLOWED_ORIGINS?.split(","),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Logging ──────────────────────────────────────────────────────────────────
if (env.isDev()) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(`/api/${env.API_VERSION}`, routes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
