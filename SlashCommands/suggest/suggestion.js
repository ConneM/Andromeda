const Discord = require("discord.js");
const db = require('quick.db');
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('./configs/messages.yml', 'utf8'))

module.exports = {
    name: "suggestion",
    description: "Suggest something to the server owner",
    options: [
        {
            name: "suggest",
            description: "Suggest something to the server owner",
            type: "SUB_COMMAND",
            options: [{ name: "message", description: "The suggestion message", type: "STRING", required: true }]
        },
        {
            name: "accept",
            description: "Accept the suggestion",
            type: "SUB_COMMAND",
            options: [{ name: "message_id", description: "The message id of the suggestion", type: "STRING", required: true}, { name: "message", description: "Put a reason for the accept.", type: "STRING", required: true}],
        },
        {
            name: "decline",
            description: "Decline the suggestion",
            type: "SUB_COMMAND",
            options: [{ name: "message_id", description: "The message id of the suggestion", type: "STRING", required: true}, { name: "message", description: "Put a reason for the decline.", type: "STRING", required: true}],
        }
    ],

    run: async (client, interaction, args) => {
        const [subCommand] = args;

        if (subCommand === "suggest") {
            const system = await db.fetch(`suggest_system_${interaction.guild.id}`) || "true"

            if(system === "true") {
            const { guild, member, options } = interaction;
    
            const suggestion = options.getString("message");
            const channel = await db.fetch(`suggestionChannel_${interaction.guild.id}`)
            if(!channel) return interaction.reply(messages.MESSAGE_SUGGEST.SUGGEST.NO_CHANNEL)
            
            const author = messages.EMBED_SUGGEST.SUGGEST.ENVIED_SUGGEST.AUTHOR.replace('<user.name>', interaction.user.tag)
            const description = messages.EMBED_SUGGEST.SUGGEST.ENVIED_SUGGEST.DESCRIPTION.replace('<args>', suggestion).replaceAll('\\n', '\n')
            const footer = messages.EMBED_SUGGEST.SUGGEST.ENVIED_SUGGEST.FOOTER.replace('<user.tag>', interaction.user.tag).replace('<user.id>', interaction.user.id)
            const color = messages.EMBED_SUGGEST.SUGGEST.ENVIED_SUGGEST.COLOR
    
            const field = messages.EMBED_SUGGEST.SUGGEST.FIELDS.FIELD_PART1
            const field2 = messages.EMBED_SUGGEST.SUGGEST.FIELDS.FIELD_PART2
    
            const suggested = new Discord.MessageEmbed()
                .setAuthor(author)
                .setDescription(description)
                .setFooter(footer, interaction.member.user.displayAvatarURL({dynamic : true}))
                .setColor(color)
                .addField(field, field2)
            await client.channels.cache.get(channel).send({embeds: [suggested]})
            .then(async(m) => {
                await m.react(messages.SUGGEST.EMOJIS.VOTE1)
                await m.react(messages.SUGGEST.EMOJIS.VOTE2)
                    
                const author = messages.EMBED_SUGGEST.SUGGEST.SEND_SUGGEST.AUTHOR
                const description = messages.EMBED_SUGGEST.SUGGEST.SEND_SUGGEST.DESCRIPTION.replace('<message.link>', `https://discord.com/channels/${interaction.guild.id}/${channel}/${m.id}`).replace('<channel>', `<#${channel}>`)
                const footer = messages.EMBED_SUGGEST.SUGGEST.SEND_SUGGEST.FOOTER
                const color = messages.EMBED_SUGGEST.SUGGEST.SEND_SUGGEST.COLOR
    
                const success = new Discord.MessageEmbed()
                    .setAuthor(author)
                    .setDescription(description)
                    .setFooter(footer)
                    .setColor(color)
                await interaction.reply({embeds: [success]})
                })
            } else {
                interaction.reply(messages.MESSAGE_SUGGEST.SUGGEST.SYSTEM_DISABLED)
            }
        } else if (subCommand === "accept") {
            try {
            if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply('You do not have permission to use this command!')

            const system = await db.fetch(`suggest_system_${interaction.guild.id}`) || "true"

            if(system === "true") {
            const messageid = interaction.options.getString('message_id')
            const reason = interaction.options.getString('message')

            const channel = db.fetch(`suggestionChannel_${interaction.guild.id}`)
            if(!channel) return interaction.reply(messages.MESSAGE_SUGGEST.SUGGEST.NO_CHANNEL)
            
            const suggestedEmbed = await interaction.guild.channels.cache.get(channel).messages.fetch(messageid)
            const data = suggestedEmbed.embeds[0]
        
            const author = messages.EMBED_SUGGEST.ACCEPT.ACCEPTED.AUTHOR.replace('<data.author.name>', data.author.name)
            const description = messages.EMBED_SUGGEST.ACCEPT.ACCEPTED.DESCRIPTION.replace('<data.description>', data.description)
            const footer = messages.EMBED_SUGGEST.ACCEPT.ACCEPTED.FOOTER
            const color = messages.EMBED_SUGGEST.ACCEPT.ACCEPTED.COLOR
    
            const field = messages.EMBED_SUGGEST.ACCEPT.FIELDS.FIELD_PART1
            const field2 = messages.EMBED_SUGGEST.ACCEPT.FIELDS.FIELD_PART2
            const field3 = messages.EMBED_SUGGEST.ACCEPT.FIELDS.ACCEPT.FIELD_PART1.replace('<user.tag>', interaction.user.tag)
            const field4 = messages.EMBED_SUGGEST.ACCEPT.FIELDS.ACCEPT.FIELD_PART2.replace('<args.join>', reason)
    
            const accepted = new Discord.MessageEmbed()
                .setAuthor(author)
                .setDescription(description)
                .setColor(color)
                .setFooter(footer, interaction.member.user.displayAvatarURL({dynamic: true}))
                .addField(field3, field4, true)
                .addField(field, field2, true)
                .setTimestamp()
            await suggestedEmbed.edit({embeds: [accepted]})
            .then(async(m) => {
    
                const author = messages.EMBED_SUGGEST.ACCEPT.SEND_ACCEPTED.AUTHOR
                const description = messages.EMBED_SUGGEST.ACCEPT.SEND_ACCEPTED.DESCRIPTION.replace('<args>', messageid)
                const footer = messages.EMBED_SUGGEST.ACCEPT.SEND_ACCEPTED.FOOTER
                const color = messages.EMBED_SUGGEST.ACCEPT.SEND_ACCEPTED.COLOR
    
                const success = new Discord.MessageEmbed()
                    .setAuthor(author)
                    .setDescription(description)
                    .setFooter(footer)
                    .setColor(color)
                await interaction.reply({embeds: [success]})
            })
            } else {
                interaction.reply(messages.MESSAGE_SUGGEST.SUGGEST.SYSTEM_DISABLED)
            }
            } catch(e) {
                console.log(e)

                const error = new Discord.MessageEmbed()
                    .setDescription('`❌` The message id is invalid!')
                    .setColor("RED")
                return interaction.reply({embeds: [error], ephemeral: true})
            }
        } else if (subCommand === "decline") {
            try {
            if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply('You do not have permission to use this command!')

            const system = await db.fetch(`suggest_system_${interaction.guild.id}`) || "true"

            if(system === "true") {
            const messageid = interaction.options.getString('message_id')
            const reason = interaction.options.getString('message')
    
            const channel = db.fetch(`suggestionChannel_${interaction.guild.id}`)
            if(!channel) return interaction.reply(messages.MESSAGE_SUGGEST.SUGGEST.NO_CHANNEL)
    
            const suggestedEmbed = await interaction.guild.channels.cache.get(channel).messages.fetch(messageid)
            const data = suggestedEmbed.embeds[0]
        
            const author = messages.EMBED_SUGGEST.DENY.DENIED.AUTHOR.replace('<data.author.name>', data.author.name)
            const description = messages.EMBED_SUGGEST.DENY.DENIED.DESCRIPTION.replace('<data.description>', data.description)
            const footer = messages.EMBED_SUGGEST.DENY.DENIED.FOOTER
            const color = messages.EMBED_SUGGEST.DENY.DENIED.COLOR
    
            const field = messages.EMBED_SUGGEST.DENY.FIEDLS.FIELD_PART1
            const field2 = messages.EMBED_SUGGEST.DENY.FIEDLS.FIELD_PART2
            const field3 = messages.EMBED_SUGGEST.DENY.FIEDLS.DENY.FIELD_PART1.replace('<user.tag>', interaction.user.tag)
            const field4 = messages.EMBED_SUGGEST.DENY.FIEDLS.DENY.FIELD_PART2.replace('<args.join>', reason)
    
            const denied = new Discord.MessageEmbed()
                .setAuthor(author)
                .setDescription(description)
                .setFooter(footer, interaction.member.user.displayAvatarURL({dynamic : true}))
                .setColor(color)
                .addField(field3, field4, true)
                .addField(field, field2, true)
                .setTimestamp()
            await suggestedEmbed.edit({embeds: [denied]})
            .then(async() => {
                const author = messages.EMBED_SUGGEST.DENY.SEND_DENIED.AUTHOR
                const description = messages.EMBED_SUGGEST.DENY.SEND_DENIED.DESCRIPTION.replace('<args>', messageid)
                const footer = messages.EMBED_SUGGEST.DENY.SEND_DENIED.FOOTER
                const color = messages.EMBED_SUGGEST.DENY.SEND_DENIED.COLOR
    
                const success = new Discord.MessageEmbed()
                    .setAuthor(author)
                    .setDescription(description)
                    .setFooter(footer)
                    .setColor(color)
                await interaction.reply({embeds: [success]})
                })
            } else {
                interaction.reply(messages.MESSAGE_SUGGEST.SUGGEST.SYSTEM_DISABLED)
            }
            } catch(e) {
                const error = new Discord.MessageEmbed()
                    .setDescription('`❌` The message id is invalid!')
                    .setColor("RED")
                return interaction.reply({embeds: [error], ephemeral: true})
            }
        }
    }
}