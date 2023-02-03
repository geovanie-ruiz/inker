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
		),
	async execute(interaction) {
		const term = interaction.options.getString('term');
		const cards = await getCardsByTerm(term);
		const options = cards.map(card => {
			let label;
			if (card.descriptor) {
				label = `${card.character}, ${card.descriptor}`;
			}
			else {
				label = `${card.character}`;
			}
			return {
				label: label,
				description: `Set: ${card.set}`,
				value: `${card.id}`,
			};
		});

		if (options.length > 0) {
			const select = new ActionRowBuilder()
				.addComponents(
					new StringSelectMenuBuilder()
						.setCustomId('cardChoice')
						.setPlaceholder('Nothing selected')
						.addOptions(options),
				);

			await interaction.reply({ content: 'Select a specific card', components: [select], ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'No cards found.', ephemeral: true });
		}
	},
};