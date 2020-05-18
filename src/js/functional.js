let calcHoursPastUpdate = (obj, prop) => {
	let dataUpdate = new Date(Date.parse(obj[prop]));
	let hoursAgo = parseInt((Date.now() - dataUpdate) / 1000 / 60 / 60);
	return hoursAgo;
};

let showHideElements = (elem, state) => {
	elem.style.display = state;
};

let showHideElemWithClassName = (elem, selector) => {
	elem.classList.toggle(selector);
};

let clearActiveButton = (selector) => {
	if (!document.querySelector(`.${selector}`)) return;
	document.querySelector(`.${selector}`).classList.toggle(selector);
};

let changeViewActiveButton = (elem, selector) => {
	clearActiveButton(selector);
	elem.classList.toggle(selector);
};

let listenerSetting = (elem, event, func) => {
	elem.addEventListener(event, func);
}

let saveToLocalStorage = (key, elem) => {
	localStorage.setItem(key, elem.innerHTML);
}

module.exports = {
	calcHoursPastUpdate,
	showHideElements,
	showHideElemWithClassName,
	clearActiveButton,
	changeViewActiveButton,
	listenerSetting,
	saveToLocalStorage,
};