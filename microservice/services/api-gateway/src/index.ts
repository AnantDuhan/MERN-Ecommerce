import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import {
  createLogger,
  verifyToken,
  USER_ID_HEADER,
  USER_ROLE_HEADER,
  USER_MFA_HEADER,
  mountHealth,
} from "@order-planning/shared";
import { routes } from "./registry";

const log = createLogger("api-gateway");
const app = express();
const PORT = Number(process.env.PORT ?? 4000);
// Same var the monolith signs with, so tokens already in users' cookies keep
// validating during the migration.
const JWT_SECRET = process.env.JWT_SECRET_KEY ?? "dev-secret-change-me";

const allowedOrigins = (process.env.ALLOWED_ORIGINS ??
  "http://localhost:3000,https://orderplanning.netlify.app").split(",");

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(
  rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: true, legacyHeaders: false }),
);

mountHealth(app, "api-gateway");

/**
 * Verify the JWT once, here, and strip any client-supplied identity headers so
 * a caller can never spoof x-user-*. Downstream services read these headers as
 * trusted because only the gateway sets them.
 */
function attachUser(required: boolean): express.RequestHandler {
  return (req, res, next) => {
    delete req.headers[USER_ID_HEADER];
    delete req.headers[USER_ROLE_HEADER];
    delete req.headers[USER_MFA_HEADER];

    const bearer = req.header("authorization")?.replace(/^Bearer\s+/i, "");
    const token = bearer ?? (req.cookies?.token as string | undefined);

    if (token) {
      try {
        const user = verifyToken(token, JWT_SECRET);
        req.headers[USER_ID_HEADER] = user.id;
        req.headers[USER_ROLE_HEADER] = user.role;
        req.headers[USER_MFA_HEADER] = String(user.mfaVerified);
      } catch {
        if (required) return res.status(401).json({ message: "Invalid or expired token" });
      }
    } else if (required) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };
}

for (const rule of routes) {
  app.use(
    rule.prefix,
    attachUser(rule.requireAuth),
    createProxyMiddleware({
      target: rule.target,
      changeOrigin: true,
      pathRewrite: (path) => `${rule.prefix}${path}`,
      on: {
        error: (err, _req, res) => {
          log.error({ err: err.message, target: rule.target }, "proxy error");
          (res as express.Response).status(502).json({ message: "Upstream service unavailable" });
        },
      },
    }),
  );
  log.info({ prefix: rule.prefix, target: rule.target }, "route registered");
}

app.listen(PORT, () => log.info({ port: PORT }, "api-gateway listening"));
