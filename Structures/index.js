const { Client, Collection } = require('discord.js');
const client = new Client({intents: 32767});
const { Mongoose } = require('mongoose');
const { Token } = require('../Structures/config.json');
const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const { table } = require('console');
const PG = promisify(glob);
const path = require('path');
const fs = require('fs');

client.commands = new Collection();
client.prefix = new Collection();
client.cooldowns = new Collection();

["Events", "Command"].forEach((handler) => {
    require(`../Structures/Handlers/${handler}`)(client, PG, Ascii);
});
// require('./Handlers/PrefixHandler')(client, Ascii);

client.on('ready', async () => {
    const baseFile = 'CommandBase.js'
  const commandBase = require(`../PrefixCommands/${baseFile}`)

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file))
        commandBase(client, option)
      }
    }
  }

  readCommands('../PrefixCommands')
})

client.login(Token)