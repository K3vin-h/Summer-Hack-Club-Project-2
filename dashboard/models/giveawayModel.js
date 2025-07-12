const mongoose = require("mongoose");

const giveawaySchema = new mongoose.Schema({
    messageId: String,
    channelId: String,
    guildId: String,
    guildName: String,
    hosted: String,
    hostedTag: String,
    prize: String,
    winners: Number,
    createdAt: Date,
    requiredRoleId: String,
    requiredJoinServerId: String,
    bonusEntries: [{
        roleId: String,
        entries: Number
    }],
    bypassRoles: [String],
    entries: [{
        userId: String,
        entries: Number,
    }],
    ended: { type: Boolean, default: false },
    endTime: { type: Date, index: true },
    created: String,
    creatorTag: String 
}, { timestamps: true });

module.exports = mongoose.models.GiveawayModel || mongoose.model("GiveawayModel", giveawaySchema);

