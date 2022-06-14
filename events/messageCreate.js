module.exports.run = async (client, message) => {

    try {
    const { Collection } = require('discord.js');
    const Timeout = new Collection();
    const ms = require('ms');
    if (message.author.bot || !message.guild) return;
    const config = require("../config.json")
    let prefix = config.prefix;
    
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.guild.fetchMembers(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd)
    
    if(!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
        if(command.cooldown) {
            if(Timeout.has(`${command.name}${message.author.id}`)) return message.channel.send(`You are on a \`${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), {long : true})}\` cooldown.`)
            command.run(client, message, args)
            Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
            setTimeout(() => {
                Timeout.delete(`${command.name}${message.author.id}`)
            }, command.cooldown)
        } else command.run(client, message, args);
    }
    } catch (err) {
        console.log(err)
    }
}