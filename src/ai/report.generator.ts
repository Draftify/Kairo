import { createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage } from "@langchain/core/messages";
import { config } from "../../config/config";
import { logger } from "../../config/logger";
import {
  REPORT_SYSTEM_PROMPT,
  REPORT_USER_PROMPT,
} from "../../prompts/prompts";
import { extractReport } from "../../util/extract.report";

const model = new ChatOpenAI({
  apiKey: config.ai.apiKey,
  model: config.ai.model,
  temperature: 0.3,
});

const agent = createAgent({
  model,
  systemPrompt: REPORT_SYSTEM_PROMPT,
});

export async function generateReport(events: unknown[]): Promise<string> {
  logger.info(`Generating AI report for ${events.length} events...`);
  const result = await agent.invoke({
    messages: [{ role: "user", content: REPORT_USER_PROMPT(events) }],
  });
  return extractReport(result.messages as BaseMessage[]);
}
