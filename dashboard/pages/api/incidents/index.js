import dbConnect from "@/lib/mongoose";
import Incident from "../../../models/incident";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const incidents = await Incident.find().sort({ date: -1 });
      res.status(200).json(incidents);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch incidents." });
    }
  } else if (req.method === "POST") {
    const { description, severity } = req.body;
    try {
      const incident = await Incident.create({ description, severity });
      res.status(201).json(incident);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}