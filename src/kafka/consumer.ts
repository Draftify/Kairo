import { logger } from "../../config/logger";
import { kafka } from "./kafka";
import { config } from "../../config/config";
import { enqueueEvent } from "../redis/queue";

export async function startConsumer(topic: string) {
  const consumer = kafka.consumer({ groupId: config.kafka.groupId });
  await consumer.connect();
  logger.info(`Consumer connected successfully on topic: ${topic}`);
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const value = message.value?.toString();
        const parsed = JSON.parse(value || "{}");
        await enqueueEvent(parsed);
      } catch (error) {
        logger.error(
          `Failed to process message: ${error instanceof Error ? error.message : error}`,
        );
      }
    },
  });
}
