function buildElements(url, fn) {
	fetchAsync(url).then((data) => {
		fn(data);
	});
}

async function fetchAsync(url) {
	try {
		let response = await fetch(url);
		let data = await response.json();
		return data;
	} catch (e) {
		console.error(e);
	}
}
