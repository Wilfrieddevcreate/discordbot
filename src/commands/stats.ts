import {
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { getGuildStats } from "../services/stats.service.js";
import type { Command } from "./types.js";

export const stats: Command = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Affiche les statistiques de la communauté")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts(0), // serveur uniquement

  async execute(interaction) {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply({
        content: "Cette commande fonctionne uniquement dans un serveur.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const s = getGuildStats(guild.id);
    const net = s.joins7d - s.leaves7d;
    const sign = net > 0 ? "+" : "";

    const embed = new EmbedBuilder()
      .setTitle(`📊 Statistiques de ${guild.name}`)
      .setColor(0x5865f2)
      .addFields(
        { name: "👥 Membres", value: `${guild.memberCount}`, inline: true },
        {
          name: "📈 Croissance (7 j)",
          value: `${sign}${net}`,
          inline: true,
        },
        { name: "​", value: "​", inline: true },
        {
          name: "📥 Arrivées",
          value: `24 h : **${s.joins24h}**\n7 j : **${s.joins7d}**\n30 j : **${s.joins30d}**`,
          inline: true,
        },
        {
          name: "📤 Départs",
          value: `24 h : **${s.leaves24h}**\n7 j : **${s.leaves7d}**\n30 j : **${s.leaves30d}**`,
          inline: true,
        },
        {
          name: "💬 Membres actifs",
          value: `24 h : **${s.active24h}**\n7 j : **${s.active7d}**\n30 j : **${s.active30d}**`,
          inline: true,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
