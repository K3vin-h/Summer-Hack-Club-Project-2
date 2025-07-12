const GiveawayModel = require("../utils/schemas/GiveawayModel");
const updateGiveawayEmbed = require("../utils/giveawayFunctions/updateGiveawayEmbed");
const authenticate = require("../utils/middleware/authenticate");
const logEmbed = require("../utils/functions/logEmbed");

module.exports = (app, client) => {
  app.get("/api/giveaway/update-embed", authenticate, async (req, res) => {
    try {
      const { guildId, messageId, userId, userName } = req.query;

      if (!guildId || !messageId) {
        return res.status(400).json({
          success: false,
          error: "guildId and messageId are required",
        });
      }

      const giveaway = await GiveawayModel.findOne({ guildId, messageId });
      if (!giveaway) {
        return res
          .status(404)
          .json({ success: false, error: "Giveaway not found" });
      }

      await updateGiveawayEmbed(giveaway, client);

      await logEmbed(
        "Giveaway Embed Updated",
        `The giveaway embed has been updated. | [View Giveaway](https://discord.com/channels/${guildId}/${giveaway.channelId}/${messageId})`,
        [
          {
            name: "Updated by",
            value: `${userName} (${userId})`,
            inline: true,
          },
          {
            name: "Prize",
            value: giveaway.prize || "No prize specified",
            inline: true,
          },
          {
            name: "Winners",
            value: giveaway.winners.toString(),
            inline: true,
          },

          {
            name: "Duration",
            value: giveaway.endTime
              ? new Date(giveaway.endTime).toLocaleString("en-US", {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                }) + " UTC"
              : "No end time set",
            inline: true,
          },
        ],
        giveaway,
        client
      );

      client.logger.info(
        `[GIVEAWAY] Embed updated for message ${messageId} in guild ${guildId}`
      );

      return res.json({ success: true, message: "Embed updated." });
    } catch (error) {
      client.logger.error("Failed to update giveaway embed:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });
};
