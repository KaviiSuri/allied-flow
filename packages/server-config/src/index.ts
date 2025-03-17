import { dotenvLoad } from "dotenv-mono";
import { z } from "zod";

dotenvLoad();

// Define the Zod schema for the environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  LOGTO_ENDPOINT: z.string(),
  LOGTO_AUDIENCE: z.string(),
  LOGTO_ADMIN_APP_SECRET: z.string(),
  LOGTO_ADMIN_APP_ID: z.string(),
  LOGTO_TENANT_ID: z.string(),
  DATABASE_URL: z.string(),
  DATABASE_TOKEN: z.string().optional(),
  EXPO_ACCESS_TOKEN: z.string(),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  WHATSAPP_API_KEY: z.string(),
  WHATSAPP_BUSINESS_ACCOUNT_ID: z.string(),
  WHATSAPP_PHONE_NUMBER_ID: z.string(),
  WHATSAPP_WEBHOOK_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_FROM_EMAIL: z.string(),
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_BUCKET: z.string(),
});

// Parse and validate the environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
