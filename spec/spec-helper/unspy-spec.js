describe("unspy", function () {
	beforeEach(function () {
		this.count = 0;
		this.obj = { method: _ => ++this.count };
	});
	it("should remove the spy", function () {
		spyOn(this.obj, "method");
		expect(jasmine.isSpy(this.obj.method)).toBe(true);
		unspy(this.obj, "method");
		expect(jasmine.isSpy(this.obj.method)).toBe(false);
	});

	it("should restore the original function", function () {
		this.obj.method();
		expect(this.count).toBe(1);
		spyOn(this.obj, "method");
		this.obj.method();
		expect(this.count).toBe(1);
		unspy(this.obj, "method");
		this.obj.method();
		expect(this.count).toBe(2);
	});

	it("should restore the first original function", function () {
		spyOn(this.obj, "method");
		this.obj.method = function () {};
		spyOn(this.obj, "method");
		unspy(this.obj, "method");
		this.obj.method();
		expect(this.count).toBe(1);
	});
});
