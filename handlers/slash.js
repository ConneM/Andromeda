let slash = []
const { readdirSync } = require("fs");

module.exports = (client) => {
    readdirSync("./SlashCommands/").forEach(dir => {
        const commands = readdirSync(`./SlashCommands/${dir}/`).filter(file => file.endsWith(".js"));
    
        for (let file of commands) {
            let pull = require(`../SlashCommands/${dir}/${file}`);
            if (pull.name) {
                client.slash.set(pull.name, pull);
                slash.push(pull);
            } else {
                continue;
            }
        }
    });
client.on("ready",async ()=> {
        await client.application.commands.set(slash)
    })
}