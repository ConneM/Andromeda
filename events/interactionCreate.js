module.exports.run = ('interactionCreate', async (client, interaction) => {

    try {
    if (interaction.isCommand()) {
        //await interaction.deferReply({ ephemeral: false })
        const command = client.slash.get(interaction.commandName);
        if (!command) return;

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === 'SUB_COMMAND') {
                if (option.name) args.push(option.name);
                option.options?.forEach(x =>  {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
            command.run(client, interaction, args)  
    }
    } catch (e) {
        console.log(e);
        return interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
    }
})