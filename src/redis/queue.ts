import { logger } from "../../config/logger";
import client from "./redis";
import { config } from "../../config/config";

export async function enqueueEvent(payload: unknown): Promise<void> {
  await client.lPush(config.queue.label.store, JSON.stringify(payload));
}

export async function consumeBatch(): Promise<unknown[]> {
  const queueLength = await client.lLen(config.queue.label.store);
  if (queueLength === 0) {
    logger.warn("Queue is empty, nothing to flush");
    return [];
  }

  await client.rename(config.queue.label.store, config.queue.label.processing);

  const items =
    (await client.lPopCount(
      config.queue.label.processing,
      config.queue.batchLimit,
    )) ?? [];

  const remaining = await client.lLen(config.queue.label.processing);
  if (remaining > 0) {
    await client.rename(
      config.queue.label.processing,
      config.queue.label.store,
    );
    logger.info(`${remaining} events returned to queue for next batch`);
  } else {
    await client.del(config.queue.label.processing);
  }

  return items.map((item) => JSON.parse(item));
}
