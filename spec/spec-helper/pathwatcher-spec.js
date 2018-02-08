/** @babel */

import pathwatcher from "pathwatcher";

describe("pathwatcher", function () {
	beforeAll(function () {
		spyOn(console, "error");
	});
	it("should pass", function () {
		const pw = pathwatcher.watch("../");
		pw.close();
	});
	it("should report error", function () {
		expect(console.error).not.toHaveBeenCalled();
	});
	it("should fail", function () {
		pathwatcher.watch("../");
	});
	it("should report error", function () {
		expect(console.error).toHaveBeenCalledTimes(1);
	});
});
