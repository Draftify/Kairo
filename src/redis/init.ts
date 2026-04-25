import { logger } from "../../config/logger";
import client from "./redis";

export async function initRedis(): Promise<void> {
  await client.connect();
  await client.ping();
  logger.info("Redis connected successfully");
}
