describe("attach-to-dom", function () {
		beforeEach(function () {
			this.jasmine2Content = document.getElementById("jasmine2-content");
		});

		it("should define jasmine.attachToDOM", function () {
			expect(jasmine.attachToDOM).toEqual(jasmine.any(Function));
		});

		it("should attach #jasmine2-content to the dom", function () {
			expect(this.jasmine2Content).toBeInDOM();
		});

		it("should append to #jasmine2-content", function () {
			const element = document.createElement("div");
			jasmine.attachToDOM(element);
			expect(this.jasmine2Content).toContainElement(element);
		});
});
