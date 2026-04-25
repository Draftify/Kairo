import { kafka } from "./kafka";
import { logger } from "../../config/logger";

let producer = kafka.producer();
let isConnected = false;

export async function connectProducer() {
  if (isConnected) return;

  await producer.connect();
  isConnected = true;

  logger.info("Kafka Producer connected successfully");
}

export async function sendMessage(topic: string, message: unknown) {
  if (!isConnected) throw new Error("Producer is not connected");
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
}
