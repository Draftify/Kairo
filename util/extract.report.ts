import { AIMessage, type BaseMessage } from "langchain";

export function extractReport(messages: BaseMessage[]): string {
  const last = messages.findLast((m) => m instanceof AIMessage);
  if (!last) return "No report generated.";
  if (typeof last.content === "string") return last.content;
  return (last.content as Array<{ text?: string }>)
    .map((c) => c.text ?? "")
    .join("");
}
