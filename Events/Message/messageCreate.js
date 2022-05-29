const levelSchema = require('../../Structures/Models/level-schema') //Change this
const levelrewardSchema = require('../../Structures/Models/levelReward-schema')

module.exports = {
  name: 'messageCreate',
  async execute(message) {
  if(message.channel.type === 'DM') return; 
  if(message.author.bot) return;

      levelSchema.findOne({guildId: message.guild.id, userId: message.author.id}, async(err, result)=>{
          if(!result) {
          levelSchema.create({
          guildId: message.guild.id,
          userId: message.author.id,
          xp: 0,
          level: 0,
          role: 0
          })
          }
          
          });
      const today = new Date()


      if(today.getDay() == 6 || today.getDay() == 0) {
          const rand = Math.round(Math.random() * 3)
          if (rand === 0) {
              const give = Math.floor(Math.random() * 75) * 2
              //console.log(give, `mult`)
              const data = await levelSchema.findOne({
                  guildId: message.guild.id,
                  userId: message.author.id
              });

              const requiredXp = data.level * 500 + 100
              if (data.xp + give >= requiredXp) {
                  data.xp = 0;
                  data.level += 1
                  data.save()
                  message.channel.send(`${message.author}, You have leveled up to **Level ${data.level}** (Since its the weekend you get double xp. You are also more likely to get some)`)
              } else {
                  data.xp += give;
                  data.save();
              }
              const nextRoleCheck = await levelrewardSchema.findOne({guildId: message.guild.id, level: data.level})
              if (nextRoleCheck) {
                  const levelRole = nextRoleCheck.role.replace(/[<@!&>]/g, '')
                  const userLevel = await levelSchema.findOne({guildId: message.guild.id, userId: message.author.id})
                  const prevRoleId = userLevel.role
                  if (message.member.roles.cache.has(levelRole)) {
                      return
                  } else {
                      message.member.roles.remove(prevRoleId).catch((err => {}))
                      message.member.roles.add(levelRole)
                  
                      userLevel.role = levelRole
                      userLevel.save()
                  }
              }
              
          }
          
      } else {
          const rand = Math.round(Math.random() * 4)
          if (rand === 0) {
              const give = Math.floor(Math.random() * 75)
              const data = await levelSchema.findOne({
                  guildId: message.guild.id,
                  userId: message.author.id
              });

              const requiredXp = data.level * 500 + 100
              if (data.xp + give >= requiredXp) {
                  data.xp = 0;
                  data.level += 1
                  data.save()
                  message.channel.send(`${message.author}, You have leveled up to **Level ${data.level}**`)
              } else {
                  data.xp += give;
                  data.save();
              }
              const nextRoleCheck = await levelrewardSchema.findOne({guildId: message.guild.id, level: data.level})
              if (nextRoleCheck) {
                  const levelRole = nextRoleCheck.role.replace(/[<@!&>]/g, '')
                  const userLevel = await levelSchema.findOne({guildId: message.guild.id, userId: message.author.id})
                  const prevRoleId = userLevel.role
                  if (message.member.roles.cache.has(levelRole)) {
                      return
                  } else {
                      message.member.roles.remove(prevRoleId).catch((err => {}))
                      message.member.roles.add(levelRole)
                  
                      userLevel.role = levelRole
                      userLevel.save()
                  }
              }
              
          }
      }
    }
  }