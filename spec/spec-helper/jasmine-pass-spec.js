/* globals pass */

describe("jasmine-pass", function () {
	it("should define pass", function () {
		expect(pass).toEqual(jasmine.any(Function));
	});

	it("should pass", function () {
		pass();
	});
});
