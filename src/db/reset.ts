/* Drops and recreates the database schema. Development only. */
import { Pool } from "pg";

async function main() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    throw new Error("Refusing to reset a production database.");
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query(
    "DROP SCHEMA IF EXISTS public CASCADE; DROP SCHEMA IF EXISTS drizzle CASCADE; CREATE SCHEMA public;",
  );
  await pool.end();
  console.log("Database reset.");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
