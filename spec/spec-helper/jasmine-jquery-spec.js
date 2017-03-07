"use babel";

describe("jasmine-jquery", function () {
	it("should be loaded", function () {
		let input = document.createElement("input");
		input.type = "checkbox";
		input.checked = true;
		expect(input).toBeChecked();
	});
});
