const { Client, CommandInteraction, MessageEmbed, interaction } = require("discord.js");
const { Devs } = require('../../Structures/config.json');
const ms = require('ms-prettify')
const cooldown = new Set();


module.exports = {
    name: "interactionCreate",
     /**
         * @param {CommandInteraction} interaction
         * @param {Client} client
         */
    async execute(interaction, client) {
        
        if(interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if(!command) return interaction.reply({embeds: [
                new MessageEmbed()
                .setColor("RED")
                .setDescription("⛔️ An error occurred while running this command")
            ]}) && client.commands.delete(interaction.commandName);

            if(command.devsOnly === true) {  
                if(!devs.includes(interaction.member.id)) return interaction.reply({ content: "You can't use this command!", ephemeral: true});
            }
             

            command.execute(interaction, client)
        }
    }
}