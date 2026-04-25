import { config } from "./config/config";
import { logger } from "./config/logger";
import { initKafka } from "./src/kafka/init";
import { initRedis } from "./src/redis/init";
import { startRealisticScenario } from "./src/simulator/scenario.engine";
import { scheduleReportPipeline } from "./src/ai/report.pipeline";

const server = Bun.serve({
  port: config.port,
  fetch: () =>
    new Response("Kairo is alive — events are flowing, reports are brewing."),
});

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
