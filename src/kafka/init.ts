import { config } from "../../config/config";
import { startConsumer } from "./consumer";
import { connectProducer } from "./producer";

export async function initKafka() {
  if (config.simulation.enabled) await connectProducer();
  await startConsumer(config.kafka.topic);
}
