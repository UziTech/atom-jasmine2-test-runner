/* globals measure, profile */

describe("profile", function () {
	beforeEach(function () {
			spyOn(console, "log");
	});
	it("should measure and log the time a function takes", function () {
		measure("test", function () {
			for (let i = 0; i < 100000000; i++) {
				const a = i * i;
			}
		});
		expect(console.log.calls.mostRecent().args[0]).toBe("test");
	});
	it("should profile and log the time a function takes", function () {
		profile("test", function () {
			for (let i = 0; i < 100000000; i++) {
				const a = i * i;
			}
		});
		expect(console.log.calls.mostRecent().args[0]).toBe("test");
	});
});
