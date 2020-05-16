const { showHideElemWithClassName } = require('../js/unit-for-test');

describe('test showHideElemWithClassName', () => {
   document.body.innerHTML = `<div class='test'></div>`;
	let elem = document.querySelector('.test');
   let newClass = 'new_test';
   
test('add new class name to element', () => {
   showHideElemWithClassName(elem, newClass);
   expect(elem.classList.contains(newClass)).toBeTruthy();  
})
   
test('remove new class name from elem', () => {
   showHideElemWithClassName(elem, newClass);
	expect(elem.classList.contains(newClass)).toBeFalsy();
   })
})