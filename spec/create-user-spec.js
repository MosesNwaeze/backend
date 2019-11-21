const Coveralls = require('coveralls');

`${Coveralls.wear}!`;
const request = require('request');

const base_url = 'http://localhost:5000/';
const currentPageUri = '/create-user.html';
const userApi = require('../controllers/create-user-api');

describe('create user account', () => {
  it('should contain token when an admin login', () => {
    expect(userApi.token.department).toBe('administration');
  });
  it('should recieve a form for processing', () => {
    expect(request.form.name).toBe('create-user');
  });
});
