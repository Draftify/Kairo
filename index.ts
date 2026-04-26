import { config } from "./config/config";
import { logger } from "./config/logger";
import { disconnectKafka, initKafka } from "./src/kafka/init";
import { disconnectRedis, initRedis } from "./src/redis/init";
import { startRealisticScenario } from "./src/simulator/scenario.engine";
import { scheduleReportPipeline } from "./src/ai/report.pipeline";

const server = Bun.serve({
  port: config.port,
  fetch: () =>
    new Response("Kairo is alive — events are flowing, reports are brewing."),
});

let isShuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.info(`${signal} received — shutting down gracefully`);
  try {
    await disconnectKafka();
    await disconnectRedis();
    server.stop();
    logger.info("Shutdown complete");
    process.exit(0);
  } catch (error) {
    logger.error(
      `Shutdown error: ${error instanceof Error ? error.message : error}`,
    );
    process.exit(1);
  }
}

async function bootstrap() {
  try {
    await initRedis();
    await initKafka();
    if (config.simulation.enabled) startRealisticScenario();
    scheduleReportPipeline();
  } catch (error) {
    logger.error(`${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
  logger.info(`Kairo running on ${server.hostname}:${server.port}`);
}

bootstrap();

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
