const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const GiveawayLogConfig = require('../../utils/schemas/GiveawayLogConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('view_settings')
        .setDescription('View the current giveaway settings')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction, client) {
        try {
            const config = await GiveawayLogConfig.findOne({ guildId: interaction.guild.id });
            if (!config || !config.channels) {
                const noConfigEmbed = new EmbedBuilder()
                    .setColor('#E74C3C')
                    .setDescription('No giveaway settings found for this server.');
                return interaction.reply({ embeds: [noConfigEmbed], flags: MessageFlags.Ephemeral });
            };
            const { channels, giveawayRole, giveawayManager } = config;
            const settingsEmbed = new EmbedBuilder()
                .setTitle('Giveaway Settings')
                .setColor('#2ECC71')
                .setTimestamp();
            const formatChannel = (id) => id ? `<#${id}>` : 'Not Set';
            const formatRole = (id) => id ? `<@&${id}>` : 'Not Set';
            settingsEmbed.addFields(
                { name: 'Create Logs', value: formatChannel(channels.giveawayCreate), inline: true },
                { name: 'Entry Logs', value: formatChannel(channels.giveawayEntry), inline: true },
                { name: 'Reroll Logs', value: formatChannel(channels.giveawayReroll), inline: true },
                { name: 'End Logs', value: formatChannel(channels.giveawayEnd), inline: true },
                { name: 'Leave Logs', value: formatChannel(channels.giveawayLeave), inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Giveaway Role', value: formatRole(giveawayRole), inline: true },
                { name: 'Giveaway Manager Role', value: formatRole(giveawayManager), inline: true }
            );
            return interaction.reply({ embeds: [settingsEmbed], flags: MessageFlags.Ephemeral });
        } catch (err) {
            client.logger.error(`Error fetching giveaway settings: ${err}`);
            const errorEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setDescription('An error occurred while fetching the giveaway settings. Please try again later.');
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
    }
};