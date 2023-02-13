module.exports = {
	icons: () => {
		const icons = [];
		const emojis = [
			'lore', 'ruby', 'amethyst', 'amber',
			'sapphire', 'emerald', 'steel', 'common',
			'uncommon', 'rare', 'superrare', 'legendary',
			'tap', 'ink', 'attack', 'defense',
		];

		global.client.emojis.cache.forEach((emoji) => {
			if (emojis.includes(emoji.name)) {
				icons[emoji.name] = `<:${emoji.name}:${emoji.id}>`;
			}
		});

		return icons;
	},
};