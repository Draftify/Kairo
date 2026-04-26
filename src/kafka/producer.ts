import { kafka } from "./kafka";
import { logger } from "../../config/logger";

let producer = kafka.producer();
let isConnected = false;

export async function connectProducer(): Promise<void> {
  if (isConnected) return;
  await producer.connect();
  isConnected = true;
  logger.info("Kafka Producer connected successfully");
}

export async function sendMessage(
  topic: string,
  message: unknown,
): Promise<void> {
  if (!isConnected) throw new Error("Producer is not connected");
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
}

export async function disconnectProducer(): Promise<void> {
  if (!isConnected) return;
  await producer.disconnect();
  isConnected = false;
  logger.info("Kafka Producer disconnected successfully");
}
