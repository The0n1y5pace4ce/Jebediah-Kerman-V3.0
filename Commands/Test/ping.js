const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Ping command',
    cooldown: 10,
    permission: 'ADMINISTRATOR',
    botPerms: 'ADMINISTRATOR',

    execute(interaction, client) {
        const embed = new MessageEmbed()
        .setDescription(`Pong! ${client.ws.ping}`)
        .setColor('DARK_BUT_NOT_BLACK')

        interaction.reply({ embeds: [embed]})
    }
}