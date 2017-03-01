"use babel";
/* globals describe, beforeEach, afterEach, it, expect */

import Grim from "grim";

function deprecatedFunction() {
	Grim.deprecate("This function is deprecated! Please use `nonDeprecatedFunction()`");
}

describe("Basic Tests", () => {
	beforeEach(() => {
		global.atom = global.buildAtomEnvironment();
	});

	afterEach(() => {
		global.atom.destroy();
	});

	it("passes", () => {
		expect(true).toBe(true);
	});

	it("fails", () => {
		expect(true).toBe(false);
	});

	describe("nested at one level", () => {
		describe("nested at two levels", () => {
			it("reports failures correctly", () => {
				expect(4).toBeGreaterThan(5);
			});
		});
	});

	it("marks missing it blocks as pending");

	it("reports deprecations", () => {
		expect(true).toBe(true);
		Grim.deprecate("This has been deprecated!");
	});

	describe("with a second describe block", () => {
		it("fails synchronously when an assertion fails", (done) => {
			deprecatedFunction();
			deprecatedFunction();
			expect(true).toBe(false);
			setTimeout(done, 5000);
		});
	});
});

describe("A Second Suite", () => {
	it("fails asynchronously when a rejected promise is returned", (done) => {
		expect(true).toBe(true);
		setTimeout(() => {
			expect(true).toBe(false);
			done();
		}, 1000);
	});
});
