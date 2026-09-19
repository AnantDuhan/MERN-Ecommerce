import pino, { type LoggerOptions } from "pino";

/**
 * One logger factory so every service logs the same shape, tagged by name.
 *
 * Defaults to plain (JSON) logging, which needs no extra dependency and boots
 * identically under tsx, in Docker, and in production. Pretty dev logs are
 * opt-in: set LOG_PRETTY=true and install pino-pretty, or (simpler, and what
 * pino itself recommends) pipe the output — e.g. `npm run dev:gateway | npx
 * pino-pretty`. Piping keeps the pretty-printer out of the app's own process,
 * which avoids the transport-worker resolution issues that bundlers/tsx can hit.
 */
export const createLogger = (service: string) => {
  const options: LoggerOptions = {
    name: service,
    level: process.env.LOG_LEVEL ?? "info",
  };

  if (process.env.LOG_PRETTY === "true") {
    try {
      require.resolve("pino-pretty");
      options.transport = { target: "pino-pretty", options: { colorize: true } };
    } catch {
      // pino-pretty not installed — fall back to plain JSON rather than crash.
    }
  }

  return pino(options);
};
