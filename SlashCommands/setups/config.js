const Discord = require("discord.js")
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('./configs/messages.yml', 'utf8', 2))
const db = require("quick.db")

module.exports = {
    name: "config",
    description: "Configure the channel",
    options: [
        {
            name: "validevent",
            type: "STRING",
            description: "The event to validate",
            choices: [
                {
                    name: 'suggestChannel',
                    value: 'suggestChannel'
                },
            ],
            required: true,
        },
        {
            name: "channel",
            type: "CHANNEL",
            description: "Set the channel",
            required: true,
        },
    ],

    run : async(client,interaction,args) => {
        const { guild, member, options} = interaction;

        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: messages['NO_PERMS'], ephemeral: true})

        if(args[0] === "suggestChannel") {

            let channel = options.getChannel(`channel`)
            db.set(`suggestionChannel_${interaction.guild.id}`, channel.id)

            const success = new Discord.MessageEmbed()
            .setDescription(`Set the suggestion channel to ${channel}`)
            .setColor("GREEN")

            return interaction.reply({embeds: [success]})
        }
    }
}
