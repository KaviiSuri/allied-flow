import type { Config } from "drizzle-kit";
import { env } from "@repo/server-config";

export default {
  schema: "./src/schema.ts",
  out: './src/migrations',
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
  },
  tablesFilter: ["t3turbo_*"],
} satisfies Config;
