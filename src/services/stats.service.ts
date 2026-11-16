import db from "../database/stats.database.js";

export type MemberEventType = "join" | "leave";

// Enregistrer une arrivée ou un départ
export function recordMemberEvent(
  guildId: string,
  userId: string,
  eventType: MemberEventType
): void {
  const statement = db.prepare(`
    INSERT INTO member_events (guild_id, user_id, event_type)
    VALUES (?, ?, ?)
  `);

  statement.run(guildId, userId, eventType);
}

// Enregistrer l'activité d'un membre
export function recordMemberActivity(
  guildId: string,
  userId: string
): void {
  const statement = db.prepare(`
    INSERT INTO member_activity (guild_id, user_id, last_active_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(guild_id, user_id)
    DO UPDATE SET last_active_at = CURRENT_TIMESTAMP
  `);

  statement.run(guildId, userId);
}

export interface GuildStats {
  joins24h: number;
  joins7d: number;
  joins30d: number;
  leaves24h: number;
  leaves7d: number;
  leaves30d: number;
  active24h: number;
  active7d: number;
  active30d: number;
}

// Statistiques agrégées d'un serveur (dates SQLite en UTC)
export function getGuildStats(guildId: string): GuildStats {
  const count = (type: MemberEventType, days: number): number =>
    (
      db
        .prepare(
          `SELECT COUNT(*) AS n FROM member_events
           WHERE guild_id = ? AND event_type = ?
           AND created_at >= datetime('now', ?)`
        )
        .get(guildId, type, `-${days} days`) as { n: number }
    ).n;

  const active = (days: number): number =>
    (
      db
        .prepare(
          `SELECT COUNT(*) AS n FROM member_activity
           WHERE guild_id = ? AND last_active_at >= datetime('now', ?)`
        )
        .get(guildId, `-${days} days`) as { n: number }
    ).n;

  return {
    joins24h: count("join", 1),
    joins7d: count("join", 7),
    joins30d: count("join", 30),
    leaves24h: count("leave", 1),
    leaves7d: count("leave", 7),
    leaves30d: count("leave", 30),
    active24h: active(1),
    active7d: active(7),
    active30d: active(30),
  };
}
