const { MessageFlags } = require('discord.js');
module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const { slashCommands, guildSlashCommands } = client;
            const { commandName } = interaction;
            const allCommands = new Map([...slashCommands, ...guildSlashCommands]);
            const command = allCommands.get(commandName);
            if (!command) return
            try {
                await command.execute(interaction, client);
            } catch (error) {
                client.logger.error(`Error executing command ${commandName}:`, error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', flag: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', flag: MessageFlags.Ephemeral });
                }
            }
        } else if (interaction.isButton() && interaction.customId === 'giveaway_join') {
            try {
                await client.function.giveaway.manager.handleGiveawayJoin(interaction, client);
            } catch (error) {
                client.logger.error(error);
                await interaction.reply({ content: 'There was an error joining the giveaway!', flags: MessageFlags.Ephemeral });
            }
        } else if (interaction.isButton() && interaction.customId === 'giveaway_leave') {
            try {
                await client.function.giveaway.manager.handleGiveawayLeave(interaction, client);
            } catch (error) {
                client.logger.error(error);
                await interaction.reply({ content: 'There was an error joining the giveaway!', flags: MessageFlags.Ephemeral });
            }
        }
    }
};