import cron from "node-cron";
import CronTime from "cron-time-generator";
import { consumeBatch } from "../redis/queue";
import { logger } from "../../config/logger";
import { generateReport } from "./report.generator";
import { saveReport } from "./report.writer";
import { config } from "../../config/config";
import client from "../redis/redis";

const MAX_RETRIES = config.queue.retries;

async function runReportPipeline(): Promise<void> {
  const events = await consumeBatch();

  if (events.length === 0) {
    logger.warn("No events in queue — skipping report.");
    return;
  }

  logger.info(`Consumed ${events.length} events from queue.`);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const report = await generateReport(events);
      const filepath = await saveReport(report);
      logger.info(`Pipeline complete. Report at: ${filepath}`);
      return;
    } catch (error) {
      logger.warn(
        `Report attempt ${attempt}/${MAX_RETRIES} failed: ${error instanceof Error ? error.message : error}`,
      );
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }

  logger.error("All retries failed — sending batch to dead-letter queue");
  for (const event of events) {
    await client.lPush(config.queue.label.failed, JSON.stringify(event));
  }
}

export function scheduleReportPipeline() {
  cron.schedule(
    CronTime.every(config.scheduler.reportIntervalMinutes).minutes(),
    () => {
      runReportPipeline().catch((e) =>
        logger.error(
          `Scheduled report failed: ${e instanceof Error ? e.message : e}`,
        ),
      );
    },
  );
  logger.info(
    `Report pipeline scheduled every ${config.scheduler.reportIntervalMinutes} minutes.`,
  );
}
