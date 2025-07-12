const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const GiveawayLogConfig = require('../../utils/schemas/GiveawayLogConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_giveaway_roles')
        .setDescription('Set or update the giveaway manager and participant roles.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addRoleOption(option =>
            option.setName('manager_role')
                .setDescription('Role required to manage giveaways')
                .setRequired(false)
        )
        .addRoleOption(option =>
            option.setName('giveaway_role')
                .setDescription('Role required to create giveaways')
                .setRequired(false)
        ),
    async execute(interaction, client) {
        const managerRole = interaction.options.getRole('manager_role');
        const giveawayRole = interaction.options.getRole('giveaway_role');

        if (!managerRole && !giveawayRole) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setDescription('You must provide at least one role to update.');
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        };
        try {
            let config = await GiveawayLogConfig.findOne({ guildId: interaction.guild.id });
            if (!config) {
                config = await GiveawayLogConfig.create({ guildId: interaction.guild.id });
            }
            if (managerRole) config.giveawayManager = managerRole.id;
            if (giveawayRole) config.giveawayRole = giveawayRole.id;
            await config.save();

            const updatedEmbed = new EmbedBuilder()
                .setColor('#2ECC71')
                .setTitle('✅ Giveaway Roles Updated')
                .setDescription([managerRole ? `**Manager Role:** ${managerRole}` : null, giveawayRole ? `**Giveaway Role:** ${giveawayRole}` : null].filter(Boolean).join('\n'));
            return interaction.reply({ embeds: [updatedEmbed], flags: MessageFlags.Ephemeral });
        } catch (error) {
            client.logger.error('Error updating giveaway roles:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setDescription('An error occurred while updating the giveaway roles. Please try again later.');
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
    }
};
