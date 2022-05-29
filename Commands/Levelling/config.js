const { MessageEmbed } = require('discord.js')
const setupSchema = require('../../Structures/Models/setup-schema')
const levelrewardSchema = require('../../Structures/Models/levelReward-schema')

module.exports = {
    name: 'config',
    description: 'Setup the bot.',
    permission: 'ADMINISTRATOR',
    options: [
        {
            name: 'view',
            description: 'View the current setup',
            type: 'SUB_COMMAND'
        },
        {
            name: 'reset',
            description: 'Reset the config',
            type: 'SUB_COMMAND',
        },
        {
            name: 'rankcard',
            description: 'Change the servers levelling display',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'enabled',
                    description: 'Is the rank card enabled',
                    type: 'BOOLEAN',
                    required: true,
                },
            ],
        },
        {
            name: 'level',
            description: 'Manage levelling rewards',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'add-reward',
                    description: 'Add a levelling reward',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'level',
                            description: 'The level required to get this role',
                            type: 'NUMBER',
                            required: true,
                        },
                        {
                            name: 'reward',
                            description: 'The reward for reaching this level',
                            type: 'ROLE',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove-reward',
                    description: 'Remove a leveling reward',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'role',
                            description: 'The role to remove',
                            type: 'ROLE',
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
    async execute(interaction) {
            
        if (interaction.options.getSubcommand() === 'view') {
            const doc = await setupSchema.findOne({
                guildId: interaction.guild.id
            })
            if (!doc) {
                setupSchema.create({guildId: interaction.guild.id})
                return `I couldn't find this server in my database. Please try again`
            }
            const rewards = await levelrewardSchema.find({guildId: interaction.guild.id})
            if (!rewards) {
                levelrewardSchema.create({guildId: interaction.guild.id})
                return `I couldn't find this server in my database. Please try again`
            }

            var description = `**Level Rewards**\n`
            for (const reward of rewards) {
                description += `Level ${reward.level} - ${reward.role}\n`
            }

            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Bot Settings')
            .setDescription(description)
            .setFields(
                {name: `Support Role`, value: `${doc.supportId ? `<@&${doc.supportId}>` : 'None'}`, inline: true},
                {name: `Support Category`, value: `${doc.supportCatId ? `<#${doc.supportCatId}>` : 'None'}`, inline: true},
                {name: 'Moderation Code', value: `${doc.code ? `\`${doc.code}\`` : 'None'}`, inline: true},
                {name: 'Rank Card Enabled', value: doc.rankCard ? 'Yes' : 'No', inline: true},
                {name: 'Server Invite', value: `${doc.guildInvite || 'None'}`, inline: true},
                {name: 'Server Appeal Form', value: `${doc.guildAppeal || 'None'}`},
                {name: 'Admin Role', value: `${doc.adminRoleId ? `<@&${doc.adminRoleId}>` : 'None'}`, inline: true},
                {name: 'Moderator Role', value: `${doc.modRoleId ? `<@&${doc.modRoleId}>` : 'None'}`, inline: true},
            )

            interaction.reply({embeds: [embed]})
        }
        else if (interaction.options.getSubcommand() === 'rankcard') {
            const doc = await setupSchema.findOneAndUpdate({
                guildId: interaction.guild.id
            }, {
                rankCard: interaction.options.getBoolean('enabled')
            })
            if(!doc) {
                await setupSchema.create({guildId: interaction.guild.id})
            }
            interaction.reply({
                content: `Rank card set to: ${interaction.options.getBoolean('enabled')}`,
                ephemeral: true,
            })
        }
        else if (interaction.options.getSubcommand() === 'moderation-code') {
            const newCode = interaction.options.getString('set')

            const doc = await setupSchema.findOneAndUpdate({
                guildId: interaction.guild.id
            }, {
                code: newCode,
            })
            if(!doc) {
                await setupSchema.create({guildId: interaction.guild.id, code: '0000'})
            }
            interaction.reply({
                content: `The moderation code has been updated to ||\`${newCode}\`||. It used to be ||\`${doc.code}\`||`,
                ephemeral: true,
            })
        }

        else if (interaction.options.getSubcommand() === 'reset') {
            const result = await setupSchema.findOne({guildId: interaction.guild.id})
            if (result) {
                result.delete()
                levelrewardSchema.collection.deleteMany({guildId: interaction.guild.id})
                interaction.reply('Reset the config data')
            } else {
                interaction.reply('No config data')
            }
        }
        else if (interaction.options.getSubcommandGroup() === 'level') {
            if (interaction.options.getSubcommand() === 'add-reward') {
                levelrewardSchema.create({
                    guildId: interaction.guild.id,
                    level: interaction.options.getNumber('level'),
                    role: interaction.options.getRole('reward')
                })
                interaction.reply({content: `Level ${interaction.options.getNumber('level')} will reward ${interaction.options.getRole('reward')}`, ephemeral: true})
            } else {
                const result = await levelrewardSchema.findOne({guildId: interaction.guild.id, role: interaction.options.getRole('role')})
                if (!result) {
                    return `Could not find a level reward with that role`
                }
                result.delete()
                interaction.reply('Deleted!')
            }
        }
}
}