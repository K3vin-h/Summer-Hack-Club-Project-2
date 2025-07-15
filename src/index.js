require("dotenv").config();
const { token } = process.env;
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { readdirSync } = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember
    ],
});

client.slashCommands = new Collection();
client.slashCommandArray = [];

client.guildSlashCommands = new Collection();
client.guildSlashCommandsArray = [];

client.logger = require("./logger/logger.js");
client.function = {};
client.function.giveaway = {
    manager: require("./utils/giveawayFunctions/manager.js"),
    giveawayRoleFilter: require("./utils/giveawayFunctions/giveawayRoleFilter.js"),
    validator: require("./utils/giveawayFunctions/validator.js"),
};
const handlers = readdirSync("./src/handlers").filter(file => file.endsWith(".js"));
for (const file of handlers) {
    client.logger.info(`Loading handler: ${file}`);
    require(`./handlers/${file}`)(client);
};
client.handleSlashCommands()
client.handleEvents();

client.on('debug', (msg) => client.logger.debug(`[DISCORD] ${msg}`));
client.on('warn', (msg) => client.logger.warn(`[DISCORD] ${msg}`));
client.on('error', (error) => client.logger.error(`[DISCORD]`, error));


const express = require('express');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: [
    "http://localhost:3000",        
    "https://your-dashboard.vercel.app",
    "https://summer-hack-club-project-2.onrender.com"
  ],
  credentials: true
}));
app.use(express.json());
client.handleRoutes(app); 
client.once('ready', () => {
  isReady = true;
  client.logger.info(`Website running with: ${client.user.tag}!`);

});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

client.login(token).then(() => {
    client.logger.info("Loading up bot...");
}).catch(err => {
    client.logger.error("Failed to log in:", err);
});