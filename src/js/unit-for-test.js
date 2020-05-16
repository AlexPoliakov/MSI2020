let showHideElemWithClassName = (elem, selector) => {
	elem.classList.toggle(selector);
};

let calcHoursPastUpdate = (obj, prop) => {
	let dataUpdate = new Date(Date.parse(obj[prop]));
	let hoursAgo = parseInt((Date.now() - dataUpdate) / 1000 / 60 / 60);
	return hoursAgo;
};

let showHideElements = (elem, state) => {
	elem.style.display = state;
};

async function fetchAsync(url) {
	try {
		let response = await fetch(url);
		let data = await response.json();
		return data;
	} catch (e) {
		console.error(e);
	}
}

function saveToLocalStorage(key, elem) {
	localStorage.setItem(key, elem.innerHTML);
}

module.exports = {
	calcHoursPastUpdate,
	showHideElemWithClassName,
	showHideElements,
	fetchAsync,
	saveToLocalStorage,
};


