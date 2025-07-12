function deleteGiveawayEmbed(giveaway, client) {
  return (async () => {
    try {
      const guild = await client.guilds.fetch(giveaway.guildId);
      const channel = await guild.channels.fetch(giveaway.channelId);
      const message = await channel.messages.fetch(giveaway.messageId);
      if (message) {
        await message.delete();
      }
    } catch (error) {
      client.logger.error("Failed to delete giveaway embed:", error);
    }
  })();
}

module.exports = deleteGiveawayEmbed;
