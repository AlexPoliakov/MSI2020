const { saveToLocalStorage } = require('../js/unit-for-test');

describe('test saveToLocalStorage', () => {
   let key = 'test';
   document.body.innerHTML = `<div class='box'>Test</div>`
   let elem = document.querySelector('.box');

   test('checking for stored data', () => {
      saveToLocalStorage(key, elem);
      expect(localStorage.length).toEqual(1);
   });

   test('check the key', () => {
      expect(localStorage.key(0)).toEqual('test');
   });

   test('checking record for availability', () => {
      expect(localStorage.getItem(key)).toBeTruthy();
   });

   test('content check', () => {
      expect(localStorage.getItem(key)).toEqual('Test');
   });
   localStorage.clear();
});