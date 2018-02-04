/** @babel */

if (process.env.CI) {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
} else {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
}

if (process.env.JANKY_SHA1 || process.env.CI) {
	 ["fdescribe", "ffdescribe", "fffdescribe", "fit", "ffit", "fffit"].forEach(function (methodName) {
		const focusMethod = window[methodName];
		return window[methodName] = function (description) {
			return focusMethod(description, function () {
				throw new Error("Focused spec is running on CI");
			});
		};
	});
}
