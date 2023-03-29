require('dotenv').config()
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMessageReactions, 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
      ], });

const token = process.env.DISCORD_BOT_TOKEN || '';

const allowedRoles = {
    '🕸️': 'Fullstack Dev',
    '🖥️': 'Backend Dev',
    '👨‍💻': 'Frontend Dev',
    '🎨': 'Designer',
    '📋': 'Product Manager'
};

const editRoles = (action = 'add') => async (reaction, user) => {
    if (user.bot) return;

    const roleName = allowedRoles[reaction.emoji.name];
    if (!roleName || reaction.message.id !== '1090245764791410761') return;

    const role = reaction.message.guild.roles.cache.find(role => role.name === roleName);
    if (!role) {
        console.log(`${roleName} role not found in the server.`);
        return;
    }

    const member = await reaction.message.guild.members.fetch(user.id);
    if (!member) {
        console.log('Member not found in the server.');
        return;
    }

    if(action === 'add') { 
        if(member.roles.cache.find(r => r.name === roleName)) return;
        await member.roles.add(role);
    } else if(action === 'remove') {
        if(!member.roles.cache.find(r => r.name === roleName)) return;
        await member.roles.remove(role);
    }

    console.log(`${action === 'add' ? 'Added' : 'Removed'} ${roleName} role to ${user.username}`);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageReactionAdd', editRoles('add'));

client.on('messageReactionRemove', editRoles('remove'));

client.login(token);
