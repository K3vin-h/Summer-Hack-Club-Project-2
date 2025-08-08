import dbConnect from "../../../lib/mongoose";
import GiveawayLogConfig from "@/models/giveawayLogConfig";

export default async function handler(req, res) {
  const { guildId } = req.query;

  if (!guildId) return res.status(400).json({ error: "Missing guildId" });

  await dbConnect();

  if (req.method === "PUT") {
    try {
      const { channels, giveawayRole, giveawayManager } = req.body;
      const updatedConfig = await GiveawayLogConfig.findOneAndUpdate(
        { guildId },
        { channels, giveawayRole, giveawayManager },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      return res.status(200).json(updatedConfig);
    } catch (err) {
      console.error("PUT /log-config error:", err);
      return res.status(500).json({ error: "Failed to save log config" });
    }
  } else if (req.method === "GET") {
    try {
      const config = await GiveawayLogConfig.findOne({ guildId }).lean();
      return res.status(200).json(config);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch log config" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}