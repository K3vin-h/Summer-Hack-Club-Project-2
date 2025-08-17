// Import required classes from discord.js
const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
// Import the Giveaway database model
const GiveawayModel = require('../../utils/schemas/GiveawayModel');

module.exports = {
    // Define the slash command
    data: new SlashCommandBuilder()
        .setName('end') // Command: /end
        .setDescription('Terminate an active giveaway before its scheduled end.') // Command description
        .addStringOption(option =>
            option.setName('message_id') // Input option for giveaway message ID
                .setDescription('Provide the message ID of the giveaway you wish to end early.')
                .setRequired(true)
        ),

    // Main execution function for the command
    async execute(interaction, client) {
        // Permission check: user must have the manager role
        if (!(await client.function.giveaway.giveawayRoleFilter.hasManagerRole(interaction))) {
            // If not, send a permission denied embed
            const noPermsEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('Permission Denied')
                .setDescription('You must have the giveaway manager role to end giveaways.')
                .setFooter({ text: 'Tip: Use /set_giveaway_roles to configure the manager role.'})
                .setTimestamp();
            return interaction.reply({ embeds: [noPermsEmbed], flags: MessageFlags.Ephemeral });
        }

        // Retrieve the provided giveaway message ID
        const messageId = interaction.options.getString('message_id');

        try {
            // Look up the giveaway in the database
            const giveaway = await GiveawayModel.findOne({ messageId });

            // If no giveaway is found, notify the user
            if (!giveaway) {
                const notFoundEmbed = new EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('Giveaway Not Found')
                    .setDescription(`No giveaway could be located with the provided message ID: \`${messageId}\`.`)
                    .setTimestamp();
                return interaction.reply({ embeds: [notFoundEmbed], flags: MessageFlags.Ephemeral });
            }

            // If giveaway already ended, prevent duplicate ending
            if (giveaway.ended) {
                const alreadyEndedEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('Giveaway Already Ended')
                    .setDescription('This giveaway has already concluded and cannot be ended again.')
                    .setTimestamp();
                return interaction.reply({ embeds: [alreadyEndedEmbed], flags: MessageFlags.Ephemeral });
            }

            // End the giveaway using the giveaway manager function
            // Arguments: interaction, giveaway object, client, force=true, endedBy=interaction.user.id
            await client.function.giveaway.manager.endGiveaway(interaction, giveaway, client, true, interaction.user.id);

            // Success embed to confirm early termination
            const successEmbed = new EmbedBuilder()
                .setColor('#2ECC71')
                .setTitle('Giveaway Ended Successfully')
                .setDescription(`The giveaway for **${giveaway.prize}** has been concluded early.`)
                .addFields({ name: 'Message ID', value: `\`${giveaway.messageId}\``, inline: true })
                .setTimestamp();

            // Reply privately to the command executor
            return interaction.reply({ embeds: [successEmbed], flags: MessageFlags.Ephemeral });

        } catch (error) {
            // Log and handle unexpected errors
            client.logger.error('End command error:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('Unexpected Error')
                .setDescription('An error occurred while attempting to end the giveaway. Please try again later.')
                .setTimestamp();
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
    }
};
