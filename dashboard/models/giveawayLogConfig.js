const mongoose = require("mongoose");

const giveawayLogConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    giveawayRole: { type: String, default: null },
    giveawayManager: { type: String, default: null },
    channels: {
        giveawayCreate: { type: String, default: null },
        giveawayEntry: { type: String, default: null },
        giveawayReroll: { type: String, default: null },
        giveawayEnd: { type: String, default: null },
        giveawayLeave: { type: String, default: null },
        giveawayDelete: { type: String, default: null },
        giveawayConfig: { type: String, default: null },
    }

}, { timestamps: true });

module.exports = mongoose.models.GiveawayLogConfig || mongoose.model('GiveawayLogConfig', giveawayLogConfigSchema);