module.exports = async function pForMap(init, condition, expression, handler) {
	const promises = [];

	for(let i = init; condition(i); i = expression(i)) {
		promises[i] = handler(i);
	}

	return await Promise.all(promises);
}
