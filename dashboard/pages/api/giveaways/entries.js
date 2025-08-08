import connect from "../../../lib/mongoose";
import Giveaway from "@/models/giveawayModel";
import { getSession } from "next-auth/react";
export default async function handler(req, res) {
  // const session = await getSession({ req });
  // if (!session) {
  //     return res.status(401).json({ error: "Unauthorized" });
  // }
  try {
    await connect();
  } catch (connErr) {
    console.error("MongoDB connection error:", connErr);
    return res.status(500).json({ error: "Database connection error" });
  }

  const { messageId, userId } = req.query;

  if (!messageId) {
    return res
      .status(400)
      .json({ error: "messageId query parameter is required" });
  }

  try {
    const giveaway = await Giveaway.findOne({ messageId }).lean();

    if (!giveaway) {
      return res.status(404).json({ error: "Giveaway not found" });
    }

    let entries = giveaway.entries || [];

    if (userId) {
      entries = entries.filter((entry) => entry.userId === userId);
    }
    const entriesCount = entries.reduce((acc, entry) => {
      const id = entry.userId;
      acc[id] = (acc[id] || 0) + entry.entries;
      return acc;
    }, {});

    const result = Object.entries(entriesCount).map(([userId, count]) => ({
      userId,
      entries: count,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch entries:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
