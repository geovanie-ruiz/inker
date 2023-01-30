const { getCardFromId } = require('../embed/cardEmbed');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) return;
			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}

		if (interaction.isStringSelectMenu()) {
			// value returns as a single-index list
			const selectedId = interaction.values[0];
			getCardFromId(interaction.client, selectedId)
				.then((embed) => {
					interaction.update({ content: '', embeds: [embed], components: [] });
				})
				.catch((err) => console.log(err));
		}
	},
};
