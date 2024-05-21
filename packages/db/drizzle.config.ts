import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

export default {
  schema: "./src/schema.ts",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_TOKEN,
  },
  tablesFilter: ["t3turbo_*"],
} satisfies Config;
