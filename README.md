<p align="center">
  <img width="90" height="90" alt="image" src="https://github.com/user-attachments/assets/c7ebdcc6-6caf-46a5-859c-8cabe032d337" />
</p>

<p align="center">
  Kairo is a real-time event pipeline that consumes system events from Kafka, batches them in Redis, and generates concise AI-powered markdown reports on a scheduled interval using OpenAI via LangChain.
  <br/><br/>
  It is built with Bun and TypeScript, and is designed to run as a single long-lived backend service.
</p>

## Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Configuration Guide: Environment & Kafka Integration](#configuration-guide-environment--kafka-integration)
7. [Running the Application: Development and Production](#running-the-application-development-and-production)
8. [Reports](#reports)
9. [Testing](#testing)
10. [Contributing](#contributing)
11. [License](#license)

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

## Tech stack

- **[Bun](https://bun.sh)** — runtime and package manager
- **[KafkaJS](https://kafka.js.org)** — Kafka producer and consumer
- **[node-redis](https://github.com/redis/node-redis)** — Redis client
- **[LangChain](https://langchain.com)** — AI agent orchestration
- **[OpenAI](https://openai.com)** — report generation model
- **[node-cron](https://github.com/node-cron/node-cron)** — report scheduling
- **[Zod](https://zod.dev)** — runtime environment validation
- **[Pino](https://getpino.io)** — structured JSON logging
- **[TypeScript](https://www.typescriptlang.org)** — strict mode enabled

## Prerequisites

- [Bun](https://bun.sh) v1.0 or higher
- A running Kafka broker with SASL/SCRAM-SHA-256 + TLS
- A running Redis instance with TLS
- An OpenAI API key
- A Kafka CA certificate at `cert/ca.pem`

## Installation

```bash
git clone https://github.com/Draftify/Kairo.git
cd Kairo
bun install
```

## Configuration Guide: Environment & Kafka Integration

Here is the example .env file that you need to create in the root of the project.
```bash
PORT=9070

KAFKA_BROKER=
KAFKA_PORT=
KAFKA_USERNAME=
KAFKA_PASSWORD=

KAFKA_CLIENT_ID=kairo
KAFKA_GROUP_ID=kairo-group

SIMULATION_ENABLED=false/true

REDIS_URL=

REPORT_INTERVAL_MINUTES= 

OPENAI_MODEL=
OPENAI_API_KEY=

BATCH_LIMIT=15
```
Kairo requires a CA certificate to establish a TLS connection to Kafka. Place it at:

```bash
cert/ca.pem
```
## Running the Application: Development and Production
**Development** (with watch mode):
```bash
bun dev
```

**Production**:
```bash
bun run build
bun start
```
## Reports

Generated reports are saved to the `./reports/` directory as markdown files:

```
reports/
  report-2026-04-26T04-22-27-472Z.md
  report-2026-04-26T04-27-27-891Z.md
```

Each report is structured as:

```markdown
## Summary — *what just happened*
## Key Metrics — *the numbers that matter*
## Anomalies & Warnings — *what needs eyes on it now*

**Bottom Line:** ...
```

## Testing

In sha'Allah, the test code will be released within the next couple of months, as we continue to work diligently on its development.

## Contributing

If you would like to contribute to this, please open an issue on GitHub to discuss your ideas or proposed changes. Pull requests are also welcome.

## License

This is available under the MIT License. You are free to use, modify, and distribute this project as you see fit.
