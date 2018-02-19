/** @babel */

import Grim from "grim";

function deprecatedFunction() {
	Grim.deprecate("This function is deprecated! Please use `nonDeprecatedFunction()`");
}

const env = jasmine.getEnv();

env.deprecated("Deprecated in top level");

describe("Atom Reporter", function () {
	beforeEach(function () {
		if (jasmine.useRealClock) {
			jasmine.useRealClock();
		}
	});

	zdescribe("failing in beforeAll", function () {
		beforeAll(function () {
			fail();
		});

		it("should fail because of beforeAll", function () {

		});
	});

	zdescribe("failing in beforeEach", function () {
		beforeEach(function () {
			fail();
		});

		it("should fail because of beforeEach", function () {

		});
	});

	zdescribe("deprecated in before functions", function () {
		beforeAll(function () {
			env.deprecated("Deprecated in describe beforeAll");
		});

		beforeEach(function () {
			env.deprecated("Deprecated in describe beforeEach");
		});

		it("should fail because of deprecation in beforeEach", function () {

		});
	});

	describe("passing", function () {
		it("should pass", function () {
			pass();
		});

		it("should pass async", function (done) {
			setTimeout(() => {
				pass();
				done();
			}, 1000);
		});
	});

	describe("pending", function () {
		xit("should be pending", function () {
			fail();
		});

		it("should be pending when called", function () {
			pending("because i called pending");
			fail();
		});

		it("should be pending with no function");
	});

	zdescribe("failing", function () {
		it("should fail", function () {
			fail();
		});

		it("should fail async", function (done) {
			setTimeout(() => {
				fail();
				done();
			}, 1000);
		});

		it("should fail when called", function () {
			fail("because i called fail");
		});

		it("should fail when called async", function (done) {
			setTimeout(() => {
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
			setTimeout(() => {
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
				fail();
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

	zdescribe("no stacktrace", function () {
		it("should show the message as the stacktrace", function () {
			throw "test message";
		});
	});
});
