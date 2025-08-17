// Import required discord.js classes
const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, MessageFlags, EmbedBuilder } = require('discord.js');
// Import mongoose model for storing giveaway log configurations
const GiveawayLogConfig = require('../../utils/schemas/GiveawayLogConfig');

module.exports = {
    // Define the slash command structure
    data: new SlashCommandBuilder()
        .setName('set_giveaway_log') // Command: /set_giveaway_log
        .setDescription('Configure log channels for various giveaway events.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild) // Restrict to members with Manage Guild permission
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Select the type of giveaway log to set or update.')
                .setRequired(true)
                .addChoices(
                    { name: 'create', value: 'giveawayCreate' },   // Logs when a giveaway is created
                    { name: 'entry', value: 'giveawayEntry' },     // Logs when someone enters
                    { name: 'reroll', value: 'giveawayReroll' },   // Logs when a reroll happens
                    { name: 'end', value: 'giveawayEnd' },         // Logs when a giveaway ends
                    { name: 'leave', value: 'giveawayLeave' }      // Logs when someone leaves
                )
        )
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select the text channel where this type of log will be sent.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText) // Only allow text channels
        ),

    async execute(interaction) {
        // Extract options from the command
        const type = interaction.options.getString('type');
        const channel = interaction.options.getChannel('channel');

        // Fetch or create giveaway log config for this guild
        let config = await GiveawayLogConfig.findOne({ guildId: interaction.guild.id });
        if (!config) {
            // If no config exists, create a new one
            config = await GiveawayLogConfig.create({
                guildId: interaction.guild.id,
                channels: {}
            });
        }

        // Update the log channel for the selected type
        config.channels[type] = channel.id;
        await config.save(); // Save changes to the database

        // Confirmation embed response
        const embed = new EmbedBuilder()
            .setColor('#2ECC71')
            .setTitle('Giveaway Log Channel Updated')
            .setDescription(`The log channel for **${type.replace('giveaway', '')} events** has been successfully set to ${channel}.`)
            .setFooter({ text: 'Ensure the bot has permissions to send messages in this channel.' })
            .setTimestamp();

        // Reply to the user (ephemeral so only they can see it)
        return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
};
