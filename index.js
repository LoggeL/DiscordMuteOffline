const { Client, GatewayIntentBits } = require('discord.js')
const { roleName, token, deny } = require('./config.json')

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences],
})

client.on('ready', () => {
  console.log(
    `Logged in as ${client.user.tag}! Watching ${client.guilds.cache.size} guilds!`
  )

  // Check for offline role
  for (const [guildId, guild] of client.guilds.cache) {
    const offlineRole = guild.roles.cache.find((role) => role.name === roleName)
    if (!offlineRole) {
      console.log(`Offline role not found in guild ${guild.name} (${guildId})`)
      // Create role
      guild.roles
        .create({
          name: roleName,
          // decimal grey
          color: 8421504,
          reason: 'Offline role',
          permissions: 0n,
        })
        .then((role) => console.log(`Created role ${role.name} (${role.id})`))
        .catch(console.error)
    }
  }
})

client.on('presenceUpdate', (oldPresence, newPresence) => {
  // Get status
  const newStatus = newPresence.status
  const oldStatus = oldPresence.status

  if (newStatus === oldStatus) return

  // Check if status is offline
  if (newStatus == 'offline' && oldStatus != 'offline') {
    // User went offline
    const guild = newPresence.guild
    const member = newPresence.member
    const offlineRole = guild.roles.cache.find((role) => role.name === roleName)

    if (!offlineRole) {
      console.log(`Offline role not found in guild ${guild.name} (${guild.id})`)
      // Create role
      guild.roles
        .create({
          name: roleName,
          // decimal grey
          color: 8421504,
          reason: 'Offline role',
          permissions: 0n,
        })
        .then((role) => console.log(`Created role ${role.name} (${role.id})`))
        .catch(console.error)
      return
    }

    // Add offline role
    member.roles
      .add(offlineRole)
      .then(() =>
        console.log(`Added role ${offlineRole.name} to ${member.user.tag}`)
      )
      .catch(console.error)
  } else if (newStatus != 'offline' && oldStatus == 'offline') {
    // User came online
    const guild = newPresence.guild
    const member = newPresence.member
    const offlineRole = guild.roles.cache.find((role) => role.name === roleName)

    if (!offlineRole) {
      console.log(`Offline role not found in guild ${guild.name} (${guild.id})`)
      // Create role
      guild.roles
        .create({
          name: roleName,
          // decimal grey
          color: 8421504,
          reason: 'Offline role',
          permissions: 0n,
        })
        .then((role) => console.log(`Created role ${role.name} (${role.id})`))
        .catch(console.error)
      return
    }

    // Remove offline role
    member.roles
      .remove(offlineRole)
      .then(() =>
        console.log(`Removed role ${offlineRole.name} from ${member.user.tag}`)
      )
      .catch(console.error)
  }
})

client.login(token)
