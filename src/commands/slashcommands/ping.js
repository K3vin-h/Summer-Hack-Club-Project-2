const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows the bot, API, and MongoDB latency'),

  async execute(interaction, client) {
    await interaction.reply({ content: 'Pinging...' });
    const sent = await interaction.fetchReply();
    const botLatency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);
    let dbPing = 'N/A';
    try {
      const start = Date.now();
      await mongoose.connection.db.admin().ping();
      dbPing = `${Date.now() - start}ms`;
    } catch (err) {
      dbPing = 'Failed';
    };
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('Pong!')
      .addFields(
        { name: 'Bot Latency', value: `\`${botLatency}ms\``, inline: true },
        { name: 'API Latency', value: `\`${apiLatency}ms\``, inline: true },
        { name: 'Database Ping', value: `\`${dbPing}\``, inline: true }
      )
      .setTimestamp();
    await interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
};

