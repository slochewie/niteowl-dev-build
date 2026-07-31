import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Auth service listening on port ${port}`);
});
