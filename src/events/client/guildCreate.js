const GiveawayLogConfig = require('../../utils/schemas/GiveawayLogConfig');

module.exports = { 
    name: 'guildCreate',
    once: false,
    async execute(guild, client) {
        client.logger.info(`Joined a new guild: ${guild.name} (ID: ${guild.id})`);
        try{
            const existingLogConfig = await GiveawayLogConfig.findOne({ guildId: guild.id });
            if (!existingLogConfig) {
                await GiveawayLogConfig.create({
                    guildId: guild.id,
                    channels: {
                        giveawayCreate: null,
                        giveawayEntry: null,
                        giveawayReroll: null,
                        giveawayEnd: null,
                        giveawayLeave: null,
                        giveawayDelete: null
                    },
                });
                client.logger.info(`Created a new GiveawayLogConfig for guild: ${guild.name} (ID: ${guild.id})`);
            }
        }catch(err){
            client.logger.error(`Error for guildCreate event for guild ${guild.id}: ${err.message}`);
        }
    }
}