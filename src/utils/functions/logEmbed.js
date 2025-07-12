const GiveawayLogConfig = require("../schemas/GiveawayLogConfig");
const { EmbedBuilder } = require("discord.js");

async function logEmbed(title, description,fields = [], giveaway, client) {
    const config = await GiveawayLogConfig.findOne({ guildId: giveaway.guildId });
    if (config && config.channels.giveawayConfig) {
        const logEmbed = new EmbedBuilder()
           .setColor('#FFA500')
           .setTitle(title)
           .setDescription(description)
           .setTimestamp();

        if (fields.length > 0) {
          logEmbed.addFields(fields);
        }

        const logChannel = client.channels.cache.get(config.channels.giveawayConfig);
        if (logChannel) {
            logChannel.send({ embeds: [logEmbed] });
        } else {
            console.error("Log channel not found");
        }
    }
}

module.exports = logEmbed;
