import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import Giveaway from "@/models/giveawayModel";


export default async function handler(req, res) {
  const token = await getToken({ req });

  if (!token) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    await dbConnect();
    const giveaways = await Giveaway.find({ ended: false }).lean();
    return res.status(200).json({ giveaways });
  } catch (err) {
    console.error("Error fetching giveaways:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}