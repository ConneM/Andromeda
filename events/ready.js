const client = require("../index");
const ms = require('ms');
const eventFiles = require("../handlers/events")

module.exports.run = ("ready", async () => {

  try {
    let status = [[{name: `find the andromeda galaxy`, type: "PLAYING"}], [{name: `the andromeda galaxy`, type: "WATCHING"}]]
    setInterval(() => {
      function randomStatus() {
        let rStatus = status[Math.floor(Math.random() * status.length)]
        client.user.setPresence({activity: rStatus[0], status: rStatus[1]})
      }
      randomStatus()
    }, ms("30s"))
    console.log(" ")
    console.log(" Loaded \x1b[31m" + client.commands.size + "\x1b[0m Commands");
    console.log(" Loaded \x1b[31m" + eventFiles.length + "\x1b[0m Events");
    console.log(" Loaded \x1b[31m" + client.slash.size + "\x1b[0m Slash Commands");
    console.log(" ")
    console.log(` (${client.user.tag}) has been conected`)
    console.log(" ")
  } catch (error) {
    console.log(error)
  }
})