import giveawayModel from "@/models/giveawayModel";
import connect from "../../../lib/mongoose";

export default async function handler(req, res) {
  if (req.method !== "PUT")
    return res.status(405).json({ error: "Method not allowed" });

  await connect();

  const { sessionUserId, sessionUserName, messageId, guildId, ...updateData } =
    req.body;

  if (!messageId || !guildId)
    return res.status(400).json({ error: "Missing messageId or guildId" });

  try {
    const giveaway = await giveawayModel
      .findOneAndUpdate({ messageId }, updateData, { new: true })
      .lean();

    if (!giveaway) return res.status(404).json({ error: "Giveaway not found" });

    const baseUrl = process.env.NEXT_PUBLIC_BOT_API_BASE_URL;
    const botApiUrl = `${baseUrl}/api/giveaway/update-embed?guildId=${guildId}&messageId=${messageId}&userId=${sessionUserId}&userName=${encodeURIComponent(
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
      console.error("Failed to update giveaway embed:", embedData.error);
      return res.status(200).json({
        giveaway,
        warning: "Updated in DB, but failed to update Discord embed.",
        embedError: embedData.error,
      });
    }

    return res.status(200).json({
      giveaway,
      message: "Giveaway updated and embed refreshed successfully.",
    });
  } catch (err) {
    console.error("Error updating giveaway:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
