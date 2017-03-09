describe("set", function () {
	it("should match sets with equal items", function () {
		const set1 = new Set([1, 2, 3, 4, 5]);
		const set2 = new Set([1, 5, 2, 4, 3]);
		expect(set1.isEqual(set2)).toBe(true);
	});

	it("should not match sets with unequal items", function () {
		const set1 = new Set([1, 2, 3, 4, 5]);
		const set2 = new Set([1, 2, 3, 4, 6]);
		expect(set1.isEqual(set2)).toBe(false);
	});

	it("should create a string", function () {
		const set1 = new Set([1, 2, 3, 4, 5]);
		expect(set1.jasmineToString()).toBe("Set {1, 2, 3, 4, 5}");
	});
});
