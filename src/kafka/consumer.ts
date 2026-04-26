import { logger } from "../../config/logger";
import { kafka } from "./kafka";
import { config } from "../../config/config";
import { enqueueEvent } from "../redis/queue";

let consumer: ReturnType<typeof kafka.consumer> | null = null;

export async function startConsumer(topic: string): Promise<void> {
  consumer = kafka.consumer({ groupId: config.kafka.groupId });
  await consumer.connect();
  logger.info(`Consumer connected successfully on topic: ${topic}`);
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const value = message.value?.toString();
        if (!value) {
          logger.warn("Empty Kafka message received, skipping");
          return;
        }
        const parsed = JSON.parse(value);
        await enqueueEvent(parsed);
      } catch (error) {
        logger.error(
          `Failed to process message: ${error instanceof Error ? error.message : error}`,
        );
      }
    },
  });
}

export async function disconnectConsumer(): Promise<void> {
  await consumer?.disconnect();
  logger.info("Kafka Consumer disconnected successfully");
}
