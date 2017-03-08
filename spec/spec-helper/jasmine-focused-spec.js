/* globals pass */

describe("jasmine-focused", function () {
	it("should define ffit", function () {
		expect(window.ffit).toEqual(jasmine.any(Function));
	});

	it("should define fffit", function () {
		expect(window.fffit).toEqual(jasmine.any(Function));
	});

	it("should define ffdescribe", function () {
		expect(window.ffdescribe).toEqual(jasmine.any(Function));
	});

	it("should define fffdescribe", function () {
		expect(window.fffdescribe).toEqual(jasmine.any(Function));
	});

	it("should allow timeout as third parameter", function (done) {
		jasmine.useRealClock();
		setTimeout(function () {
			pass();
			done();
		}, 9000);
	}, 10000);
});
