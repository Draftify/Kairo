import { createClient } from "redis";
import { config } from "../../config/config";
import { logger } from "../../config/logger";

const client = createClient({
  url: config.redis.url,
  socket: {
    tls: true,
    rejectUnauthorized: true,
  },
});

client.on("error", (error) => {
  logger.error(`Redis client error: ${error.message}`);
});

export default client;
