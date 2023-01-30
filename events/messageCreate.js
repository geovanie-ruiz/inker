const { EmbedBuilder } = require('discord.js');

// HTML client
const { request } = require('undici');

function makeEmbed(client, card) {
	// Get Pips
	const pipEmoji = client.emojis.cache.find((emoji) => emoji.name === 'pip');
	const pip = `<:${pipEmoji.name}:${pipEmoji.id}> `;
	const loreCounters = pip.repeat(card.lore);

	// Get color symbol
	const colorEmoji = client.emojis.cache.find(
		(emoji) => emoji.name === card.ink.toLowerCase(),
	);
	const color = `<:${colorEmoji.name}:${colorEmoji.id}>`;

	// Build embed
	const embed = new EmbedBuilder()
		.setColor(`#${card.colorCode}`)
		.setTitle(`[${card.cost}] ${card.character}, ${card.descriptor}`)
		.setURL(card.cardURL)
		.setDescription(`Atk ${card.atk} ‧ Def ${card.def} ‧ Lore ${loreCounters}`)
		.addFields(
			{ name: 'Ink', value: `${card.ink} ${color}`, inline: true },
			{ name: 'Type', value: card.types.join(' ‧ '), inline: true },
			{ name: 'Abilities', value: card.abilities.join('\r\n'), inline: false },
			{ name: 'Flavor', value: card.flavor, inline: false },
			{
				name: 'Set',
				value: `${card.set.code} ‧ ${card.set.language} ‧ ${card.set.number}`,
				inline: true,
			},
			{ name: 'Artist', value: card.artist, inline: true },
		)
		.setThumbnail(card.thumbnail)
		.setTimestamp()
		.setFooter({
			text: 'Brought to you by Lorcania',
			iconUrl: process.env.logoIconURL,
		});
	return embed;
}

async function getCards(body) {
	let fullBody = '';
	for await (const data of body) {
		fullBody += data.toString();
	}
	return JSON.parse(fullBody).cards;
}

async function makePromise(client, cardName) {
	const apiUrl = `${process.env.apiHost}/${process.env.apiSearchResource}?name=${cardName}`;
	const searchResult = await request(apiUrl);
	const cards = await getCards(searchResult.body);

	cards.forEach((card) => {
		console.log('Card info...');
		console.log(card);
	});

	const card = {
		colorCode: 'FF0000',
		cost: '8',
		character: 'Mickey Mouse',
		descriptor: 'Brave Little Tailor',
		cardURL: 'https://lorcania.com/cards/1',
		atk: '5',
		def: '5',
		lore: '4',
		ink: 'Ruby',
		types: ['Dreamborn', 'Hero'],
		abilities: [
			'Evasive (Only characters with Evasive can challenge this character.)',
		],
		flavor:
			'When defeat looms and victory hangs by a thread, a hero bolts to the rescue, patching things up through shear determination.',
		set: {
			code: '1TFC',
			language: 'EN',
			number: '1/P1',
		},
		thumbnail: 'https://images.lorcania.com/cards/d23/1_en_mickey-400.webp',
		artist: 'Nicholas Kole',
	};

	return makeEmbed(client, card);
}

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
				promises.push(makePromise(message.client, match));
			});
		}

		// Resolve all promises and iterate through each result sending the embed
		Promise.all(promises)
			.then((embeds) => {
				embeds.forEach((embed) => {
					message.channel.send({ embeds: [embed] });
				});
			})
			.catch((err) => console.log(err));
	},
};
