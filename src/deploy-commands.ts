import { REST, Routes } from "discord.js";
import { commands } from "./commands/index.js";
import { config } from "./utils/config.js";

const body = [...commands.values()].map((command) => command.data.toJSON());
const rest = new REST().setToken(config.token());

const route = config.guildId
  ? Routes.applicationGuildCommands(config.clientId(), config.guildId)
  : Routes.applicationCommands(config.clientId());

await rest.put(route, { body });

console.log(
  `${body.length} commande(s) déployée(s) ${
    config.guildId ? `sur le serveur ${config.guildId}` : "globalement"
  }.`
);
