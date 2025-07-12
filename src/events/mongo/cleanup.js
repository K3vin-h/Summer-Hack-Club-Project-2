const GiveawayModel = require('../../utils/schemas/GiveawayModel');
const { scheduleJob } = require('node-schedule');

module.exports = async (client) => {
    scheduleJob('0 0 * * *', async () => {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const result = await GiveawayModel.deleteMany({
                ended: true,
                endTime: { $lte: thirtyDaysAgo }
            });

            client.logger.info(`Deleted ${result.deletedCount} old giveaways`);
        } catch (error) {
            client.logger.error('Error in cleanup old giveaways:', error);
        }
    });
};
module.exports.config = {
    name: 'cleanupOldGiveaways',
}


