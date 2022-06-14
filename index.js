const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client({ intents: 32767 });

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.slash = new Discord.Collection();

module.exports = client;
["commands","events","slash"].forEach(handler => { require(`./handlers/${handler}`)(client) });

client.login(config.token);