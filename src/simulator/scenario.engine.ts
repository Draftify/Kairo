import { config } from "../../config/config";
import { sendMessage } from "../kafka/producer";
import {
  generateOrderEvent,
  generatePaymentInitiatedEvent,
  generatePaymentSuccessEvent,
  generatePaymentFailureEvent,
  generateShipmentDelayedEvent,
  generateSystemErrorEvent,
} from "./event.generator";

const INCIDENT_GAP_MS = 3 * 60 * 1000;
const SLEEP_MS = 200;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function startRealisticScenario() {
  while (true) {
    await runNormalFlow();
    await sleep(INCIDENT_GAP_MS);
    await runPaymentIncident();
    await sleep(INCIDENT_GAP_MS);
    await runNormalFlow();
    await sleep(INCIDENT_GAP_MS);
    await runShippingDelayIncident();
    await sleep(INCIDENT_GAP_MS);
    await runSystemIncident();
    await sleep(INCIDENT_GAP_MS);
    await runNormalFlow();
    await sleep(INCIDENT_GAP_MS);
  }
}

async function runNormalFlow() {
  for (let i = 0; i < 10; i++) {
    const order = generateOrderEvent();
    await sendMessage(config.kafka.topic, order);
    await sleep(SLEEP_MS);
    const paymentInit = generatePaymentInitiatedEvent(
      order.orderId,
      order.userId,
    );
    await sendMessage(config.kafka.topic, paymentInit);
    await sleep(SLEEP_MS);
    const success = generatePaymentSuccessEvent(order.orderId, order.userId);
    await sendMessage(config.kafka.topic, success);
    await sleep(SLEEP_MS);
  }
}

async function runPaymentIncident() {
  for (let i = 0; i < 8; i++) {
    const order = generateOrderEvent();
    await sendMessage(config.kafka.topic, order);
    const paymentInit = generatePaymentInitiatedEvent(
      order.orderId,
      order.userId,
    );
    await sendMessage(config.kafka.topic, paymentInit);
    await sleep(SLEEP_MS);
    const fail = generatePaymentFailureEvent();
    await sendMessage(config.kafka.topic, fail);
    await sleep(SLEEP_MS);
  }
}

async function runShippingDelayIncident() {
  for (let i = 0; i < 5; i++) {
    const order = generateOrderEvent();
    await sendMessage(config.kafka.topic, order);
    await sleep(SLEEP_MS);
    const delay = generateShipmentDelayedEvent(order.orderId);
    await sendMessage(config.kafka.topic, delay);
    await sleep(SLEEP_MS);
  }
}

async function runSystemIncident() {
  for (let i = 0; i < 6; i++) {
    const error = generateSystemErrorEvent();
    await sendMessage(config.kafka.topic, error);
    await sleep(SLEEP_MS);
  }
}
