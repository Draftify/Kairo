import { logger } from "../../config/logger";
import client from "./redis";

export async function initRedis(): Promise<void> {
  await client.connect();
  await client.ping();
  logger.info("Redis connected successfully");
}

export async function disconnectRedis(): Promise<void> {
  await client.quit();
  logger.info("Redis disconnected successfully");
}
