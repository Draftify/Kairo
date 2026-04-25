import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { logger } from "../../config/logger";

export async function saveReport(report: string): Promise<string> {
  try {
    const dir = "./reports";
    await mkdir(dir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filepath = join(dir, `report-${timestamp}.md`);
    await writeFile(filepath, report, "utf-8");
    logger.info(`Report saved to ${filepath}`);
    return filepath;
  } catch (error) {
    throw new Error(
      `Failed to save report: ${error instanceof Error ? error.message : error}`,
    );
  }
}
