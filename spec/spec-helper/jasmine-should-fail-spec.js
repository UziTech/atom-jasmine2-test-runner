describe("jasmine-should-fail", function () {
	it("should define zdescribe", function () {
		expect(zdescribe).toEqual(jasmine.any(Function));
	});

	it("should define zit", function () {
		expect(zit).toEqual(jasmine.any(Function));
	});

	zdescribe("failing", function () {
		it("should fail in zdescribe", function () {
			fail();
		});

		zit("should fail in zdescribe zit", function () {
			fail();
		});
	});

	zit("should fail in zit", function () {
		fail();
	});
});
