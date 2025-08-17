// Import required discord.js classes
const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags
} = require('discord.js');

// Import Mongoose models for giveaways and logs
const Giveaway = require('../../utils/schemas/GiveawayModel');
const Log = require('../../utils/schemas/GiveawayLogConfig');

module.exports = {
  // Define the slash command
  data: new SlashCommandBuilder()
    .setName('reroll') // Command: /reroll
    .setDescription('Select new winner(s) for a completed giveaway.')
    .addStringOption(option =>
      option.setName('message_id') // Giveaway message ID
        .setDescription('Provide the message ID of the giveaway to reroll.')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('winners') // Optional override for number of winners
        .setDescription('Specify a new number of winners (optional).')
        .setRequired(false)),

  async execute(interaction, client) {
    // Permission check embed
    const noPermsEmbed = new EmbedBuilder()
      .setColor('#E74C3C')
      .setTitle('Permission Denied')
      .setDescription('You must have the giveaway role to reroll giveaways.')
      .setFooter({ text: 'Tip: Use /set_giveaway_roles to configure the giveaway role.'})
      .setTimestamp();

    // Ensure user has giveaway role
    if (!(await client.function.giveaway.giveawayRoleFilter.hasGiveawayRole(interaction))) {
      return interaction.reply({ embeds: [noPermsEmbed], flags: MessageFlags.Ephemeral });
    }

    // Extract options
    const messageId = interaction.options.getString('message_id');
    const newWinners = interaction.options.getInteger('winners');

    try {
      // Find the giveaway by message ID
      const giveaway = await Giveaway.findOne({ messageId });

      // Error if not found
      if (!giveaway) {
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle('Giveaway Not Found')
            .setDescription(`No giveaway was found with the message ID: \`${messageId}\`.`)
            .setTimestamp()],
          flags: MessageFlags.Ephemeral
        });
      }

      // Prevent reroll if giveaway is still active
      if (!giveaway.ended) {
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('Giveaway Still Active')
            .setDescription('This giveaway is still ongoing and cannot be rerolled until it has ended.')
            .setTimestamp()],
          flags: MessageFlags.Ephemeral
        });
      }

      // Fetch the channel for the giveaway
      const channel = await interaction.guild.channels.fetch(giveaway.channelId).catch(() => null);
      if (!channel) {
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle('Channel Not Found')
            .setDescription('The channel associated with this giveaway could not be located.')
            .setTimestamp()],
          flags: MessageFlags.Ephemeral
        });
      }

      // Fetch the original giveaway message
      const message = await channel.messages.fetch(messageId).catch(() => null);
      if (!message) {
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle('Message Not Found')
            .setDescription('The giveaway message could not be retrieved.')
            .setTimestamp()],
          flags: MessageFlags.Ephemeral
        });
      }

      // Validate all entries again against requirements
      const validEntries = [];
      const participants = new Set();

      for (const entry of giveaway.entries) {
        try {
          const member = await interaction.guild.members.fetch(entry.userId);
          const isValid = await client.function.giveaway.validator.checkRequirements(giveaway, member);

          if (isValid) {
            participants.add(entry.userId);
            // Push user ID multiple times according to their bonus entries
            validEntries.push(...Array(entry.entries).fill(entry.userId));
          }
        } catch {
          client.logger.debug(`User ${entry.userId} not found during reroll.`);
        }
      }

      // Determine winner count (either override or original)
      const winnerCount = newWinners || giveaway.winners;
      const uniqueEntries = [...new Set(validEntries)];
      const winners = [];

      // Randomly select new winners
      for (let i = 0; i < winnerCount && uniqueEntries.length > 0; i++) {
        const index = Math.floor(Math.random() * uniqueEntries.length);
        winners.push(uniqueEntries[index]);
        uniqueEntries.splice(index, 1);
      }

      // Update the original giveaway embed with reroll info
      const rerollEmbed = EmbedBuilder.from(message.embeds[0])
        .setDescription(
          `**New Winner(s):** ${winners.map(id => `<@${id}>`).join(', ') || 'No valid participants'}\n` +
          `**Total Participants:** ${participants.size}\n` +
          `**Hosted by:** <@${giveaway.hosted}>\n\n` +
          `Rerolled by <@${interaction.user.id}> at <t:${Math.floor(Date.now() / 1000)}:f>`
        );

      await message.edit({ embeds: [rerollEmbed] });

      // If we found winners, announce them
      if (winners.length > 0) {
        const announcementEmbed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle('Giveaway Rerolled')
          .setDescription(
            `**Prize:** ${giveaway.prize}\n` +
            `**New Winner(s):** ${winners.map(id => `<@${id}>`).join(', ')}\n` +
            `**Total Participants:** ${participants.size}\n\n` +
            `🔗 [Jump to Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})`
          )
          .setTimestamp();

        await channel.send({
          content: `Giveaway rerolled! New Winner(s): ${winners.map(id => `<@${id}>`).join(', ')}!`,
          embeds: [announcementEmbed]
        });
      } else {
        // If no valid participants, announce no winners
        const noWinnerEmbed = new EmbedBuilder()
          .setColor('#808080')
          .setTitle('Giveaway Rerolled: No Winners')
          .setDescription(
            `No valid participants were found for this reroll.\n\n` +
            `🔗 [View Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})`
          )
          .setTimestamp();

        await channel.send({ embeds: [noWinnerEmbed] });
      }

      // Log reroll to configured log channel
      const log = await Log.findOne({ guildId: interaction.guild.id });
      if (log?.channels?.giveawayReroll) {
        const logChannel = interaction.guild.channels.cache.get(log.channels.giveawayReroll);
        if (logChannel) {
          const logEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('Giveaway Rerolled')
            .setDescription(`[View Giveaway](https://discord.com/channels/${interaction.guild.id}/${channel.id}/${messageId})`)
            .addFields(
              { name: 'Prize', value: giveaway.prize, inline: true },
              { name: 'New Winner(s)', value: winners.length > 0 ? winners.map(id => `<@${id}>`).join(', ') : 'None', inline: false },
              { name: 'Participants', value: participants.size.toString(), inline: true },
              { name: 'Rerolled By', value: `<@${interaction.user.id}>`, inline: true }
            )
            .setTimestamp();

          await logChannel.send({ embeds: [logEmbed] });
        }
      }

      // Final confirmation to the user
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor('#00CC66')
          .setTitle('Reroll Successful')
          .setDescription(`The giveaway for **${giveaway.prize}** has been successfully rerolled.`)
          .addFields({ name: 'New Winners', value: winners.length.toString(), inline: true })
          .setTimestamp()],
        flags: MessageFlags.Ephemeral
      });

    } catch (error) {
      // Catch unexpected errors
      client.logger.error('Reroll command error:', error);
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor('#E74C3C')
          .setTitle('Unexpected Error')
          .setDescription('An error occurred while rerolling the giveaway. Please try again later.')
          .setTimestamp()],
        flags: MessageFlags.Ephemeral
      });
    }
  }
};