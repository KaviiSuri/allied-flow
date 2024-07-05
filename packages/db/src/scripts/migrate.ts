import { migrate } from "drizzle-orm/libsql/migrator";
import { db, turso } from "../client.js";
import * as path from "path";

async function migrateDatabase() {
  await migrate(db, {
    migrationsFolder: path.join(__dirname, "migrations"),
  });
  turso.close();
}

migrateDatabase().catch(console.error);
