"use babel";
/* globals jasmine, describe, beforeEach, beforeAll, afterEach, afterAll, it, expect, fail, pending, spyOn, xit, xdescribe */

import Grim from "grim";

function deprecatedFunction() {
	Grim.deprecate("This function is deprecated! Please use `nonDeprecatedFunction()`");
}

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
describe("deprecations", function () {
	it("should report deprecation", () => {
		expect(true).toBe(true);
		Grim.deprecate("This has been deprecated!");
	});

	it("should report deprecation async", function (done) {
		setTimeout(_ => {
			expect(true).toBe(true);
			deprecatedFunction();
			done();
		}, 1000);
	});

	it("should report deprecation from failure", () => {
		deprecatedFunction();
		expect(true).toBe(false);
		deprecatedFunction();
	});
});
describe("multiple suites", function () {
	describe("passing", function () {
		it("should pass", function () {
			expect(true).toBe(true);
		});
	});
	describe("pending", function () {
		xit("should be pending", function () {
			expect(true).toBe(true);
		});
	});
	describe("failing", function () {
		it("should fail", function () {
			expect(true).toBe(false);
		});
	});
	describe("deprecation", function () {
		it("should be deprecated", function () {
			deprecatedFunction();
			expect(true).toBe(true);
		});
	});
});
