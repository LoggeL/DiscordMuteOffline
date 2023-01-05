const { Client, GatewayIntentBits } = require('discord.js')
const { roleName, token, watchGuildID } = require('./config.json')

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences],
})

client.on('ready', () => {
  console.log(
    `Logged in as ${client.user.tag}! Watching ${client.guilds.cache.size} guilds!`
  )

  if (watchGuildID) console.log(`Watching guild ${watchGuildID}`)

  // Check for offline role
  for (const [guildId, guild] of client.guilds.cache) {
    if (watchGuildID && guild.id !== watchGuildID) continue

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

    // Check for offline members
    for (const [memberId, member] of guild.members.cache) {
      if (!member.presence || member.presence.status === 'offline') {
        // Add offline role
        member.roles
          .add(offlineRole)
          .then(() =>
            console.log(`Added role ${offlineRole.name} to ${member.user.tag}`)
          )
          .catch(console.error)
      } else {
        // Remove offline role
        member.roles
          .remove(offlineRole)
          .then(() =>
            console.log(
              `Removed role ${offlineRole.name} from ${member.user.tag}`
            )
          )
          .catch(console.error)
      }
    }
  }
})

client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (watchGuildID && newPresence.guild.id !== watchGuildID) return

  // Get status
  const newStatus = newPresence.status
  const oldStatus = oldPresence.status

  if (newStatus === oldStatus) return

  if (!newStatus) return console.log('No new status found!')
  if (!oldStatus) return console.log('No old status found!')

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
