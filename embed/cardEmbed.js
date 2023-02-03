const { EmbedBuilder } = require('discord.js');
const { getCardsById, getCardsByName } = require('../api/cards');

function makeCharacterEmbed(card) {
	return new EmbedBuilder()
		.setColor(card.colorCode)
		.setTitle(`[${card.cost}] ${card.character}, ${card.descriptor}`)
		.setURL(card.cardURL)
		.setDescription(`Attack ${card.atk} ‧ Defense ${card.def} ‧ ${card.loreIcon}`)
		.addFields(
			{ name: 'Ink', value: `${card.ink} ${card.inkIcon}`, inline: true },
			{ name: 'Type', value: card.types.join(' ‧ '), inline: true },
			{ name: 'Abilities', value: card.abilityMarkdown.join('\r\n'), inline: false },
			{ name: 'Flavor', value: card.flavor ? card.flavor : 'None', inline: false },
			{
				name: 'Set',
				value: `${card.set.code} ‧ ${card.set.language} ‧ ${card.set.number}`,
				inline: true,
			},
			{ name: 'Rarity', value: card.rarity, inline: true },
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
	return new EmbedBuilder()
		.setColor(card.colorCode)
		.setTitle(`[${card.cost}] ${card.character}, ${card.descriptor}`)
		.setURL(card.cardURL)
		.addFields(
			{ name: 'Ink', value: `${card.ink} ${card.inkIcon}`, inline: true },
			{ name: 'Type', value: card.types.join(' ‧ '), inline: true },
			{ name: 'Abilities', value: card.abilityMarkdown.join('\r\n'), inline: false },
			{ name: 'Flavor', value: card.flavor, inline: false },
			{
				name: 'Set',
				value: `${card.set.code} ‧ ${card.set.language} ‧ ${card.set.number}`,
				inline: true,
			},
			{ name: 'Rarity', value: card.rarity, inline: true },
			{ name: 'Artist', value: card.artist, inline: true },
		)
		.setThumbnail(card.thumbnail)
		.setTimestamp()
		.setFooter({
			text: 'Brought to you by Lorcania',
			iconUrl: 'https://lorcania.com/images/lorcana/logo.jpeg',
		});
}

function tempParser(card) {
	if (card.abilities.length === 0 || card.abilities[0] === null) return ['None'];
	if (card.abilities[0] === '') return ['None'];

	const ICONS = global.client.icons;

	const color = card.ink.toLowerCase();
	card.inkIcon = ICONS[color];
	card.loreIcon = ICONS['pip'].repeat(card.lore);

	const rarities = ['common', 'uncommon', 'rare', 'ultrarare', 'legendary'];
	const rarityIndex = Math.floor(Math.random() * rarities.length);
	const rarityName = rarities[rarityIndex];
	card.rarity = ICONS[rarityName];

	const bold = /<b>([^\]]+)<\/b>/g;
	const mark = /<mark>([^\]]+)<\/mark>/g;
	const italic = /<i>([^\]]+)<\/i>/g;

	card.abilityMarkdown = card.abilities.map((markedUpAbility) => {
		let ability = markedUpAbility
			.replace('*', ICONS['ink']).replace('⬡', ICONS['ink'])
			.replace('◆', ICONS['pip']).replace('↷', ICONS['tap'])
			.replace('※', ICONS['attack']).replace('※', ICONS['defense'])
			.replace('<br>', '\r\n\r\n').replace('<br />', '\r\n\r\n');

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

function makeEmbed(card) {
	if (!card) return;

	// Build embed
	let embed;

	// finalize the card parser based on final markup decision
	tempParser(card);

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