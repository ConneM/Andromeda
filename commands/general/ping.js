module.exports = {
    name: 'ping',
    description: 'Ping the bot',

    run: async (client, message, args) => {
        
        message.reply(`My ping is! \`${client.ws.ping}\` ms`);
    }
}