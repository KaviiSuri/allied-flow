/* eslint-disable no-restricted-properties */
import { z } from "zod";

// Define the Zod schema for the environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.number().default(5000),
  // Add more environment variables as needed
});

// Parse and validate the environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
