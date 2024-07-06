import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@repo/server-config";

import * as schema from "./schema.js";

console.log('env', env)

export const turso = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_TOKEN,
});

export const db = drizzle(turso, {
  schema,
  logger: true,
});

console.log(env.DATABASE_URL, env.DATABASE_TOKEN);
