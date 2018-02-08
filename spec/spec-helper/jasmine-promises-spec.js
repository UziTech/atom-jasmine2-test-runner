/** @babel */

describe("jasmine-promises", function () {
	var time;
	it("should save the start time", function () {
		time = (new Date()).getTime();
	});

	it("should pause for 3 seconds", async function () {
		if (jasmine.useRealClock) {
			jasmine.useRealClock();
		}
		await new Promise(resolve => {
			setTimeout(resolve, 3000);
		});
	});

	it("should be called 3 seconds after time was set", function () {
		expect((new Date()).getTime()).toBeGreaterThanOrEqual(time + 3000);
	});
});
