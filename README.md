<p align="center">
  <img width="90" height="90" alt="image" src="https://github.com/user-attachments/assets/c7ebdcc6-6caf-46a5-859c-8cabe032d337" />
</p>

<p align="center">
  Kairo is a real-time event pipeline that consumes system events from Kafka, batches them in Redis, and generates concise AI-powered markdown reports on a scheduled interval using OpenAI via LangChain.
  <br/><br/>
  It is built with Bun and TypeScript, and is designed to run as a single long-lived backend service.
</p>

## Features

- Real-time Kafka event consumption with SASL/SCRAM-SHA-256 + TLS authentication
- Atomic Redis queue with batch overflow handling — excess events are returned to the queue, never dropped
- Scheduled AI-powered markdown reports via OpenAI and LangChain
- Configurable batch size and report interval via environment variables
- Retry logic with exponential backoff for failed AI calls
- Dead-letter queue for unrecoverable batches (`ai:batch:failed`)
- Built-in event simulator for local development and demos

## Project structure
```bash

├── index.ts                     # Entry point, bootstrap, graceful shutdown
├── config/
│   ├── config.ts                # Typed config object
│   ├── env.ts                   # Zod-validated env parsing
│   └── logger.ts                # Pino logger instance
├── schema/
│   └── config.schema.ts         # Zod env schema
├── src/
│   ├── kafka/
│   │   ├── kafka.ts             # KafkaJS client (SASL + TLS)
│   │   ├── init.ts              # initKafka / disconnectKafka
│   │   ├── producer.ts          # connectProducer / sendMessage / disconnectProducer
│   │   └── consumer.ts          # startConsumer / disconnectConsumer
│   ├── redis/
│   │   ├── redis.ts             # Redis client (TLS)
│   │   ├── init.ts              # initRedis / disconnectRedis
│   │   └── queue.ts             # enqueueEvent / consumeBatch
│   ├── ai/
│   │   ├── report.pipeline.ts   # Cron scheduler, retry logic, dead-letter
│   │   ├── report.generator.ts  # LangChain + OpenAI agent
│   │   └── report.writer.ts     # Saves report to disk
│   └── simulator/
│       ├── scenario.engine.ts   # Orchestrates scenario loops
│       └── event.generator.ts   # Generates typed event payloads
├── prompts/
│   └── prompts.ts               # System and user prompt templates
└── util/
    └── extract.report.ts        # Extracts text from LangChain messages
```
