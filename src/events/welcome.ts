
import { Events, type Client } from "discord.js";

export function registerWelcomeEvent(client: Client) {
  client.on(Events.GuildMemberAdd, async (member) => {
    try {
      await member.send({
        content: `👋 **Bienvenue sur WebDev Community !**

Salut ${member.user.username} ! 🎉

Nous sommes ravis de t'accueillir dans notre communauté de passionnés du développement web et mobile.

**Pour bien commencer :**
📌 Présente-toi aux autres membres.
💻 Partage tes projets et tes expériences.
💬 Participe aux discussions.
🤝 Échange avec les autres développeurs.

N'hésite pas à poser tes questions. Ici, on apprend et on évolue ensemble !

🚀 **Bon séjour parmi nous !**`,
      });

      console.log(`Message privé envoyé à ${member.user.tag}`);
    } catch (error) {
      console.error(
        `Impossible d'envoyer un message privé à ${member.user.tag}`,
        error
      );
    }
  });
}
