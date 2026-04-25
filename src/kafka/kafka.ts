import { Kafka } from "kafkajs";
import fs from "fs";
import path from "path";
import { config } from "../../config/config";

const caPath = path.resolve(process.cwd(), "cert/ca.pem");
if (!fs.existsSync(caPath)) {
  throw new Error(`Kafka CA cert missing: ${caPath}`);
}
const ca = fs.readFileSync(caPath, "utf-8");

export const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: [config.kafka.broker],
  ssl: {
    ca: [ca],
  },
  sasl: {
    mechanism: "scram-sha-256",
    username: config.kafka.username,
    password: config.kafka.password,
  },
});
