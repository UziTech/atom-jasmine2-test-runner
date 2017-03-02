"use babel";
/* globals jasmine, describe, beforeEach, beforeAll, afterEach, afterAll, it, expect, fail, pending, spyOn, xit, xdescribe */

describe("passing", function () {
	it("should pass", function () {
		expect(true).toBe(true);
	});
	it("should pass async", function (done) {
		setTimeout(_ => {
			expect(true).toBe(true);
			done();
		}, 1000);
	});
});
describe("pending", function () {
	xit("should be pending", function () {
		expect(true).toBe(true);
	});
	it("should be pending when called", function () {
		pending("because i called pending");
		expect(true).toBe(true);
	});
	it("should be pending with no function");
});
describe("failing", function () {
	it("should fail", function () {
		expect(true).toBe(false);
	});
	it("should fail async", function (done) {
		setTimeout(_ => {
			expect(true).toBe(false);
			done();
		}, 1000);
	});
	it("should fail when called", function () {
		fail("because i called fail");
		expect(true).toBe(false);
	});
	it("should fail when called async", function (done) {
		setTimeout(_ => {
			fail("because i called fail async");
			expect(true).toBe(false);
			done();
		}, 1000);
	});
});
