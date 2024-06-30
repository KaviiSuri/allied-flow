import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema.js";

const turso = createClient({
  // eslint-disable-next-line no-restricted-properties, @typescript-eslint/no-non-null-assertion
  url: process.env.DATABASE_URL!,
  // eslint-disable-next-line no-restricted-properties
  authToken: process.env.DATABASE_TOKEN,
});

export const db = drizzle(turso, {
  schema,
  logger: true,
});
