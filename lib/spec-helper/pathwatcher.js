"use babel";

import pathwatcher from "pathwatcher";

beforeEach(function () {
	spyOn(pathwatcher.File.prototype, "detectResurrectionAfterDelay").and.callFake(function () { return this.detectResurrection(); });
});

afterEach(function () {
	warnIfLeakingPathSubscriptions();
});

function warnIfLeakingPathSubscriptions() {
	const watchedPaths = pathwatcher.getWatchedPaths();
	if (watchedPaths.length > 0) {
		console.error(`WARNING: Leaking subscriptions for paths: ${watchedPaths.join(", ")}`);
	}
	pathwatcher.closeAllWatchers();
};
