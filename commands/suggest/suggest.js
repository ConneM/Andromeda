const Discord = require("discord.js");
const db = require('quick.db');
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('./configs/messages.yml', 'utf8'))

module.exports = {
    name: "suggest",
    description: "Suggest something to the server owner",
    usage: "suggest <suggestion>",

    run: async(client, message, args, util) => {

        try {
        const system = await db.fetch(`suggest_system_${message.guild.id}`) || "true"

        if(system === "true") {
        const channel = await db.fetch(`suggestionChannel_${message.guild.id}`)
        if(!channel) return message.channel.send(messages.MESSAGE_SUGGEST.SUGGEST.NO_CHANNEL)
        
        if(!args.join(" ")) {
            return message.channel.send(messages.MESSAGE_SUGGEST.SUGGEST.PROVIDE_MESSAGE)
        }

        const author = messages.EMBED_SUGGEST.SUGGEST.ENVIED_SUGGEST.AUTHOR.replace('<user.name>', message.member.user.tag)
        const description = messages.EMBED_SUGGEST.SUGGEST.ENVIED_SUGGEST.DESCRIPTION.replace('<args>', args.join(" "))
        const footer = messages.EMBED_SUGGEST.SUGGEST.ENVIED_SUGGEST.FOOTER.replace('<user.tag>', message.member.user.tag).replace('<user.id>', message.member.user.id)
        const color = messages.EMBED_SUGGEST.SUGGEST.ENVIED_SUGGEST.COLOR

        const field = messages.EMBED_SUGGEST.SUGGEST.FIELDS.FIELD_PART1
        const field2 = messages.EMBED_SUGGEST.SUGGEST.FIELDS.FIELD_PART2

        const suggested = new Discord.MessageEmbed()
            .setAuthor(author)
            .setDescription(description)
            .setFooter(footer, message.member.user.displayAvatarURL({dynamic : true}))
            .setColor(color)
            .addField(field, field2)
        client.channels.cache.get(channel).send({embeds: [suggested]})
        .then(async(m) => {
            await m.react(messages.SUGGEST.EMOJIS.VOTE1)
            await m.react(messages.SUGGEST.EMOJIS.VOTE2)
                
            const author = messages.EMBED_SUGGEST.SUGGEST.SEND_SUGGEST.AUTHOR
            const description = messages.EMBED_SUGGEST.SUGGEST.SEND_SUGGEST.DESCRIPTION.replace('<message.link>', `https://discord.com/channels/${message.guild.id}/${channel}/${m.id}`).replace('<channel>', `<#${channel}>`)
            const footer = messages.EMBED_SUGGEST.SUGGEST.SEND_SUGGEST.FOOTER
            const color = messages.EMBED_SUGGEST.SUGGEST.SEND_SUGGEST.COLOR

            const success = new Discord.MessageEmbed()
                .setAuthor(author)
                .setDescription(description)
                .setFooter(footer)
                .setColor(color)
            await message.channel.send({embeds: [success]})
            })
        } else {
            message.channel.send(messages.MESSAGE_SUGGEST.SUGGEST.SYSTEM_DISABLED)
        }
        } catch (error) {
            console.log(error)
        }
    } 
}
