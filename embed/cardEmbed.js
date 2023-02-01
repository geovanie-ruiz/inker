const { EmbedBuilder } = require('discord.js');
const { getCardsById, getCardsByName } = require('../api/cards');

function tempAddRarity(card) {
	const rarities = ['common', 'uncommon', 'rare', 'ultrarare', 'legendary'];
	const rarityIndex = Math.floor(Math.random() * rarities.length);
	const rarityName = rarities[rarityIndex];
	card.rarity = rarityName;
}

function tempParser(card, tap, ink, pip) {
	const bold = /<b>([^\]]+)<\/b>/g;
	const mark = /<mark>([^\]]+)<\/mark>/g;
	const italic = /<i>([^\]]+)<\/i>/g;

	return card.abilities.map((markedUpAbility) => {
		let ability = markedUpAbility
			.replace('*', ink)
			.replace('⬡', ink)
			.replace('◆', pip)
			.replace('↷', tap)
			.replace('<br>', '\r\n\r\n')
			.replace('<br />', '\r\n\r\n');

		const bm = ability.match(bold);
		if (bm) {
			bm.forEach((match) => {
				const value = match.replace(/<\/?b>/g, '');
				ability = ability.replace(match, `**${value}**`);
			});
		}

		const mm = ability.match(mark);
		if (mm) {
			mm.forEach((match) => {
				const value = match.replace(/<\/?mark>/g, '');
				ability = ability.replace(match, `\`${value}\``);
			});
		}

		const im = ability.match(italic);
		if (im) {
			im.forEach((match) => {
				const value = match.replace(/<\/?i>/g, '');
				ability = ability.replace(match, `*${value}*`);
			});
		}

		return ability;
	});
}

function makeCharacterEmbed(card) {
	/*
     * Inject rarity; remove this
     */
	tempAddRarity(card);

	/*
     * Get emojis; refactor this
     */
	// Get Pips
	const pipEmoji = global.client.emojis.cache.find((emoji) => emoji.name === 'pip');
	const pip = `<:${pipEmoji.name}:${pipEmoji.id}> `;

	// Get color symbol
	const colorEmoji = global.client.emojis.cache.find((emoji) => emoji.name === card.ink.toLowerCase());
	const color = `<:${colorEmoji.name}:${colorEmoji.id}>`;

	// Get rarity symbol
	const rarityEmoji = global.client.emojis.cache.find((emoji) => emoji.name === card.rarity.toLowerCase());
	const rarity = `<:${rarityEmoji.name}:${rarityEmoji.id}>`;

	// Get tap symbol
	const tapEmoji = global.client.emojis.cache.find((emoji) => emoji.name === 'tap');
	const tap = `<:${tapEmoji.name}:${tapEmoji.id}>`;

	// Get ink honeycomb
	const inkEmoji = global.client.emojis.cache.find((emoji) => emoji.name === 'ink');
	const ink = `<:${inkEmoji.name}:${inkEmoji.id}>`;

	/*
     * Parse HTML; remove this
     */
	const abilities = tempParser(card, tap, ink, pip);

	return new EmbedBuilder()
		.setColor(card.colorCode)
		.setTitle(`[${card.cost}] ${card.character}, ${card.descriptor}`)
		.setURL(card.cardURL)
		.setDescription(`Attack ${card.atk} ‧ Defense ${card.def} ‧ ${pip.repeat(card.lore)}`)
		.addFields(
			{ name: 'Ink', value: `${card.ink} ${color}`, inline: true },
			{ name: 'Type', value: card.types.join(' ‧ '), inline: true },
			{ name: 'Abilities', value: abilities.join('\r\n'), inline: false },
			{ name: 'Flavor', value: card.flavor, inline: false },
			{
				name: 'Set',
				value: `${card.set.code} ‧ ${card.set.language} ‧ ${card.set.number}`,
				inline: true,
			},
			{ name: 'Rarity', value: rarity, inline: true },
			{ name: 'Artist', value: card.artist ? card.artist : 'Unknown', inline: true },
		)
		.setThumbnail(card.thumbnail)
		.setTimestamp()
		.setFooter({
			text: 'Brought to you by Lorcania',
			iconUrl: 'https://lorcania.com/images/lorcana/logo.jpeg',
		});
}

function makeActionEmbed(card) {
	/*
     * Inject rarity; remove this
     */
	tempAddRarity(card);

	/*
     * Get emojis; refactor this
     */
	// Get color symbol
	const colorEmoji = global.client.emojis.cache.find((emoji) => emoji.name === card.ink.toLowerCase());
	const color = `<:${colorEmoji.name}:${colorEmoji.id}>`;

	// Get rarity symbol
	const rarityEmoji = global.client.emojis.cache.find((emoji) => emoji.name === card.rarity.toLowerCase());
	const rarity = `<:${rarityEmoji.name}:${rarityEmoji.id}>`;

	// Get tap symbol
	const tapEmoji = global.client.emojis.cache.find((emoji) => emoji.name === 'tap');
	const tap = `<:${tapEmoji.name}:${tapEmoji.id}>`;

	/*
     * Parse HTML; remove this
     */
	const abilities = tempParser(card, tap);

	return new EmbedBuilder()
		.setColor(card.colorCode)
		.setTitle(`[${card.cost}] ${card.character}, ${card.descriptor}`)
		.setURL(card.cardURL)
		.addFields(
			{ name: 'Ink', value: `${card.ink} ${color}`, inline: true },
			{ name: 'Type', value: card.types.join(' ‧ '), inline: true },
			{ name: 'Abilities', value: abilities.join('\r\n'), inline: false },
			{ name: 'Flavor', value: card.flavor, inline: false },
			{
				name: 'Set',
				value: `${card.set.code} ‧ ${card.set.language} ‧ ${card.set.number}`,
				inline: true,
			},
			{ name: 'Rarity', value: rarity, inline: true },
			{ name: 'Artist', value: card.artist, inline: true },
		)
		.setThumbnail(card.thumbnail)
		.setTimestamp()
		.setFooter({
			text: 'Brought to you by Lorcania',
			iconUrl: 'https://lorcania.com/images/lorcana/logo.jpeg',
		});
}

function makeEmbed(card) {
	if (!card) return;

	// Build embed
	let embed;

	// To-Do: Figure out how to distinguish card types
	if (card.types.length > 0) {
		if (card.types.includes('Action')) {
			embed = makeActionEmbed(card);
		}
		else {
			embed = makeCharacterEmbed(card);
		}
	}
	else {
		card.types[0] = 'None';
		embed = makeCharacterEmbed(card);
	}

	return embed;
}

async function getCardFromId(id) {
	return getCardsById(id).then(card => {
		return makeEmbed(card);
	});
}

async function getCardFromName(cardName) {
	return getCardsByName(cardName).then(cards => {
		if (cards.length <= 10 && cards.length > 0) {
			const character = cards[0].character;

			// Return the first character found if all characters are the same
			// If multiple characters returned, fail
			if (cards.length === 1 || cards.every((card) => { return card.character === character; })) {
				return makeEmbed(cards[0]);
			}
		}
		return undefined;
	});
}

module.exports = { getCardFromName, getCardFromId };