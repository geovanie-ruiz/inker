const {
	SlashCommandBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
} = require('discord.js');
const { getCardsByTerm } = require('../api/cards');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('card')
		.setDescription('Search for a Lorcana card.')
		.addStringOption(option =>
			option.setName('term')
				.setDescription('Search term to use.')
				.setRequired(true),
		)
		.addBooleanOption(option =>
			option.setName('ephemeral')
				.setDescription('Set to true to make the message visible only to you.')
				.setRequired(false),
		),
	async execute(interaction) {
		const term = interaction.options.getString('term');
		const ephemeral = interaction.options.getBoolean('ephemeral');

		const options = await getCardsByTerm(term).map(card => {
			return {
				label: card.character,
				description: card.descriptor,
				value: card.id,
			};
		});

		const select = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('cardChoice')
					.setPlaceholder('Nothing selected')
					.addOptions(options),
			);

		await interaction.reply({ content: 'Select a specific card', components: [select], ephemeral: ephemeral });
	},
};