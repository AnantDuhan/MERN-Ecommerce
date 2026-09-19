import pino from "pino";

/** One logger factory so every service logs the same shape, tagged by name. */
export const createLogger = (service: string) =>
  pino({
    name: service,
    level: process.env.LOG_LEVEL ?? "info",
    transport:
      process.env.NODE_ENV === "production"
        ? undefined
        : { target: "pino-pretty", options: { colorize: true } },
  });
