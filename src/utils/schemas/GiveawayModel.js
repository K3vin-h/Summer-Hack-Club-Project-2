const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
    messageId: { type: String, required: true },
    channelId: { type: String, required: true },
    guildId: { type: String, required: true },
    guildName: { type: String, default: '' },
    hosted: { type: String, required: true },
    hostedTag: { type: String, default: '' },
    prize: { type: String, required: true },
    winners: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    requiredRoleId: { type: String, default: null },
    requiredJoinServerId: { type: String, default: null },
    bonusEntries: [{
        roleId: { type: String, required: true },
        entries: { type: Number, required: true, default: 1 }
    }],
    bypassRoles: { type: [String], default: [] },
    entries: [{
        userId: { type: String, required: true },
        entries: { type: Number, required: true, default: 1 }
    }],
    ended: { type: Boolean, default: false },
    endTime: { type: Date, index: true },
    created: { type: String, default: '' },
    creatorTag: { type: String, default: '' },
}, { timestamps: true });

giveawaySchema.virtual('shouldCleanup').get(function () {
    return this.ended && (new Date() - this.endTime) > (30 * 24 * 60 * 60 * 1000); // 30 days
});

module.exports = mongoose.model('GiveawayModel', giveawaySchema);