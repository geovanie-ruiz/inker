async function cardsRequest(url) {
	const result = await fetch(url, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	});
	if (result.status === 200) {
		const payload = await result.json();
		return payload;
	}
	return {};
}

async function getCardsByTerm(term) {
	const apiUrl = `${process.env.apiHost}/botSearch?text=${term}`;
	return await cardsRequest(apiUrl);
}

async function getCardsById(id) {
	const apiUrl = `${process.env.apiHost}/botSearch?id=${id}`;
	return await cardsRequest(apiUrl);
}

async function getCardsByName(name) {
	const apiUrl = `${process.env.apiHost}/botSearch?name=${name}`;
	return await cardsRequest(apiUrl);
}

module.exports = { getCardsByTerm, getCardsById, getCardsByName };