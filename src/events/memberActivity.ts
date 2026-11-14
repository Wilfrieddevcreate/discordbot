import { Events, type Client } from "discord.js";
import {
  recordMemberEvent,
  recordMemberActivity,
} from "../services/stats.service.js";

export function registerMemberStatsEvents(client: Client) {
  // Nouvelle arrivée
  client.on(Events.GuildMemberAdd, (member) => {
    recordMemberEvent(member.guild.id, member.id, "join");

    console.log(`Nouvelle arrivée : ${member.user.tag}`);
  });

  // Départ d'un membre
  client.on(Events.GuildMemberRemove, (member) => {
    recordMemberEvent(member.guild.id, member.id, "leave");

    console.log(`Départ : ${member.user.tag}`);
  });

  // Activité des membres
  client.on(Events.MessageCreate, (message) => {
    if (!message.guild || message.author.bot) return;

    recordMemberActivity(message.guild.id, message.author.id);
  });
}