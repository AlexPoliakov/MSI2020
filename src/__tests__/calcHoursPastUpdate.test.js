const { calcHoursPastUpdate } = require('../js/unit-for-test');

describe('calcHoursPastUpdate function', () => {
	let prop;
	let obj;
	beforeEach(() => {
		prop = 'updated_at';
		obj = {
			id: '0xDGLhrnSUKxhs3gZuIAGg',
			reated_at: '2020-01-05 13:42:24.40636',
			updated_at: '2020-01-05 13:42:26.447675',
		};
	});
	test('should be define', () => {
		expect(calcHoursPastUpdate(obj, prop)).toBeDefined();
	});
	test('should not to be undefine', () => {
		expect(calcHoursPastUpdate(obj, prop)).not.toBeUndefined();
	});

	test('should be not a null', () => {
		expect(calcHoursPastUpdate(obj, prop)).not.toBeNull();
	});

	test('should be truthy', () => {
		expect(calcHoursPastUpdate(obj, prop)).toBeTruthy();
   });
   
	test('if not existing property then it will be', () => {
		prop = 'start';
		expect(calcHoursPastUpdate(obj, prop)).toBeNaN();
   });
   
	test('shoul return number less then -1', () => {
		expect(calcHoursPastUpdate(obj, prop)).toBeGreaterThan(-1);
	});
});
