module.exports = {
    name: 'ping',
    description: 'Ping the bot',

    run: async (client, interaction, args) => {
        
        interaction.reply(`My ping is! \`${client.ws.ping}\` ms`);
    }
}