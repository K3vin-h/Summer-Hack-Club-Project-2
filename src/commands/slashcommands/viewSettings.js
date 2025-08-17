//import required discord.js classes
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
//import mongoose model (schema should include channels, giveawayRole, giveawayManager)
const GiveawayLogConfig = require('../../utils/schemas/GiveawayLogConfig');

module.exports = {
    //define the slash command
    data: new SlashCommandBuilder()
        .setName('view_settings') //Command: /view_settings -- view current giveaway log + role config
        .setDescription('Display the current giveaway configuration and roles.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction, client) {
        try {
            //fetch config for this guild
            const config = await GiveawayLogConfig.findOne({ guildId: interaction.guild.id });

            //if no config found, return error
            if (!config || !config.channels) {
                const noConfigEmbed = new EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('No Settings Found')
                    .setDescription('No giveaway configuration is currently set for this server.');
                return interaction.reply({ embeds: [noConfigEmbed], ephemeral: true });
            }

            //destructure config values
            const { channels, giveawayRole, giveawayManager } = config;

            //embed for displaying settings
            const settingsEmbed = new EmbedBuilder()
                .setTitle('Current Giveaway Settings')
                .setColor('#2ECC71')
                .setTimestamp();

            //helper functions to format channels/roles or fallback to "Not Set"
            const formatChannel = (id) => id ? `<#${id}>` : 'Not Set';
            const formatRole = (id) => id ? `<@&${id}>` : 'Not Set';

            //add settings as embed fields
            settingsEmbed.addFields(
                { name: 'Create Logs', value: formatChannel(channels.giveawayCreate), inline: true },
                { name: 'Entry Logs', value: formatChannel(channels.giveawayEntry), inline: true },
                { name: 'Reroll Logs', value: formatChannel(channels.giveawayReroll), inline: true },
                { name: 'End Logs', value: formatChannel(channels.giveawayEnd), inline: true },
                { name: 'Leave Logs', value: formatChannel(channels.giveawayLeave), inline: true },
                { name: '\u200B', value: '\u200B', inline: true }, //blank spacer for layout
                { name: 'Giveaway Role', value: formatRole(giveawayRole), inline: true },
                { name: 'Giveaway Manager Role', value: formatRole(giveawayManager), inline: true }
            );

            //send settings embed
            return interaction.reply({ embeds: [settingsEmbed], ephemeral: true });

        } catch (err) {
            //log error in console/logger
            client.logger.error(`Error fetching giveaway settings: ${err}`);

            //error embed response
            const errorEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('Fetch Error')
                .setDescription('An unexpected error occurred while retrieving the giveaway settings. Please try again later.')
                .setTimestamp();

            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
