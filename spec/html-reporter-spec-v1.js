"use babel";
/* globals waitsForPromise, jasmine, describe, beforeEach, afterEach, it, expect, fail, pending, spyOn, xit, xdescribe */
describe("passing", function () {
	it("should pass", function () {
		expect(true).toBe(true);
	});
	it("should pass async", function () {
		waitsForPromise(_ => new Promise(resolve => {
			jasmine.unspy(window, "setTimeout");
			setTimeout(_ => {
				expect(true).toBe(true);
				resolve();
			}, 1000);
		}));
	});
});
describe("pending", function () {
	xit("should be pending", function () {
		expect(true).toBe(true);
	});
	it("should be pending with no function");
});
describe("failing", function () {
	it("should fail", function () {
		expect(true).toBe(false);
	});
	it("should fail async", function () {
		waitsForPromise(_ => new Promise(resolve => {
			jasmine.unspy(window, "setTimeout");
			setTimeout(_ => {
				expect(true).toBe(false);
				resolve();
			}, 1000);
		}));
	});
});
