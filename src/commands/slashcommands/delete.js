// Import necessary discord.js classes
const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

// Import Mongoose schemas for giveaways and log channel configuration
const GiveawayModel = require('../../utils/schemas/GiveawayModel');
const GiveawayLogConfig = require('../../utils/schemas/GiveawayLogConfig');

module.exports = {
    // Define the slash command structure
    data: new SlashCommandBuilder()
        .setName('delete') // Command name: /delete
        .setDescription('Permanently remove an existing giveaway from the server.') // Command description
        .addStringOption(option =>
            option.setName('giveaway_id') // Input: giveaway message ID
                .setDescription('Provide the message ID of the giveaway to be deleted.')
                .setRequired(true)
        ),

    // Execution logic for the command
    async execute(interaction, client) {
        // Get the giveaway ID entered by the user
        const giveawayId = interaction.options.getString('giveaway_id');

        // Permission check: user must have the configured manager role
        if (!(await client.function.giveaway.giveawayRoleFilter.hasManagerRole(interaction))) {
            // Error embed for insufficient permissions
            const nopermissionEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setDescription('You lack the required permissions to delete giveaways. The giveaway manager role is mandatory.')
                .setFooter({ text: 'Tip: Use /set_giveaway_roles to configure the manager role.' })
                .setTimestamp();
            return interaction.reply({ embeds: [nopermissionEmbed], flags: MessageFlags.Ephemeral });
        }

        // Find the giveaway in the database using messageId + guildId
        const giveaway = await GiveawayModel.findOne({ messageId: giveawayId, guildId: interaction.guild.id });
        if (!giveaway) {
            // If not found, inform the user
            const notFoundEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setDescription('No giveaway could be found with the provided message ID. Please verify the ID and try again.')
                .setTimestamp();
            return interaction.reply({ embeds: [notFoundEmbed], flags: MessageFlags.Ephemeral });
        }

        try {
            // Attempt to fetch the channel and giveaway message
            const channel = await interaction.guild.channels.fetch(giveaway.channelId).catch(() => null);
            const message = await channel?.messages.fetch(giveaway.messageId).catch(() => null);
            
            // If the message still exists, delete it
            if (message) {
                await message.delete();
            }

            // Confirmation embed to notify the user that the giveaway was deleted
            const successEmbed = new EmbedBuilder()
                .setColor('#00CC66')
                .setTitle('Giveaway Successfully Deleted')
                .setDescription(`The giveaway for **${giveaway.prize}** has been permanently removed.`)
                .setTimestamp();

            // Check if a giveaway log channel has been configured
            const giveawayLogChannel = await GiveawayLogConfig.findOne({ guildId: interaction.guild.id });
            if (giveawayLogChannel?.channels?.giveawayDelete) {
                // Try to fetch the log channel
                const logChannel = await interaction.guild.channels.fetch(giveawayLogChannel.channels.giveawayDelete).catch(() => null);
                if (logChannel) {
                    // Create a detailed log embed about the deleted giveaway
                    const logEmbed = new EmbedBuilder()
                        .setColor('#FFA500')
                        .setTitle('Giveaway Deleted')
                        .setDescription('A giveaway embed has been removed from the server.')
                        .addFields(
                            { name: 'Deleted By', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                            { name: 'Giveaway ID', value: giveawayId, inline: true },
                            { name: 'Prize', value: giveaway.prize || 'No prize specified', inline: true },
                            { name: 'Original Channel', value: `<#${giveaway.channelId}>`, inline: true },
                            { name: 'Number of Winners', value: giveaway.winners.toString(), inline: true },
                            { name: 'Scheduled End Time', value: giveaway.endTime ? new Date(giveaway.endTime).toLocaleString('en-US', { timeZone: 'UTC' }) : 'N/A', inline: true }
                        )
                        .setTimestamp();
                    // Send the log embed to the configured channel
                    await logChannel.send({ embeds: [logEmbed] });
                }
            }

            // Finally, remove the giveaway entry from the database
            await GiveawayModel.deleteOne({ messageId: giveawayId, guildId: interaction.guild.id });

            // Reply to the user confirming deletion
            return interaction.reply({ embeds: [successEmbed], flags: MessageFlags.Ephemeral });

        } catch (err) {
            // Log the error and inform the user
            client.logger.error(`Error deleting giveaway: ${err}`);
            const errorEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setDescription('An unexpected error occurred while attempting to delete the giveaway. Please try again later.')
                .setTimestamp();
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
    }
};
