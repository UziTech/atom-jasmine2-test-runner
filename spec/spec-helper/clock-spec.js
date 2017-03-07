describe("clock", function () {
	describe("should define", function () {
		it("jasmine.useMockClock", function () {
			expect(jasmine.useMockClock).toEqual(jasmine.any(Function));
		});

		it("jasmine.useRealClock", function () {
			expect(jasmine.useRealClock).toEqual(jasmine.any(Function));
		});

		it("resetTimeouts", function () {
			expect(resetTimeouts).toEqual(jasmine.any(Function));
		});

		it("advanceClock", function () {
			expect(advanceClock).toEqual(jasmine.any(Function));
		});

		it("fakeSetTimeout", function () {
			expect(fakeSetTimeout).toEqual(jasmine.any(Function));
		});

		it("fakeClearTimeout", function () {
			expect(fakeClearTimeout).toEqual(jasmine.any(Function));
		});

		it("fakeSetInterval", function () {
			expect(fakeSetInterval).toEqual(jasmine.any(Function));
		});

		it("fakeClearInterval", function () {
			expect(fakeClearInterval).toEqual(jasmine.any(Function));
		});
	});

	it("I'm not going to spec the rest because we are probably going to remove it");
});
