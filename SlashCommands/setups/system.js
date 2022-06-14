const Discord = require("discord.js");
const db = require("quick.db");
const yaml = require("js-yaml");
const fs = require("fs");
const messages = yaml.load(fs.readFileSync("./configs/messages.yml", "utf8", 2));

module.exports = {
    name: "system",
    description: "Get a list of systems",
    options: [
        {
            name: "systems",
            description: "Get a list of systems",
            type: "STRING",
            choices: [
                {
                    name: "suggest_system",
                    value: "suggest_system"
                },
            ],
            required: true
        },
        {
            name: "value",
            description: "Get the value of the system",
            type: "STRING",
            choices: [
                {
                    name: "true",
                    value: "true"
                },
                {
                    name: "false",
                    value: "false"
                }
            ],
            required: true
        }
    ],

    run: async(client, interaction, args) => {

        try {
        const { options } = interaction;
        
        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: messages["NO_PERMS"], ephemeral: true})

        const systems =  options.getString("systems");
        const value = options.getString("value");

        db.set(`suggest_system_${interaction.guild.id}`, systems === "suggest_system" ? value : value )

        if (systems === "suggest_system") {
            const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor("Suggestion System")
            .setDescription(`\`💡\` Suggestion system has been set to **${value}**`)

            interaction.reply({ embeds: [embed] })
        }
        } catch (err) {
            console.log(err);
        }
    }
}