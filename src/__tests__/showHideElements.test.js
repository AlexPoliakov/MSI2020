const { showHideElements } = require('../js/unit-for-test');

describe('test showHideElements', () => {
   document.body.innerHTML = `<div class='test_show_hide'></div>`
   let elem = document.querySelector('.test_show_hide');
   let hide = 'none';
   let show = 'block'

   test('hide element', () => {
      showHideElements(elem, hide);
      expect(elem.style.display).toEqual('none');
   });
   test('show element', () => {
      showHideElements(elem, show);
      expect(elem.style.display).toEqual('block');
   })
});