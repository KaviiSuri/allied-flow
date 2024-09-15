import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@repo/server-config";

import * as schema from "./schema.js";

export const turso = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_TOKEN,
});

export const db = drizzle(turso, {
  schema,
  logger: true,
});

export type TransactionType = Parameters<
  Parameters<(typeof db)["transaction"]>[0]
>[0];

console.log(env.DATABASE_URL, env.DATABASE_TOKEN);
