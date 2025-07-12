import giveawayModel from "@/models/giveawayModel";
import connect from "../../../lib/mongoose";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method not allowed" });

  await connect();

  const { sessionUserId, sessionUserName, messageId, guildId } =
    req.body;

  if (!messageId || !guildId)
    return res.status(400).json({ error: "Missing messageId or guildId" });

  try {
    const giveaway = await giveawayModel.findOne(
      { messageId, guildId }
    ).lean();

    if (!giveaway) return res.status(404).json({ error: "Giveaway not found" });

    const baseUrl = process.env.NEXT_PUBLIC_BOT_API_BASE_URL;
    const botApiUrl = `${baseUrl}/api/giveaway/delete-embed?guildId=${guildId}&messageId=${messageId}&userId=${sessionUserId}&userName=${encodeURIComponent(
      sessionUserName
    )}`;

    const embedRes = await fetch(botApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_SECRET}`,
      },
    });

    const embedData = await embedRes.json();

    if (!embedRes.ok || !embedData.success) {
      console.error("Failed to delete giveaway embed:", embedData.error);
      return res.status(200).json({
        giveaway,
        warning: "deleted in DB, but failed to delete Discord embed.",
        embedError: embedData.error,
      });
    }

    return res.status(200).json({
      giveaway,
      message: "Giveaway deleted and embed refreshed successfully.",
    });
  } catch (err) {
    console.error("Error updating giveaway:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
