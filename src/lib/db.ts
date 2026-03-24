import { Pool } from "pg";

type DbGlobal = { pool: Pool };

function getDbGlobal(): DbGlobal {
  const g = globalThis as unknown as { __MICTLAN_DB__?: DbGlobal };
  if (!g.__MICTLAN_DB__) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("missing_database_url");
    }
    g.__MICTLAN_DB__ = {
      pool: new Pool({ connectionString, max: 5 }),
    };
  }
  return g.__MICTLAN_DB__;
}

export function getPool() {
  return getDbGlobal().pool;
}

