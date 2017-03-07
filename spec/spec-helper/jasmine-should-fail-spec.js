"use babel";
/* globals zdescribe, zit */

describe("jasmine-should-fail", function () {
	describe("passing", function () {
		it("should add zdescribe", function () {
			expect(zdescribe).toEqual(jasmine.any(Function));
		});
		it("should add zit", function () {
			expect(zit).toEqual(jasmine.any(Function));
		});
	});
	zdescribe("failing", function () {
		it("should fail in zdescribe", function () {
			fail();
		});
		zit("should fail in zdescribe zit", function () {
			fail();
		});
	});
	describe("failing", function () {
		zit("should fail in zit", function () {
			fail();
		});
	});
});
