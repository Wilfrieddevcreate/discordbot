
import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { registerWelcomeEvent } from "./events/welcome.js";
import "./database/stats.database.js";
import { registerMemberStatsEvents } from "./events/memberActivity.js";
import { registerInteractionEvent } from "./events/interactionCreate.js";
const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error("DISCORD_TOKEN est manquant dans le fichier .env");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once("clientReady", (readyClient) => {
  console.log(`Bot connecté : ${readyClient.user.tag}`);
});

registerWelcomeEvent(client);
registerMemberStatsEvents(client);
registerInteractionEvent(client);

client.login(token);
