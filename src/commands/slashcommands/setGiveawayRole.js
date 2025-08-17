//import required discord.js classes
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
//import mongoose model (schema should include giveawayManager & giveawayRole fields)
const GiveawayLogConfig = require('../../utils/schemas/GiveawayLogConfig');

module.exports = {
    //define the slash command
    data: new SlashCommandBuilder()
        .setName('set_giveaway_roles') //Command: /set_giveaway_roles -- set manager/giveaway roles
        .setDescription('Configure or update the roles for giveaway management and participation.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        //optional manager role (for ending/deleting giveaways)
        .addRoleOption(option =>
            option.setName('manager_role')
                .setDescription('Role required to manage giveaways (delete, end).')
                .setRequired(false)
        )
        //optional giveaway role (for creating/rerolling giveaways)
        .addRoleOption(option =>
            option.setName('giveaway_role')
                .setDescription('Role required to create and reroll giveaways.')
                .setRequired(false)
        ),

    async execute(interaction, client) {
        //get roles provided in the command
        const managerRole = interaction.options.getRole('manager_role');
        const giveawayRole = interaction.options.getRole('giveaway_role');

        //if no roles were provided, return error
        if (!managerRole && !giveawayRole) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('No Roles Provided')
                .setDescription('You must specify at least one role to update.');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        try {
            //find config for this guild or create new one
            let config = await GiveawayLogConfig.findOne({ guildId: interaction.guild.id });
            if (!config) {
                config = await GiveawayLogConfig.create({ guildId: interaction.guild.id });
            }

            //update roles if provided
            if (managerRole) config.giveawayManager = managerRole.id;
            if (giveawayRole) config.giveawayRole = giveawayRole.id;
            await config.save();

            //confirmation embed
            const updatedEmbed = new EmbedBuilder()
                .setColor('#2ECC71')
                .setTitle('Giveaway Roles Updated')
                .setDescription([
                    managerRole ? `**Manager Role:** ${managerRole}` : null,
                    giveawayRole ? `**Giveaway Role:** ${giveawayRole}` : null
                ].filter(Boolean).join('\n')) //only show roles that were updated
                .setFooter({ text: 'Ensure the bot has proper permissions to recognize these roles.' })
                .setTimestamp();

            return interaction.reply({ embeds: [updatedEmbed], ephemeral: true });

        } catch (error) {
            //log error in console/logger
            client.logger.error('Error updating giveaway roles:', error);

            //error embed response
            const errorEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('Update Failed')
                .setDescription('An unexpected error occurred while updating the giveaway roles. Please try again later.')
                .setTimestamp();

            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
