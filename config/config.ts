import { env } from "./env";

export const config = {
  port: env.PORT,

  kafka: {
    broker: `${env.KAFKA_BROKER}:${env.KAFKA_PORT}`,
    username: env.KAFKA_USERNAME,
    password: env.KAFKA_PASSWORD,
    clientId: env.KAFKA_CLIENT_ID,
    groupId: env.KAFKA_GROUP_ID,
    topic: "system-events",
  },

  simulation: {
    enabled: env.SIMULATION_ENABLED,
  },

  redis: {
    url: env.REDIS_URL,
  },

  queue: {
    label: {
      store: "ai:batch:queued",
      processing: "ai:batch:processing",
      failed: "ai:batch:failed",
    },
    retries: 3,
    batchLimit: env.BATCH_LIMIT,
  },

  scheduler: {
    reportIntervalMinutes: env.REPORT_INTERVAL_MINUTES ?? 5,
  },

  ai: {
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL,
  },
};
