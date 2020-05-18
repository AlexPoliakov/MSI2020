import '../css/style.css';
import '../css/media.css'
import { buildElements, fetchAsync } from './request';
import {
	calcHoursPastUpdate,
	showHideElements,
	showHideElemWithClassName,
	clearActiveButton,
	changeViewActiveButton,
	listenerSetting,
	saveToLocalStorage,
} from './functional';


document.addEventListener('DOMContentLoaded', (event) => {
	initial();
});

function initial() {
	let objUrl = {
		randomUrl: 'https://api.chucknorris.io/jokes/random',
		categoryUrl: 'https://api.chucknorris.io/jokes/random?category=',
		freeTextUrl: 'https://api.chucknorris.io/jokes/search?query=',
		listCategories: 'https://api.chucknorris.io/jokes/categories',
	};

	let listId = new Set();
	const categories = document.getElementById('container_categories');
	const container = document.querySelector('.container');
	let categories_box = setTimeout(() => {
		categories_box = document.getElementById('categories_box');
	}, 800);
	const radioRandom = document.getElementById('radio_random');
	const radioSearch = document.getElementById('radio_search');
	const radioCategories = document.getElementById('radio_categories');
	const fieldTextSearch = document.getElementById('text_search');
	const buttonGet = document.getElementById('button_get');
	const containerFavourite = document.querySelector('.container_favourite');
	const containerFavouriteJokes = document.getElementById(
		'container_favourite_jockes',
	);
	const boxMain = document.querySelector('.box_main');
	const containerMain = document.querySelector('#container_main');
	const classVisible = 'visible';
	let url = objUrl.randomUrl;

	buildElements(objUrl.listCategories, addCategoryButtons);
	listenerSetting(container, 'click', listenerFunction);
	readFromLocalStorage(containerFavouriteJokes, 'favouriteList');

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

		div.className = `container_joke`;
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
		document.getElementById('container_jokes').prepend(div);
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

	function readFromLocalStorage(elemJokes, key) {
		if (!localStorage[key]) return;

		showHideElemWithClassName(containerFavourite, classVisible);
		elemJokes.innerHTML = localStorage.getItem(key);
		createListIdOfLocalStorage(elemJokes);
	}

	function addCategoryButtons(arr) {
		let result = '';
		arr.map((item) => {
			result += `<input id='${item}' class='categories' name='categoryButton' value='${item}'/>`;
		});
		categories.innerHTML = `<div id='categories_box'>${result}</div>`;
	}

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
		showHideElemWithClassName(elem, 'favourite');
		let copyElem = elem.parentNode.cloneNode(true);

		copyElem.querySelector('.heart').id = '';
		copyElem.classList.add('container_joke_favour');
		copyElem.firstChild.classList.add('message_change');

		if (copyElem.querySelector('.labelCategory')) {
			showHideElements(copyElem.querySelector('.labelCategory'), 'none');
		}

		if (!containerFavourite.classList.contains(classVisible)) {
			showHideElemWithClassName(containerFavourite, classVisible);
		}

		containerFavouriteJokes.prepend(copyElem);
		saveToLocalStorage('favouriteList', copyElem.parentNode);
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
				showHideElemWithClassName(item, 'favourite');
			}
		});

		if (!containerFavouriteJokes.hasChildNodes()) {
			showHideElemWithClassName(containerFavourite, classVisible);
		}
		saveToLocalStorage('favouriteList', containerFavouriteJokes);
	};

	function listenerFunction() {
		let elem = event.target;
		if (radioSearch.checked && elem === radioSearch) {
			showHideElements(fieldTextSearch, 'block');
			buttonGet.disabled = true;
		} else if (!radioSearch.checked) {
			showHideElements(fieldTextSearch, 'none');
			fieldTextSearch.value = '';
		}

		if (radioCategories.checked && elem === radioCategories) {
			showHideElements(categories_box, 'block');
			clearActiveButton('active_button');
			buttonGet.disabled = true;
		} else if (!radioCategories.checked) {
			showHideElements(categories_box, 'none');
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
			elem.classList.contains('favourite')
				? removeElemFromFavouriteList(elem)
				: addElemToFavouriteList(elem);
		}

		if (elem.className === 'button_main' || elem.className === 'open') {
			showHideElemWithClassName(containerFavourite, 'tablet');
			showHideElemWithClassName(boxMain, 'freezing');
			showHideElemWithClassName(containerMain, 'color_freez');
		}

		if (elem.className === 'name_favourite' || elem.className === 'close') {
			showHideElemWithClassName(containerFavourite, 'tablet');
			showHideElemWithClassName(boxMain, 'freezing');
			showHideElemWithClassName(containerMain, 'color_freez');
		}
	}
}
