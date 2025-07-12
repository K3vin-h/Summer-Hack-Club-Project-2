export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) return res.status(403).json({ error: "Missing access token" });

    const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!guildsRes.ok) {
      const err = await guildsRes.json();
      return res.status(guildsRes.status).json({ error: err.message || "Failed to fetch guilds" });
    }

    const guilds = await guildsRes.json();

    const filteredGuilds = guilds.filter((guild) => {
      const perms = parseInt(guild.permissions, 10);
      return (perms & 0x20) === 0x20;
    });

    return res.status(200).json(filteredGuilds);
  } catch (err) {
    console.error("Guild fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
