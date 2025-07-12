const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const GiveawayModel = require('../../utils/schemas/GiveawayModel');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('end')
        .setDescription('End a giveaway early')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The message ID of the giveaway to end')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        if (!(await client.function.giveaway.giveawayRoleFilter.hasManagerRole(interaction))) {
            const noPermsEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('Permission Denied')
                .setDescription('You need the giveaway manager role to end giveaways.')
                .setTimestamp();
            return interaction.reply({ embeds: [noPermsEmbed], flags: MessageFlags.Ephemeral });
        }
        const messageId = interaction.options.getString('message_id');
        try {
            const giveaway = await GiveawayModel.findOne({ messageId });

            if (!giveaway) {
                const notFoundEmbed = new EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('Giveaway Not Found')
                    .setDescription(`No giveaway was found with the message ID: \`${messageId}\`.`)
                    .setTimestamp();
                return interaction.reply({ embeds: [notFoundEmbed], flags: MessageFlags.Ephemeral });
            }

            if (giveaway.ended) {
                const alreadyEndedEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('Already Ended')
                    .setDescription('This giveaway has already ended.')
                    .setTimestamp();
                return interaction.reply({ embeds: [alreadyEndedEmbed], flags: MessageFlags.Ephemeral });
            }
            await client.function.giveaway.manager.endGiveaway(interaction, giveaway, client, true, interaction.user.id);
            const successEmbed = new EmbedBuilder()
                .setColor('#2ECC71')
                .setTitle('Giveaway Ended')
                .setDescription(`The giveaway for **${giveaway.prize}** has been ended early.`)
                .addFields({ name: 'Message ID', value: `\`${giveaway.messageId}\``, inline: true })
                .setTimestamp();
            return interaction.reply({ embeds: [successEmbed], flags: MessageFlags.Ephemeral });

        } catch (error) {
            client.logger.error('End command error:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('Error')
                .setDescription('An unexpected error occurred while trying to end the giveaway.')
                .setTimestamp();
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        };
    }
};
