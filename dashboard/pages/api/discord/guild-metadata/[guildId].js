// pages/api/discord/guild-metadata/[guildId].js
export default async function handler(req, res) {
    const { guildId } = req.query;
  
    if (!guildId) {
      return res.status(400).json({ error: "Missing guildId" });
    }
  
    const BOT_TOKEN = process.env.token;
    if (!BOT_TOKEN) {
      return res.status(500).json({ error: "Bot token not configured" });
    }
  
    try {
      const discordRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      });
  
      if (!discordRes.ok) {
        const errText = await discordRes.text();
        return res.status(discordRes.status).json({ error: errText || "Failed to fetch channels" });
      }
  
      const channels = await discordRes.json();
  
      // Optionally filter only text channels (type === 0)
      const textChannels = channels.filter((ch) => ch.type === 0);
  
      res.status(200).json({ channels: textChannels });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  