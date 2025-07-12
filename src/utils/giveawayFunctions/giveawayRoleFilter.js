const GiveawayLogConfig = require('../../utils/schemas/GiveawayLogConfig');
module.exports = {
    async hasGiveawayRole(interaction) {
        const config = await GiveawayLogConfig.findOne({ guildId: interaction.guild.id });
        if (!config || !config.giveawayRole) return false;
        return interaction.member.roles.cache.has(config.giveawayRole);
    },
    async hasManagerRole(interaction) {
        const config = await GiveawayLogConfig.findOne({ guildId: interaction.guild.id });
        if (!config || !config.giveawayManager) return false;
        return interaction.member.roles.cache.has(config.giveawayManager);
    }
}