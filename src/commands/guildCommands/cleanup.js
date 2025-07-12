const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const Giveaway = require('../../utils/schemas/GiveawayModel');
const OWNER_IDS = ['793189779838992384'];

module.exports = {
    guilds: ["828323927989420145"],
    data: new SlashCommandBuilder()
        .setName('cleanup')
        .setDescription('Force cleanup of giveaways ended more than X days ago')
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Delete giveaways older than this many days')
                .setRequired(true)),

    async execute(interaction, client) {
        if (!OWNER_IDS.includes(interaction.user.id)) {
            return interaction.reply({
                content: 'Only the bot owner can use this command!',
                flags: MessageFlags.Ephemeral
            });
        }
        const days = interaction.options.getInteger('days');
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        try {
            const oldGiveaways = await Giveaway.find({
                ended: true,
                endTime: { $lte: cutoffDate }
            });
            if (oldGiveaways.length === 0) {
                return interaction.reply({
                    content: `No giveaways found older than ${days} days to clean up!`,
                    flags: MessageFlags.Ephemeral
                });
            }
            await interaction.reply({
                content: `Found ${oldGiveaways.length} giveaways older than ${days} days. Delete them?`,
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm_cleanup')
                            .setLabel('DELETE THEM')
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('cancel_cleanup')
                            .setLabel('Cancel')
                            .setStyle(ButtonStyle.Secondary)
                    )
                ],
                flags: MessageFlags.Ephemeral
            });

            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'confirm_cleanup') {
                    const result = await Giveaway.deleteMany({
                        ended: true,
                        endTime: { $lte: cutoffDate }
                    });

                    await i.update({
                        content: `Deleted ${result.deletedCount} giveaways older than ${days} days!`,
                        components: []
                    });
                    // const logChannel = interaction.guild.channels.cache.find(c => c.name === 'giveaway-logs');
                    // if (logChannel) {
                    //     const logEmbed = new EmbedBuilder()
                    //         .setColor('#FF0000')
                    //         .setTitle('🧹 Manual Giveaway Cleanup')
                    //         .setDescription(`**Deleted:** ${result.deletedCount} giveaways`)
                    //         .addFields(
                    //             { name: 'Older than', value: `${days} days`, inline: true },
                    //             { name: 'Executed by', value: `<@${interaction.user.id}>`, inline: true }
                    //         )
                    //         .setTimestamp();
                    //     await logChannel.send({ embeds: [logEmbed] });
                    // }
                } else {
                    await i.update({ content: 'Cleanup cancelled.', components: [] });
                }
            });

        } catch (error) {
            client.logger.error('Cleanup command error:', error);
            await interaction.reply({
                content: 'Failed to execute cleanup! Check logs.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
