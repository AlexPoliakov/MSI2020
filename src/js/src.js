let print = (some) => console.log(some);

let objUrl = {
	randomUrl: 'https://api.chucknorris.io/jokes/random',
	categoryUrl: 'https://api.chucknorris.io/jokes/random?category=',
	freeTextUrl: 'https://api.chucknorris.io/jokes/search?query=',
	listCategories: 'https://api.chucknorris.io/jokes/categories',
};

buildElements(objUrl.listCategories, addCategoryButtons);

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
	if (obj.categories.length > 0) {
		category = `<span class='labelCategory'>${obj.categories}</span>`;
	}

	div.className = `conteiner_joke ${obj.id}`;
	div.innerHTML = `<span class='letter'></span><p class='received_data link'>ID: <a href='${
		obj.url
	}'>${obj.id}</a><span class='link_icon'></span></p><span id='${obj.id}' class='heart'></span>
                     <p class='received_data text'>${obj.value}</p>
							<span class='received_data timeAgo'>Last updated: ${calcHoursPastUpdate(
								obj,
								'updated_at',
							)} hours ago ${category} </span>`;

	document.getElementById('conteiner_jokes').prepend(div);
}

const conteiner = document.querySelector('.conteiner');
let bubble_box = setTimeout(() => {
	bubble_box = document.getElementById('bubble_box');
}, 1000);
const radioRandom = document.getElementById('radio_random');
const radioSearch = document.getElementById('radio_search');
const radioCategories = document.getElementById('radio_categories');
const fieldTextSearch = document.getElementById('text_search');
const buttonGet = document.getElementById('button_get');
const categories = document.getElementById('conteiner_categories');
const conteinerFavourite = document.getElementById('conteiner_favourite');

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

let removeElements = (id) => {
	let elem = document.getElementById(id);
	elem.remove();
};

let showHideElements = (elem, state) => {
	elem.style.display = state;
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
	elem.style.backgroundImage = `url('/src/icons/favourite.svg')`;
	let copyElem = elem.parentNode.cloneNode(true);
	copyElem.style.backgroundColor = '#FFFFFF';
	copyElem.firstChild.style.backgroundImage = `url('/src/icons/messageGray.svg')`;
	if (copyElem.querySelector('.labelCategory')) {
		copyElem.querySelector('.labelCategory').style.display = 'none';
	}
		

	showHideElements(conteinerFavourite, 'flex');
	document.getElementById('conteiner_favourite_jockes').prepend(copyElem);
}

conteiner.addEventListener('click', () => {
	if (radioSearch.checked && event.target === radioSearch) {
		showHideElements(fieldTextSearch, 'block');
		buttonGet.disabled = true;
	} else if (!radioSearch.checked) {
		showHideElements(fieldTextSearch, 'none');
		fieldTextSearch.value = '';
	}

	if (radioCategories.checked && event.target === radioCategories) {
		showHideElements(bubble_box, 'block');
		buttonGet.disabled = true;
	} else if (!radioCategories.checked) {
		showHideElements(bubble_box, 'none');
	}

	if (radioRandom.checked) {
		buttonGet.disabled = false;
		url = objUrl.randomUrl;
	}

	if (event.target.name === 'categoryButton') {
		url = objUrl.categoryUrl + event.target.value;
		buttonGet.disabled = false;
	}

	if (event.target.id === 'text_search') {
		getShowValueFromTextArea(event.target);
	}

	if (event.target.id === 'button_get') {
		buildElements(url, responsePreprocessing);
	}

	if (event.target.className === 'heart') {
		addElemToFavouriteList(event.target);
	}
});

