"use babel";
/* globals waitsForPromise, jasmine, describe, beforeEach, afterEach, it, expect, fail, pending, spyOn, xit, xdescribe */

import Grim from "grim";

function deprecatedFunction() {
	Grim.deprecate("This function is deprecated! Please use `nonDeprecatedFunction()`");
}

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
	it("should pass with no function");
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
describe("deprecations", function () {
	it("should report deprecation", function () {
		expect(true).toBe(true);
		Grim.deprecate("This has been deprecated!");
	});

	it("should report deprecation async", function () {
		waitsForPromise(_ => new Promise(resolve => {
			jasmine.unspy(window, "setTimeout");
			setTimeout(_ => {
				expect(true).toBe(true);
				deprecatedFunction();
				resolve();
			}, 1000);
		}));
	});

	it("should report deprecation from failure", function () {
		deprecatedFunction();
		expect(true).toBe(false);
		deprecatedFunction();
	});
});
