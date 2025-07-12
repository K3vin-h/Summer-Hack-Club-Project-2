const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, MessageFlags, EmbedBuilder } = require('discord.js');
const GiveawayLogConfig = require('../../utils/schemas/GiveawayLogConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_giveaway_log')
        .setDescription('Set log channels for giveaway events.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Set or update giveaway log')
                .setRequired(true)
                .addChoices(
                    { name: 'create', value: 'giveawayCreate' },
                    { name: 'entry', value: 'giveawayEntry' },
                    { name: 'reroll', value: 'giveawayReroll' },
                    { name: 'end', value: 'giveawayEnd' },
                    { name: 'leave', value: 'giveawayLeave' }
                )
        )
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel where this type of log will be sent')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),

    async execute(interaction) {
        const type = interaction.options.getString('type');
        const channel = interaction.options.getChannel('channel');
        let config = await GiveawayLogConfig.findOne({ guildId: interaction.guild.id });
        if (!config) {
            config = await GiveawayLogConfig.create({
                guildId: interaction.guild.id,
                channels: {}
            });
        }
        config.channels[type] = channel.id;
        await config.save();
        const embed = new EmbedBuilder()
            .setColor('#2ECC71')
            .setDescription(`Log channel for **${type.replace('giveaway', '')}** set to ${channel}.`);
        return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
};