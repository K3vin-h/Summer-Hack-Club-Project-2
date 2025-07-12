require('dotenv').config();
const { token } = process.env;
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');

const getclientid = require('../utils/functions/getClientId');

module.exports = (client) => {
    client.handleSlashCommands = async () => {
        const slashCommandFolder = readdirSync('./src/commands');
        for (const folder of slashCommandFolder) {
            const slashCommandFiles = readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
            const { slashCommands, slashCommandArray, guildSlashCommands, guildSlashCommandsArray } = client;
            for (const file of slashCommandFiles) {
                const slashCommand = require(`../commands/${folder}/${file}`);
                if (!slashCommand.guilds) {
                    slashCommands.set(slashCommand.data.name, slashCommand);
                    slashCommandArray.push(slashCommand.data.toJSON());
                    client.logger.info(`Loaded slash command ${slashCommand.data.name} globally.`);
                } else {
                    guildSlashCommands.set(slashCommand.data.name, slashCommand);
                    guildSlashCommandsArray.push({ data: slashCommand.data.toJSON(), guilds: slashCommand.guilds });
                    client.logger.info(`Loaded slash command ${slashCommand.data.name} for guilds: ${slashCommand.guilds.join(', ')}.`);
                }

            }
        }
        const clientId = process.env.CLIENT_ID || getclientid(token);
        const rest = new REST({ version: '10' }).setToken(token);
        try {
            client.logger.info('Started refreshing slash commands.');
            await rest.put(Routes.applicationCommands(clientId), {
                body: client.slashCommandArray,
            });

            const slashcommandsinguild = {};
            for (const guildSlashCommand of client.guildSlashCommandsArray) {
                for (const guild of guildSlashCommand.guilds) {
                    if (!slashcommandsinguild[guild]) {
                        slashcommandsinguild[guild] = [];
                    }

                    const alreadyRegistered = slashcommandsinguild[guild].find((cmd) => cmd.name === guildSlashCommand.data.name);
                    if (!alreadyRegistered) {
                        slashcommandsinguild[guild].push(guildSlashCommand.data);
                    }
                }
            }

            for (const guild in slashcommandsinguild) {
                try {
                    const slashcommands = slashcommandsinguild[guild];
                    await rest.put(Routes.applicationGuildCommands(clientId, guild), {
                        body: slashcommands,
                    });
                    client.logger.info(`Successfully reloaded slash commands for guild ${guild}.`);
                } catch (err) {
                    client.logger.error(`Failed to reload slash commands for guild ${guild}. Error: ${err.message}`);
                }
            }
            client.logger.info('Successfully reloaded global slash commands.');
        } catch (err) {
            client.logger.error('Failed to refresh slash commands. Error: ' + err.message);
        };
    };
};
