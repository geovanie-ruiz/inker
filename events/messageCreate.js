const { getCardFromName } = require('../embed/cardEmbed');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author.bot) return;

		// use regex to find the pattern [[term]]
		const pattern = /\[\[([^\]]+)\]\]/g;
		const matches = message.content.match(pattern);

		// Make requests for all matches found in message
		const promises = [];
		if (matches) {
			matches.forEach((match) => {
				// Clean up brackets from search term and make the request
				match = match.replace(/\[/g, '').replace(/\]/g, '');
				promises.push(getCardFromName(match));
			});
		}

		// Resolve all promises and iterate through each result sending the embed
		Promise.all(promises)
			.then(embeds => {
				if (embeds) {
					embeds.forEach((embed) => {
						if (embed) {
							message.channel.send({ embeds: [embed] });
						}
					});
				}
			})
			.catch((err) => console.log(err));
	},
};
