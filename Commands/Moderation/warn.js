const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const warnModel = require("../../Structures/Models/warnModel")

module.exports = {
    name: "warn",
    description: "warn a user",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "target",
            description: "Provide a user to warn.", // Change able
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Provide a reason to warn this user", //Change able.
            type: "STRING",
        },
    ],

   /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        const { options, guild } = interaction;
        const reason        = options.getString("reason") || "No reason provided";
        const target      = options.getMember("target");


        new warnModel({
            userId: target.id,
            guildId: interaction.guild.id,
            moderatorId: interaction.user.id,
            reason,
        }).save();


        const Embed = new MessageEmbed()
        .setTitle("⚠️ Warning ⚠️")
        .setDescription(`Warned ${target} reason:\`${reason}\``)
        let message = interaction.reply({embeds: [Embed]})

        const DM = new MessageEmbed()
        .setTitle("⚠️ Warning ⚠️")
        .setDescription(`You have been warned on ${interaction.guild.name}, reason:\`${reason}\``)

        target.send({embeds: [DM]}).catch(()=>{console.log("⛔ Private message blocked by the user")});

        const log = new MessageEmbed()
        .setTitle("Logs | ⚠️ Warn ⚠️")
        .addFields(
            { name: "🔒 Action", value: "Warn" },
            { name: "📘 Author", value: `${interaction.member}` },
            { name: "👾 Member", value: `${target}` },
            { name: "📚 Reason", value: `${reason}` },
        )
        .setColor("YELLOW")
        
        await guild.channels.cache.get("936829760330403901").send({ embeds: [log] });
       
    }
}