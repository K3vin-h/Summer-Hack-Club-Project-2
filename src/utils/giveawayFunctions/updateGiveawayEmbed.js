const { EmbedBuilder } = require("discord.js");

function updateGiveawayEmbed(giveaway, client) {
  return (async () => {
    try {
      const guild = await client.guilds.fetch(giveaway.guildId);
      const channel = await guild.channels.fetch(giveaway.channelId);
      const message = await channel.messages.fetch(giveaway.messageId);

      const embed = new EmbedBuilder()
        .setTitle(giveaway.prize || "🎉 Giveaway")
        .setColor(0x5865f2)
        .setDescription(buildDescription(giveaway))
        .setTimestamp();

      await message.edit({ embeds: [embed] });
    } catch (error) {
      client.logger.error("Failed to update giveaway embed:", error);
    }
  })();
}

function buildDescription(giveaway) {
  const desc = [
    `**Winner(s):** ${giveaway.winners}`,
    `**Ends in:** <t:${Math.floor(new Date(giveaway.endTime).getTime() / 1000)}:R>`,
    `**Total Participants:** ${giveaway.entries?.length || 0}`,
    `**Hosted by:** <@${giveaway.hosted}>`,
    ""
  ];

  if (giveaway.requiredRoleId)
    desc.push(`**Required Role:** <@&${giveaway.requiredRoleId}>`);
  if (giveaway.requiredJoinServerId)
    desc.push(`**Must Join Server:** \`${giveaway.requiredJoinServerId}\``);
  if (giveaway.bonusEntries?.length)
    desc.push(`**Bonus Entries:**\n${giveaway.bonusEntries.map(e => `<@&${e.roleId}>: **${e.entries}**`).join("\n")}`);
  if (giveaway.bypassRoles?.length)
    desc.push(`**Bypass Roles:**\n${giveaway.bypassRoles.map(id => `<@&${id}>`).join("\n")}`);

  return desc.join("\n");
 
}

module.exports = updateGiveawayEmbed;
