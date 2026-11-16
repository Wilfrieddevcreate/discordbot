import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} est manquant dans le fichier .env`);
  }
  return value;
}

export const config = {
  token: () => required("DISCORD_TOKEN"),
  clientId: () => required("CLIENT_ID"),
  // Optionnel : si défini, les commandes sont déployées instantanément sur ce serveur
  guildId: process.env.GUILD_ID || undefined,
};
