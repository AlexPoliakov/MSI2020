const { fetchAsync } = require('../js/unit-for-test');

describe('test fetchAsync', () => {
   let url = `https://jsonplaceholder.typicode.com/users`;

   test('request for an object', () => {
      expect(fetchAsync(url)).toBeTruthy();
   });

   test('to check that an object is an instance of a class', () => {
      expect(fetchAsync(url)).toBeInstanceOf(Object);
   });

   test('check the presence of the "name" property', () => {
      fetchAsync(url).then((data) => {
         data.forEach(item => {
            expect(item.hasOwnProperty('name')).toBeTruthy();
         })
      })
   });

   test('the received value is defined', () => {
      expect(fetchAsync(url)).toBeDefined();
   });

   test('the length of the resulting array is 10', () => {
      fetchAsync(url).then((data) => {
         expect(data.length).toEqual(10);
      });
   });
});