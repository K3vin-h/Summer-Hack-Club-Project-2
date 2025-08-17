module.exports = {
  async checkRequirements(giveaway, member) {
    if (!giveaway || !member || !member.roles || !member.roles.cache) return false;

    try {
      if (Array.isArray(giveaway.bypassRoles) && giveaway.bypassRoles.length > 0) {
        const hasBypassRole = giveaway.bypassRoles.some(roleId => member.roles.cache.has(roleId));
        if (hasBypassRole) return true;
      }

      if (giveaway.requiredRoleId && !member.roles.cache.has(giveaway.requiredRoleId)) return false;

      if (giveaway.requiredJoinServerId) {
        try {
          const requiredGuild = await member.client.guilds.fetch(giveaway.requiredJoinServerId);
          const fetchedMember = await requiredGuild.members.fetch(member.id).catch(() => null);
          if (!fetchedMember) return false;
        } catch (err) {
          member.client.logger?.warn?.(
            `[RequirementsChecker] Failed to verify required server (${giveaway.requiredJoinServerId}): ${err.message}`
          );
          return false;
        }
      }

      return true;
    } catch (err) {
      member.client.logger?.error?.(
        `[RequirementsChecker] Unexpected error in checkRequirements: ${err.message}`
      );
      return false;
    }
  },

  calculateBonusEntries(giveaway, member) {
    let bonusEntries = 0;

    if (Array.isArray(giveaway.bonusEntries)) {
      for (const bonus of giveaway.bonusEntries) {
        if (!bonus || typeof bonus !== 'object') continue;

        const roleId = bonus.roleId;
        const entries = Number(bonus.entries);

        if (typeof roleId === 'string' && !isNaN(entries) && member.roles.cache.has(roleId)) {
          bonusEntries += entries;
        }
      }
    }

    return bonusEntries;
  },

  async getRequirementMessage(giveaway, member, client) {
    const missing = [];

    if (giveaway.requiredRoleId && !member.roles.cache.has(giveaway.requiredRoleId)) {
      missing.push(`You must have the <@&${giveaway.requiredRoleId}> role in the server.`);
    }

    if (giveaway.requiredJoinServerId) {
      try {
        const guild = await client.guilds.fetch(giveaway.requiredJoinServerId);
        missing.push(`You must be a member of the server: **${guild.name}** (ID: \`${giveaway.requiredJoinServerId}\`).`);
      } catch {
        missing.push(`You must be a member of the server with ID: \`${giveaway.requiredJoinServerId}\`.`);
      }
    }

    return missing.length
      ? `You do not meet the following requirements required to enter this giveaway:\n\n${missing.join('\n')}`
      : 'You meet all requirements to enter this giveaway.';
  },

  validateGiveawayOptions(interaction, options) {
    const { prize, duration, winners } = options;

    if (!prize || typeof prize !== 'string' || prize.length > 256) {
      return { valid: false, message: 'Prize must be a string between 1 and 256 characters.' };
    }

    if (!duration || !this.isValidDuration(duration)) {
      return { valid: false, message: 'Invalid duration format. Example: 1d, 2h, 30m.' };
    }

    if (typeof winners !== 'number' || winners < 1 || winners > 25) {
      return { valid: false, message: 'Number of winners must be between 1 and 25.' };
    }

    return { valid: true };
  },

  isValidDuration(duration) {
    return /^(\d+d)?(\d+h)?(\d+m)?$/.test(duration) && /\d/.test(duration);
  }
};
