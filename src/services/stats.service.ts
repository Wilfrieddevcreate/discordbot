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