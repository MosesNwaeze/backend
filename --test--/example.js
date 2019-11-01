//run with command => jasmine spec/--test--/example.js
//const api = require('./api/get');
describe('input forms', ()=>{
		it('should contain one input', ()=>{
			expect(forms.count()).toEquals(1);
			done();
	   });
	});