"use babel";
/* globals jasmine, spyOn, beforeEach */

import _ from "underscore-plus";

const __realSetTimeout = window.setTimeout;
const __realClearTimeout = window.clearTimeout;
const __real__Now = _._.now;
const __realSetInterval = window.setInterval;
const __realClearInterval = window.clearInterval;

jasmine.useMockClock = function () {
	spyOn(window, "setInterval").and.callFake(window.fakeSetInterval);
	spyOn(window, "clearInterval").and.callFake(window.fakeClearInterval);
	spyOn(_._, "now").and.callFake(() => window.now);
	spyOn(window, "setTimeout").and.callFake(window.fakeSetTimeout);
	spyOn(window, "clearTimeout").and.callFake(window.fakeClearTimeout);
};

jasmine.useRealClock = function () {
	window.setTimeout = __realSetTimeout;
	window.clearTimeout = __realClearTimeout;
	_._.now = __real__Now;
	window.setInterval = __realSetInterval;
	window.clearInterval = __realClearInterval;
};

window.resetTimeouts = function () {
	window.now = 0;
	window.timeoutCount = 0;
	window.intervalCount = 0;
	window.timeouts = [];
	window.intervalTimeouts = {};
};

window.fakeSetTimeout = function (callback, ms) {
	if (!ms) { ms = 0; }
	const id = ++window.timeoutCount;
	window.timeouts.push([id, window.now + ms, callback]);
	return id;
};

window.fakeClearTimeout = function (idToClear) {
	window.timeouts = window.timeouts.filter(([id]) => id !== idToClear);
};

window.fakeSetInterval = function (callback, ms) {
	const id = ++window.intervalCount;
	var action = function () {
		callback();
		return window.intervalTimeouts[id] = window.fakeSetTimeout(action, ms);
	};
	window.intervalTimeouts[id] = window.fakeSetTimeout(action, ms);
	return id;
};

window.fakeClearInterval = function (idToClear) {
	window.fakeClearTimeout(this.intervalTimeouts[idToClear]);
};

window.advanceClock = function (delta) {
	if (!delta) { delta = 1; }
	window.now += delta;

	window.timeouts = window.timeouts.filter(([, strikeTime, callback]) => {
		if (strikeTime <= window.now) {
			callback();
			return false;
		}
		return true;

	});
};


beforeEach(function () {
	window.resetTimeouts();
	window.useMockClock();
	window.advanceClock(1000);
});
