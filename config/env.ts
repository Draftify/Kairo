import { envSchema } from "../schema/config.schema";

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
