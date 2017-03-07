"use babel";

import _ from "underscore-plus";

const __realSetTimeout = window.setTimeout;
const __realClearTimeout = window.clearTimeout;
const __real__Now = _._.now;
const __realSetInterval = window.setInterval;
const __realClearInterval = window.clearInterval;

// TODO: These functions are very PHPesque. We should use `jasmine` OR `window` not both
//       We could probably just remove this since Jasmine includes their own mock clock
//       https://jasmine.github.io/2.5/introduction.html#section-Jasmine_Clock

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
	jasmine.useMockClock();
	window.advanceClock(1000);
});

// TODO: not sure if we need to expose these `fake` methods
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
