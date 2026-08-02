import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { env } from "./lib/env.js";

const app = express();
const port = env.port;

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header include health checks and
      // server-to-server calls from other containers.
      if (!origin || env.trustedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Auth service listening on port ${port}`);
});
