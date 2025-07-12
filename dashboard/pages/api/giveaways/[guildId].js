import dbConnect from "../../../lib/mongoose";
import Giveaway from "../../../models/giveawayModel";
import { getSession } from "next-auth/react";
export default async function handler(req, res) {
 const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { method, query } = req;
  const { guildId } = query;

  if (method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!guildId) {
    return res.status(400).json({ error: "Missing guildId query parameter" });
  }

  try {
    await dbConnect();


    const giveaways = await Giveaway.find({ guildId, ended: false }).lean();

    return res.status(200).json(giveaways);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database error" });
  }
}