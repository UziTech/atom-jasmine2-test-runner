"use babel";

import Grim from "grim";

describe("deprecations", function () {
	describe("should define", function () {
		it("snapshotDeprecations", function () {
			expect(jasmine.snapshotDeprecations).toEqual(jasmine.any(Function));
		});

		it("restoreDeprecationsSnapshot", function () {
			expect(jasmine.restoreDeprecationsSnapshot).toEqual(jasmine.any(Function));
		});
	});

	zit("should have two deprecations", function () {
		Grim.deprecate("Deprecation 1");
		Grim.deprecate("Deprecation 2");
	});

	zit("should have one deprecations", function () {
		jasmine.snapshotDeprecations();
		Grim.deprecate("Deprecation 1");
		jasmine.restoreDeprecationsSnapshot();
		Grim.deprecate("Deprecation 2");
		expect(Grim.getDeprecationsLength()).toBe(2);
	});

	zit("should have one deprecations", function () {
		Grim.deprecate("Deprecation 1");
		jasmine.snapshotDeprecations();
		Grim.deprecate("Deprecation 2");
		jasmine.restoreDeprecationsSnapshot();
		expect(Grim.getDeprecationsLength()).toBe(2);
	});

	it("should have no deprecations", function () {
		jasmine.snapshotDeprecations();
		Grim.deprecate("Deprecation 1");
		Grim.deprecate("Deprecation 2");
		jasmine.restoreDeprecationsSnapshot();
	});
});
