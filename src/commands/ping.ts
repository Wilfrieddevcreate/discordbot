import { SlashCommandBuilder } from "discord.js";
import type { Command } from "./types.js";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Vérifie que le bot est en ligne et affiche sa latence"),

  async execute(interaction) {
    const sent = await interaction.reply({
      content: "🏓 Pong...",
      withResponse: true,
    });

    const roundTrip =
      sent.resource!.message!.createdTimestamp - interaction.createdTimestamp;
    const api = Math.round(interaction.client.ws.ping);

    await interaction.editReply(
      `🏓 Pong !\n📡 Latence bot : **${roundTrip} ms**\n🌐 Latence API Discord : **${api} ms**`
    );
  },
};
