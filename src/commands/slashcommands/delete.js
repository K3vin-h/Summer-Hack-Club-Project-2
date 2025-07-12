const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const GiveawayModel = require('../../utils/schemas/GiveawayModel');
const GiveawayLogConfig = require('../../utils/schemas/GiveawayLogConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete an existing giveaway')
        .addStringOption(option =>
            option.setName('giveaway_id')
                .setDescription('The message ID of the giveaway to delete')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const giveawayId = interaction.options.getString('giveaway_id');
        if (!(await client.function.giveaway.giveawayRoleFilter.hasManagerRole(interaction))) {
            const nopermissionEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setDescription('You do not have permission to delete giveaways. You need the giveaway manager role.')
                .setTimestamp();
            return interaction.reply({ embeds: [nopermissionEmbed], flags: MessageFlags.Ephemeral });
        }
        const giveaway = await GiveawayModel.findOne({ messageId: giveawayId, guildId: interaction.guild.id });
        if (!giveaway) {
            const notFoundEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setDescription('Giveaway not found. Please check the message ID and try again.')
                .setTimestamp();
            return interaction.reply({ embeds: [notFoundEmbed], flags: MessageFlags.Ephemeral });
        };
        try {
            const channel = await interaction.guild.channels.fetch(giveaway.channelId).catch(() => null);
            const message = await channel.messages.fetch(giveaway.messageId).catch(() => null);
            if (message) {
                await message.delete();
            }
            await GiveawayModel.findOne({ messageId: giveawayId, guildId: interaction.guild.id });
            const successEmbed = new EmbedBuilder()
                .setColor('#00CC66')
                .setTitle('Giveaway Deleted')
                .setDescription(`The giveaway for **${giveaway.prize}** has been successfully deleted.`)
                .setTimestamp();
            const giveawayLogChannel = await GiveawayLogConfig.findOne({ guildId: interaction.guild.id });
            if (giveawayLogChannel.channels.giveawayDelete) {
                const logChannel = await interaction.guild.channels.fetch(giveawayLogChannel.channels.giveawayDelete).catch(() => null);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor('#FFA500')
                        .setTitle('Giveaway Embed Deleted')
                        .setDescription(`The giveaway embed has been deleted.`)
                        .addFields(
                            { name: 'Deleted by', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                            { name: 'Giveaway ID', value: giveawayId, inline: true },
                            { name: 'Prize', value: giveaway.prize || 'No prize specified', inline: true },
                            { name: 'Original Channel', value: `<#${giveaway.channelId}>`, inline: true },
                            { name: 'Winners', value: giveaway.winners.toString(), inline: true },
                            { name: 'Duration', value: giveaway.endTime ? new Date(giveaway.endTime).toLocaleString('en-US', { timeZone: 'UTC' }) : 'N/A', inline: true }
                        )
                        .setTimestamp();
                    await logChannel.send({ embeds: [logEmbed] });
                }
            }
            await GiveawayModel.deleteOne({ messageId: giveawayId, guildId: interaction.guild.id });
            return interaction.reply({ embeds: [successEmbed], flags: MessageFlags.Ephemeral });
        } catch (err) {
            client.logger.error(`Error deleting giveaway: ${err}`);
            const errorEmbed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setDescription('An error occurred while trying to delete the giveaway. Please try again later.')
                .setTimestamp();
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
    }

}