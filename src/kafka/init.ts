import { config } from "../../config/config";
import { disconnectConsumer, startConsumer } from "./consumer";
import { connectProducer, disconnectProducer } from "./producer";

export async function initKafka() {
  if (config.simulation.enabled) await connectProducer();
  await startConsumer(config.kafka.topic);
}

export async function disconnectKafka(): Promise<void> {
  await disconnectConsumer();
  if (config.simulation.enabled) await disconnectProducer();
}
