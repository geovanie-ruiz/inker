require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.token);

// and deploy your commands!
(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`,
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
			{ body: commands },
		);

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`,
		);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

// for guild-based commands
// rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: [] })
// 	.then(() => console.log('Successfully deleted all guild commands.'))
// 	.catch(console.error);

// for global commands
// rest.put(Routes.applicationCommands(process.env.clientId), { body: [] })
// 	.then(() => console.log('Successfully deleted all application commands.'))
// 	.catch(console.error);
