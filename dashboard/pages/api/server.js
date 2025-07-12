import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const accessToken = session.user.accessToken;

  const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!guildsRes.ok) return res.status(500).json({ error: "Failed to fetch guilds" });

  const guilds = await guildsRes.json();

  // Filter guilds with MANAGE_GUILD permission (0x20)
  const filteredGuilds = guilds.filter((guild) => {
    const perms = parseInt(guild.permissions, 10);
    return (perms & 0x20) === 0x20;
  });

  res.status(200).json(filteredGuilds);
}