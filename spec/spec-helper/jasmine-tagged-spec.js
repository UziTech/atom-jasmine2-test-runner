/* globals pass */

const env = jasmine.getEnv();
env.setIncludedTags(["tagged", "tags"]);
env.includeSpecsWithoutTags(false);

describe("jasmine-tagged", function () {
	it("is #tagged", function () {
		pass();
	});

	it("has #multiple #tags", function () {
		pass();
	});

	describe("pending", function () {
		it("should #not run", function () {
			fail();
		});

		it("has no tags", function () {
			fail();
		});
	});
});

env.setIncludedTags();
env.includeSpecsWithoutTags(true);
