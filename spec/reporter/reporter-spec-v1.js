/** @babel */

import Grim from "grim";

function deprecatedFunction() {
	Grim.deprecate("This function is deprecated! Please use `nonDeprecatedFunction()`");
}

describe("Jasmine 1.x", function () {
	beforeEach(function () {
		jasmine.useRealClock();
	});

	describe("passing", function () {
		it("should pass", function () {
			expect(true).toBe(true);
		});

		it("should pass async", function () {
			waitsForPromise(_ => new Promise(resolve => {
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

	zit("should have 8 failures", function () {
		expect(true).toBe(false);
	});

	zdescribe("failing", function () {
		it("should fail", function () {
			expect(true).toBe(false);
		});

		it("should fail async", function () {
			waitsForPromise(_ => new Promise(resolve => {
				setTimeout(_ => {
					expect(true).toBe(false);
					resolve();
				}, 1000);
			}));
		});
	});

	zdescribe("deprecated", function () {
		it("should report deprecation", function () {
			expect(true).toBe(true);
			Grim.deprecate("This has been deprecated!");
		});

		it("should report deprecation async", function () {
			waitsForPromise(_ => new Promise(resolve => {
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

		zdescribe("failing", function () {
			it("should fail", function () {
				expect(true).toBe(false);
			});
		});

		zdescribe("deprecated", function () {
			it("should be deprecated", function () {
				deprecatedFunction();
				expect(true).toBe(true);
			});
		});
	});
});
