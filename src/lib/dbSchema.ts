import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

import { getPool } from "@/lib/db";

type SchemaGlobal = { ready?: Promise<void> };

function getSchemaGlobal(): SchemaGlobal {
  const g = globalThis as unknown as { __MICTLAN_DB_SCHEMA__?: SchemaGlobal };
  if (!g.__MICTLAN_DB_SCHEMA__) g.__MICTLAN_DB_SCHEMA__ = {};
  return g.__MICTLAN_DB_SCHEMA__;
}

export async function ensureDbSchema() {
  const global = getSchemaGlobal();
  if (global.ready) return global.ready;
  global.ready = (async () => {
    const pool = getPool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id text PRIMARY KEY,
          email text NOT NULL UNIQUE,
          password_hash text NOT NULL,
          role text NOT NULL DEFAULT 'admin',
          created_at timestamptz NOT NULL DEFAULT now()
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_sessions (
          id text PRIMARY KEY,
          user_id text NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
          token_hash text NOT NULL UNIQUE,
          expires_at timestamptz NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS public_meta (
          id text PRIMARY KEY,
          updated_at timestamptz NOT NULL,
          active_tournament_id text,
          active_scrim_id text
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS tournaments (
          id text PRIMARY KEY,
          name text NOT NULL,
          season text,
          status text NOT NULL,
          starts_at timestamptz
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS tournament_standings (
          tournament_id text NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
          pos int NOT NULL,
          team text NOT NULL,
          players text,
          played int,
          wins int,
          losses int,
          points int,
          kills int,
          PRIMARY KEY (tournament_id, pos)
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS scrims (
          id text PRIMARY KEY,
          name text NOT NULL,
          status text NOT NULL,
          starts_at timestamptz
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS scrim_standings (
          scrim_id text NOT NULL REFERENCES scrims(id) ON DELETE CASCADE,
          pos int NOT NULL,
          team text NOT NULL,
          players text,
          played int,
          points int,
          kills int,
          PRIMARY KEY (scrim_id, pos)
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS player_kills (
          pos int PRIMARY KEY,
          player text NOT NULL,
          team text,
          kills int NOT NULL,
          matches int
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS team_rankings (
          pos int PRIMARY KEY,
          team text NOT NULL,
          players text,
          points int,
          kills int,
          matches int
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS upcoming_scrims (
          id text PRIMARY KEY,
          title text NOT NULL,
          subtitle text,
          starts_at timestamptz NOT NULL
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS upcoming_tournaments (
          id text PRIMARY KEY,
          title text NOT NULL,
          subtitle text,
          starts_at timestamptz NOT NULL
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS upcoming_versus (
          id text PRIMARY KEY,
          team_a text NOT NULL,
          team_b text NOT NULL,
          starts_at timestamptz
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS official_clans (
          id text PRIMARY KEY,
          name text NOT NULL
        );
      `);

      const meta = await client.query<{ id: string }>("SELECT id FROM public_meta WHERE id = 'main'");
      if (!meta.rowCount) {
        await client.query("INSERT INTO public_meta (id, updated_at) VALUES ('main', now())");
      }

      const adminCount = await client.query<{ count: string }>("SELECT COUNT(*)::text as count FROM admin_users");
      const count = Number(adminCount.rows[0]?.count ?? "0");
      if (count === 0) {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (email && password) {
          const hash = await bcrypt.hash(password, 12);
          await client.query(
            "INSERT INTO admin_users (id, email, password_hash, role) VALUES ($1, $2, $3, 'admin')",
            [randomUUID(), email.toLowerCase(), hash],
          );
        }
      }

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  })();

  return global.ready;
}

