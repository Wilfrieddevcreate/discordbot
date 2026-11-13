
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

// Création du dossier de stockage
const dataDirectory = join(process.cwd(), "data");
mkdirSync(dataDirectory, { recursive: true });

// Connexion à SQLite
const db: Database.Database = new Database(
  join(dataDirectory, "stats.sqlite")
);
// Optimisation des performances
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Création des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS member_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK(event_type IN ('join', 'leave')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS member_activity (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    last_active_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (guild_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS daily_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    snapshot_date TEXT NOT NULL,
    member_count INTEGER NOT NULL,
    joins INTEGER NOT NULL DEFAULT 0,
    leaves INTEGER NOT NULL DEFAULT 0,
    active_members INTEGER NOT NULL DEFAULT 0,
    UNIQUE (guild_id, snapshot_date)
  );

  CREATE INDEX IF NOT EXISTS idx_member_events_guild_date
  ON member_events (guild_id, created_at);

  CREATE INDEX IF NOT EXISTS idx_member_activity_guild_date
  ON member_activity (guild_id, last_active_at);
`);

console.log("Base de données statistiques initialisée.");

export default db;
