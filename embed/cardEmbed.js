const { EmbedBuilder } = require('discord.js');
const { getCardsById, getCardsByName } = require('../api/cards');

function makeEmbed(card) {
	// Get Pips
	const pipEmoji = global.client.emojis.cache.find((emoji) => emoji.name === 'pip');
	const pip = `<:${pipEmoji.name}:${pipEmoji.id}> `;
	const loreCounters = pip.repeat(card.lore);

	// Get color symbol
	const colorEmoji = global.client.emojis.cache.find(
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
			iconUrl: 'https://lorcania.com/images/lorcana/logo.jpeg',
		});

	return embed;
}

async function getCardFromId(id) {
	return getCardsById(id).then(card => {
		return makeEmbed(card);
	});
}

async function getCardFromName(cardName) {
	return getCardsByName(cardName).then(card => {
		return makeEmbed(card);
	});
}

module.exports = { getCardFromName, getCardFromId };