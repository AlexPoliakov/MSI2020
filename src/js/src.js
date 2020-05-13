let print = (some) => console.log(some);

document.addEventListener('DOMContentLoaded', (event) => {
	readFromLocalStorage();
	buildElements(objUrl.listCategories, addCategoryButtons);
});

let objUrl = {
	randomUrl: 'https://api.chucknorris.io/jokes/random',
	categoryUrl: 'https://api.chucknorris.io/jokes/random?category=',
	freeTextUrl: 'https://api.chucknorris.io/jokes/search?query=',
	listCategories: 'https://api.chucknorris.io/jokes/categories',
};

function buildElements(url, fn) {
	fetchAsync(url).then((data) => {
		fn(data);
	});
}

function responsePreprocessing(data) {
	if (data.result) {
		data.result.map((item) => buildElementWithJoke(item));
	} else {
		buildElementWithJoke(data);
	}
}

function buildElementWithJoke(obj) {
	let div = document.createElement('div');
	let category = ``;
	if (obj.categories.length) {
		category = `<span class='labelCategory'>${obj.categories}</span>`;
	}

	div.className = `conteiner_joke`;
	div.innerHTML = `<span class='letter'></span><p class='link'>ID: <a href='${
		obj.url
	}'>${obj.id}</a><span class='link_icon'></span></p><span id='id${
		obj.id
	}' class='heart id${obj.id}'></span>
                     <p class='text'>${obj.value}</p>
							<span class='timeAgo'>Last updated: ${calcHoursPastUpdate(
								obj,
								'updated_at',
							)} hours ago ${category} </span>`;

	if (listId.has(div.querySelector('.heart').id)) {
		div.querySelector('.heart').classList.toggle('favourite');
	}
	document.getElementById('conteiner_jokes').prepend(div);
}

let listId = new Set();
const categories = document.getElementById('conteiner_categories');
const conteiner = document.querySelector('.conteiner');
let bubble_box = setTimeout(() => {
	bubble_box = document.getElementById('bubble_box');
}, 1000);
const radioRandom = document.getElementById('radio_random');
const radioSearch = document.getElementById('radio_search');
const radioCategories = document.getElementById('radio_categories');
const fieldTextSearch = document.getElementById('text_search');
const buttonGet = document.getElementById('button_get');
const conteinerFavourite = document.querySelector('.conteiner_favourite');
const conteinerFavouriteJokes = document.getElementById(
	'conteiner_favourite_jockes',
);
const boxMain = document.querySelector('.box_main');
const containerMain = document.querySelector('#conteiner_main');

let url = objUrl.randomUrl;

async function fetchAsync(url) {
	try {
		let response = await fetch(url);
		let data = await response.json();
		return data;
	} catch (e) {
		console.error(e);
	}
}

function addCategoryButtons(arr) {
	let result = '';
	arr.map((item) => {
		result += `<input id='${item}' class='categories' name='categoryButton' value='${item}'/>`;
	});

	categories.innerHTML = `<div id='bubble_box'>${result}</div>`;
}

let showHideElements = (elem, state) => {
	elem.style.display = state;
};

let showHideElemWithCSS = (elem, selector) => {
	elem.classList.toggle(selector);
};

let clearActiveButton = (selector) => {
	if (!conteiner.querySelector(`.${selector}`)) return;
	conteiner.querySelector(`.${selector}`).classList.toggle(selector);
};

let changeViewActiveButton = (elem, selector) => {
	clearActiveButton(selector);
	elem.classList.toggle(selector);
};

let calcHoursPastUpdate = (obj, prop) => {
	let dataUpdate = new Date(Date.parse(obj[prop]));
	let hoursAgo = parseInt((Date.now() - dataUpdate) / 1000 / 60 / 60);
	return hoursAgo;
};

let getShowValueFromTextArea = (elem) => {
	elem.addEventListener('input', () => {
		buttonGet.disabled = true;
		if (elem.value && elem.value.length > 2) {
			url = objUrl.freeTextUrl + elem.value;
			buttonGet.disabled = false;
		}
	});
};

