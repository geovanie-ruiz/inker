const { request } = require('undici');

async function extractCards(body) {
	let fullBody = '';
	for await (const data of body) {
		fullBody += data.toString();
	}
	return JSON.parse(fullBody).cards;
}

async function cardsRequest(url) {
	const result = await request(url);
	return await extractCards(result.body);
}

async function getCardsByTerm(term) {
	const apiUrl = `${process.env.apiHost}/${process.env.apiSearchResource}?text=${term}`;
	const cards = await cardsRequest(apiUrl);

	console.log('getCardsByTerm', cards);

	return [
		{
			id: '1',
			character: 'Mickey Mouse',
			descriptor: 'Brave Little Tailor',
		},
		{
			id: '2',
			character: 'Mickey Mouse',
			descriptor: 'Sorcerer Mickey',
		},
	];
}

async function getCardsById(id) {
	const apiUrl = `${process.env.apiHost}/${process.env.apiSearchResource}?id=${id}`;
	const cards = await cardsRequest(apiUrl);

	console.log(cards);

	return {
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
}

async function getCardsByName(name) {
	const apiUrl = `${process.env.apiHost}/${process.env.apiSearchResource}?name=${name}`;
	const cards = await cardsRequest(apiUrl);

	console.log(cards);

	return {
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
}

module.exports = { getCardsByTerm, getCardsById, getCardsByName };