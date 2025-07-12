const GiveawayModel = require("../utils/schemas/GiveawayModel");
const deleteGiveawayEmbed = require("../utils/giveawayFunctions/deleteGiveawayEmbed");
const authenticate = require("../utils/middleware/authenticate");
const logEmbed = require("../utils/functions/logEmbed");

module.exports = (app, client) => {
    app.get("/api/giveaway/delete-embed", authenticate, async (req, res) => {
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

            await deleteGiveawayEmbed(giveaway, client);

            await logEmbed(
                "Giveaway Embed Deleted",
                `The giveaway embed has been deleted.`,
                [
                    {
                        name: "Deleted by",
                        value: `${userName} (${userId})`,
                        inline: true,
                    },
                    {
                        name: "Giveaway ID",
                        value: messageId,
                        inline: true,
                    },
                    {
                        name: "Prize",
                        value: giveaway.prize || "No prize specified",
                        inline: true,
                    },
                    {
                        name: "Original Channel",
                        value: `<#${giveaway.channelId}>`,
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
            await GiveawayModel.deleteOne({ guildId, messageId });
            client.logger.info(
                `[GIVEAWAY] Embed deleted for message ${messageId} in guild ${guildId}`
            );

            return res.json({ success: true, message: "Embed deleted." });
        } catch (error) {
            client.logger.error("Failed to delete giveaway embed:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
    });
};
