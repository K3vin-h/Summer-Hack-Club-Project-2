const GiveawayLogConfig = require('../../utils/schemas/GiveawayLogConfig');

module.exports = {
    name: 'guildDelete',
    once: false,
    async execute(guild, client) {
        client.logger.info(`Left a guild: ${guild.name} (ID: ${guild.id})`);
        try{
            const existingLogConfig = await GiveawayLogConfig.findOne({ guildId: guild.id });
            if (existingLogConfig) {
                await GiveawayLogConfig.deleteOne({ guildId: guild.id });
                client.logger.info(`Deleted GiveawayLogConfig for guild: ${guild.name} (ID: ${guild.id})`);
            }
        }catch(err){
            client.logger.error(`Error for guildDelete event for guild ${guild.id}: ${err.message}`);
        }
    }
};