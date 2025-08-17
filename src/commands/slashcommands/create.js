// Import necessary classes and utilities from discord.js
const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
  // Define the slash command using the SlashCommandBuilder
  data: new SlashCommandBuilder()
    .setName('create') // Command name: /create
    .setDescription('Initiate and publish a new giveaway.') // Command description
    
    // Required option: Prize name or description
    .addStringOption(option =>
      option.setName('prize')
        .setDescription('Specify the prize to be awarded.')
        .setRequired(true))
    
    // Required option: Duration of the giveaway (formatted as d, h, or m)
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Set the giveaway duration (e.g., 1d for 1 day, 2h for 2 hours, 30m for 30 minutes).')
        .setRequired(true))
    
    // Required option: Number of winners for the giveaway
    .addIntegerOption(option =>
      option.setName('winners')
        .setDescription('Define the total number of winners.')
        .setRequired(true))
    
    // Required option: Channel where the giveaway will be posted
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Select the text channel where the giveaway announcement will be posted.')
        .addChannelTypes(0) // 0 = Text channel
        .setRequired(true))
    
    // Optional: User who will be shown as the host of the giveaway
    .addUserOption(option =>
      option.setName('hosted')
        .setDescription('Choose the user who will be listed as the giveaway host.')
        .setRequired(false))
    
    // Optional: Role required for participants to be eligible
    .addRoleOption(option =>
      option.setName('required_role')
        .setDescription('Specify the role participants must have to be eligible.')
        .setRequired(false))
    
    // Optional: Server ID required for eligibility
    .addStringOption(option =>
      option.setName('required_server')
        .setDescription('Provide the server ID required for participation.')
        .setRequired(false))
    
    // Optional: Bonus entries (format: "roleId:entries,roleId2:entries2")
    .addStringOption(option =>
      option.setName('bonus_entries')
        .setDescription('Assign bonus entries using the format: "roleId:entries,roleId2:entries2".')
        .setRequired(false))
    
    // Optional: Roles that bypass giveaway entry requirements
    .addStringOption(option =>
      option.setName('bypass_roles')
        .setDescription('List comma-separated role IDs that bypass entry requirements.')
        .setRequired(false)),
        
  // Command execution logic
  async execute(interaction, client) {
    // Check if the user has the configured giveaway role
    if (!(await client.function.giveaway.giveawayRoleFilter.hasGiveawayRole(interaction))) {
      // If not, create an error embed to inform the user
      const nopermissionEmbed = new EmbedBuilder()
        .setColor('#E74C3C') // Red color for error
        .setDescription('You lack the required permissions to initiate a giveaway. A configured giveaway role is mandatory.')
        .setFooter({ text: 'Tip: Use /set_giveaway_roles to configure the required giveaway role.' })
        .setTimestamp();
      
      // Reply privately (ephemeral) so only the user sees the error
      return interaction.reply({ embeds: [nopermissionEmbed], flags: MessageFlags.Ephemeral });
    }
    
    // If permission check passes, call the giveaway manager to create the giveaway
    await client.function.giveaway.manager.createGiveaway(interaction, client);
  }
};
