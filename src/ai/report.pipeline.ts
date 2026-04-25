import cron from "node-cron";
import CronTime from "cron-time-generator";
import { consumeBatch } from "../redis/queue";
import { logger } from "../../config/logger";
import { generateReport } from "./report.generator";
import { saveReport } from "./report.writer";
import { config } from "../../config/config";

async function runReportPipeline(): Promise<void> {
  try {
    const events = await consumeBatch();

    if (events.length === 0) {
      logger.warn("No events in queue — skipping report.");
      return;
    }

    logger.info(`Consumed ${events.length} events from queue.`);
    const report = await generateReport(events);
    const filepath = await saveReport(report);
    logger.info(`Pipeline complete. Report at: ${filepath}`);
  } catch (error) {
    throw error;
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
