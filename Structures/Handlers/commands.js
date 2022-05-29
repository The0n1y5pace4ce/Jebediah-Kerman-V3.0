const { Client } = require("discord.js");
const { GUILDID } = require("../../Structures/config.json");
const { Perms } = require("../Validation/Permissions");
const Permissions = require("discord.js").Permissions;
/**
 *
 * @param {Client} client
 */
 module.exports = async (client, PG, Ascii) => {
  const Table = new Ascii("Commands Loaded");

  let CommandsArray = [];

  (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async (file) => {
    const command = require(file);

    if (!command.name)
      return Table.addRow(
        `At ${file.split ("/")[7]}`,
        "🔸 FAILED",
        `missing a name.`
      );

    if (!command.type && !command.description)
      return Table.addRow(command.name, "🔸 FAILED", "missing a description.");

    if (command.permission) {
      if (Perms.includes(command.permission)) {
        command.default_member_permissions =
        (Array.isArray(command.permissions) && command.permissions.length > 0) ?
          new Permissions(command.permissions).bitfield.toString() :
          null;
        
      }
      else
        return Table.addRow(
          command.name,
          "🔸 FAILED",
          `permission is invalid.`
        );
        }

    client.commands.set(command.name, command);
    CommandsArray.push(command);

    await Table.addRow(command.name, "🔹 SUCCESSFUL");
  });

  console.log(Table.toString()
)}