import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

const turso = createClient({
  url: "file:local.db",
});

export const db = drizzle(turso, {
  schema,
});