let addElemToFavouriteList = (elem) => {
	elem.classList.toggle('favourite');
	let copyElem = elem.parentNode.cloneNode(true);

	copyElem.querySelector('.heart').id = '';
	copyElem.classList.add('back_color');
	copyElem.firstChild.classList.add('message_change');

	if (copyElem.querySelector('.labelCategory')) {
		copyElem.querySelector('.labelCategory').style.display = 'none';
	}

	if (!conteinerFavourite.classList.contains('visible')) {
		showHideElemWithCSS(conteinerFavourite, 'visible');
	}

	conteinerFavouriteJokes.prepend(copyElem);
	saveToLocalStorage(copyElem.parentNode);
};

let removeElemFromFavouriteList = (elem) => {
	let classElem = '';
	elem.classList.forEach((item) => {
		if (item !== 'heart' && item !== 'favourite') {
			classElem = item;
		}
	});

	if (listId.has(classElem)) listId.delete(classElem);

	document.querySelectorAll(`.${classElem}`).forEach((item) => {
		if (item.id !== classElem) {
			item.parentNode.remove();
		} else {
			item.classList.toggle('favourite');
		}
	});

	if (!conteinerFavouriteJokes.hasChildNodes()) {
		showHideElemWithCSS(conteinerFavourite, 'visible');
	}

	saveToLocalStorage(conteinerFavouriteJokes);
};

function saveToLocalStorage(elem) {
	localStorage.setItem('favouriteList', elem.innerHTML);
}

function createListIdOfLocalStorage(elem) {
	elem.querySelectorAll('.heart').forEach((item) => {
		item.classList.forEach((item) => {
			if (item !== 'heart' && item !== 'favourite') {
				listId.add(item);
			}
		});
	});
}

function readFromLocalStorage() {
	if (!localStorage.favouriteList) return;

	showHideElemWithCSS(conteinerFavourite, 'visible');
	conteinerFavouriteJokes.innerHTML = localStorage.getItem('favouriteList');

	createListIdOfLocalStorage(conteinerFavouriteJokes);
}

conteiner.addEventListener('click', () => {
	let elem = event.target;
	if (radioSearch.checked && elem === radioSearch) {
		showHideElements(fieldTextSearch, 'block');
		buttonGet.disabled = true;
	} else if (!radioSearch.checked) {
		showHideElements(fieldTextSearch, 'none');
		fieldTextSearch.value = '';
	}

	if (radioCategories.checked && elem === radioCategories) {
		showHideElements(bubble_box, 'block');
		clearActiveButton('active_button');
		buttonGet.disabled = true;
	} else if (!radioCategories.checked) {
		showHideElements(bubble_box, 'none');
	}

	if (radioRandom.checked) {
		buttonGet.disabled = false;
		url = objUrl.randomUrl;
	}

	if (elem.name === 'categoryButton') {
		changeViewActiveButton(elem, 'active_button');
		url = objUrl.categoryUrl + elem.value;
		buttonGet.disabled = false;
	}

	if (elem.id === 'text_search') {
		getShowValueFromTextArea(elem);
	}

	if (elem.id === 'button_get') {
		buildElements(url, responsePreprocessing);
	}

	if (elem.classList.contains('heart')) {
		if (elem.classList.contains('favourite')) {
			removeElemFromFavouriteList(elem);
		} else {
			addElemToFavouriteList(elem);
		}
	}

	if (elem.className === 'button_main' || elem.className === 'open') {
		showHideElemWithCSS(conteinerFavourite, 'tablet');
		showHideElemWithCSS(boxMain, 'freezing');
		showHideElemWithCSS(containerMain, 'color_freez');
	}

	if (elem.className === 'name_favourite' || elem.className === 'close') {
		showHideElemWithCSS(conteinerFavourite, 'tablet');
		showHideElemWithCSS(boxMain, 'freezing');
		showHideElemWithCSS(containerMain, 'color_freez');
	}
});
