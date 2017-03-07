"use babel";

const env = jasmine.getEnv();
env.setIncludedTags(["tagged", "tags"]);
env.includeSpecsWithoutTags(false);

fdescribe("jasmine-tagged", function () {
	describe("passing", function () {
		it("is #tagged", function () {
			expect(true).toBe(true);
		});

		it("has #multiple #tags", function () {
			expect(true).toBe(true);
		});
	});

	describe("pending", function () {
		it("should #not run", function () {
			expect(true).toBe(false);
		});

		it("has no tags", function () {
			expect(true).toBe(false);
		});
	});
});

env.includeSpecsWithoutTags(true);
