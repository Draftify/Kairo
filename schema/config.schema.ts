import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number(),

  KAFKA_BROKER: z.string().min(1),
  KAFKA_PORT: z.coerce.number(),

  KAFKA_USERNAME: z.string().min(1),
  KAFKA_PASSWORD: z.string().min(1),
  KAFKA_CLIENT_ID: z.string().min(1),
  KAFKA_GROUP_ID: z.string().min(1),

  REDIS_URL: z.string().min(1),

  SIMULATION_ENABLED: z
    .enum(["true", "false"])
    .default("false")
    .transform((val) => val === "true"),

  REPORT_INTERVAL_MINUTES: z.coerce.number(),

  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1),

  BATCH_LIMIT: z.coerce.number().min(15),
});
