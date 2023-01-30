const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('card')
		.setDescription('Search for a Lorcana card.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};