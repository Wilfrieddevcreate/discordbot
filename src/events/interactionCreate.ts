import { Events, MessageFlags, type Client } from "discord.js";
import { commands } from "../commands/index.js";

export function registerInteractionEvent(client: Client) {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Erreur dans /${interaction.commandName}`, error);

      const payload = {
        content: "❌ Une erreur est survenue pendant l'exécution de la commande.",
        flags: MessageFlags.Ephemeral,
      } as const;

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(payload).catch(() => {});
      } else {
        await interaction.reply(payload).catch(() => {});
      }
    }
  });
}
