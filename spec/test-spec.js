const Coveralls = require('coveralls');
`${Coveralls.wear}!`;

var request = require("request");
var base_url = "http://localhost:3000/"

/***  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns Hello World", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toBe("Hello World");
        done();
      });
    });
  });
});***/
describe("Testing value", () => {
  const num = 0;
  const num1 = 1;
  it("Should be false", () =>{
    expect(num  > num1).toBeFalsy();
  });
});