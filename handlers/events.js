const { readdirSync } = require("fs");

module.exports = (client) => {
  const commands = readdirSync(__dirname.replace("\handlers", "\events")).filter(file => file.endsWith(".js"));

  for (let file of commands) {
    try {
    let pull = require(`${__dirname.replace("\handlers", "\events")}/${file}`);
    if (pull.event && typeof pull.event !== "string") {
      continue;
    }
        pull.event = pull.event || file.replace(".js", "")
        client.on(pull.event, pull.run.bind(null, client))
    } catch(err) {
        console.log(err)
        console.log("Error While loading")
    }
  }
}