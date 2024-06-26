import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@repo/server-config";

import * as schema from "./schema.js";

const turso = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_TOKEN,
});

export const db = drizzle(turso, {
  schema,
});
