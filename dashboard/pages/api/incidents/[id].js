import dbConnect from "@/lib/mongoose";
import Incident from "../../../models/incident";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const incident = await Incident.findByIdAndUpdate(
        id,
        { resolved: true, resolvedAt: new Date() },
        { new: true }
      );
      if (!incident) return res.status(404).json({ error: "Incident not found" });
      return res.status(200).json(incident);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.status(405).end();
}
