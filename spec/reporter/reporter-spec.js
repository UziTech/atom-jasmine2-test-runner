"use babel";
/* globals pass, zdescribe */

import Grim from "grim";

function deprecatedFunction() {
	Grim.deprecate("This function is deprecated! Please use `nonDeprecatedFunction()`");
}

describe("Jasmine 2.x", function () {
	beforeEach(function () {
		if (jasmine.useRealClock) {
			jasmine.useRealClock();
		}
	});

	describe("passing", function () {
		it("should pass", function () {
			pass();
		});

		it("should pass async", function (done) {
			setTimeout(_ => {
				pass();
				done();
			}, 1000);
		});
	});

	describe("pending", function () {
		xit("should be pending", function () {
			pass();
		});

		it("should be pending when called", function () {
			pending("because i called pending");
			pass();
		});

		it("should be pending with no function");
	});

	zdescribe("failing", function () {
		it("should fail", function () {
			fail();
		});

		it("should fail async", function (done) {
			setTimeout(_ => {
				fail();
				done();
			}, 1000);
		});

		it("should fail when called", function () {
			fail("because i called fail");
			fail();
		});

		it("should fail when called async", function (done) {
			setTimeout(_ => {
				fail("because i called fail async");
				done();
			}, 1000);
		});
	});

	zdescribe("deprecated", function () {
		it("should report deprecation", () => {
			Grim.deprecate("This has been deprecated!");
		});

		it("should report deprecation async", function (done) {
			setTimeout(_ => {
				deprecatedFunction();
				done();
			}, 1000);
		});

		it("should report deprecation from failure", () => {
			deprecatedFunction();
			fail();
			deprecatedFunction();
		});
	});

	describe("multiple suites", function () {
		describe("passing", function () {
			it("should pass", function () {
				pass();
			});
		});

		describe("pending", function () {
			xit("should be pending", function () {
				pass();
			});
		});

		zdescribe("failing", function () {
			it("should fail", function () {
				fail();
			});
		});

		zdescribe("deprecated", function () {
			it("should be deprecated", function () {
				deprecatedFunction();
			});
		});
	});
});
