import { randomUUID } from "crypto";

export function generateOrderEvent() {
  return {
    eventId: randomUUID(),
    type: "order.created",
    timestamp: new Date().toISOString(),
    service: "order-service",
    orderId: randomUUID(),
    userId: randomUUID(),
    metadata: {
      amount: Math.floor(Math.random() * 500),
    },
  };
}

export function generatePaymentInitiatedEvent(
  orderId?: string,
  userId?: string,
) {
  return {
    eventId: randomUUID(),
    type: "payment.initiated",
    timestamp: new Date().toISOString(),
    service: "payment-service",
    orderId: orderId || randomUUID(),
    userId: userId || randomUUID(),
    paymentId: randomUUID(),
    method: "card",
    amount: Math.floor(Math.random() * 500),
  };
}

export function generatePaymentSuccessEvent(orderId?: string, userId?: string) {
  return {
    eventId: randomUUID(),
    type: "payment.success",
    timestamp: new Date().toISOString(),
    service: "payment-service",
    orderId: orderId || randomUUID(),
    userId: userId || randomUUID(),
    paymentId: randomUUID(),
    transactionId: randomUUID(),
    status: "completed",
  };
}

export function generatePaymentFailureEvent() {
  return {
    eventId: randomUUID(),
    type: "payment.failed",
    timestamp: new Date().toISOString(),
    service: "payment-service",
    orderId: randomUUID(),
    userId: randomUUID(),
    error: {
      code: "CARD_DECLINED",
      message: "Insufficient funds",
    },
  };
}

export function generateShipmentDelayedEvent(orderId?: string) {
  return {
    eventId: randomUUID(),
    type: "shipment.delayed",
    timestamp: new Date().toISOString(),
    service: "shipping-service",
    orderId: orderId || randomUUID(),
    shipmentId: randomUUID(),
    reason: "Weather disruption",
    delayHours: Math.floor(Math.random() * 48) + 1,
  };
}

export function generateSystemErrorEvent() {
  const errors = [
    "DATABASE_CONNECTION_FAILED",
    "HIGH_CPU_USAGE",
    "MEMORY_LEAK_DETECTED",
    "KAFKA_CONSUMER_LAG",
  ];

  return {
    eventId: randomUUID(),
    type: "system.error",
    timestamp: new Date().toISOString(),
    service: "infra-service",
    errorCode: errors[Math.floor(Math.random() * errors.length)],
    severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
  };
}
