// pages/api/discord/guild-roles/[guildId].js
export default async function handler(req, res) {
    const { guildId } = req.query;
    const BOT_TOKEN = process.env.token;
  
    if (!guildId) return res.status(400).json({ error: "Missing guildId" });
    if (!BOT_TOKEN) return res.status(500).json({ error: "Bot token not configured" });
  
    try {
      const discordRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
      });
  
      if (!discordRes.ok) {
        const text = await discordRes.text();
        return res.status(discordRes.status).json({ error: text || "Failed to fetch roles" });
      }
  
      const roles = await discordRes.json();
  
      // Filter roles as needed, e.g. exclude @everyone with id === guildId
      const filteredRoles = roles.filter((role) => role.id !== guildId);
  
      return res.status(200).json({ roles: filteredRoles });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  