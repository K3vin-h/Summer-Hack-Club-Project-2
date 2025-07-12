const GiveawayModel = require('../../utils/schemas/GiveawayModel');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.logger.info(`Logged in as ${client.user.tag}`);
        setInterval(async () => {
            const now = new Date();
            const giveaways = await GiveawayModel.find({ ended: false, endTime: { $lte: now } });
            for (const giveaway of giveaways) {
                await client.function.giveaway.manager.endGiveaway(null, giveaway, client);
            }
        }, 60000);
    }
}