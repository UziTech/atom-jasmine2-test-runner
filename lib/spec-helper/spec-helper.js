"use babel";
// converted from https://github.com/atom/atom/blob/master/spec/spec-helper.coffee

export default function (options) {
	if (options === false) {
		return;
	}
	const all = (options === true);

	const installDep = require("./install-dep");
	if (all || options.atom) {
		require("./atom");
	}

	if (all || options.attachToDom) {
		require("./attach-to-dom");
	}

	if (all || options.customMatchers) {
		installDep("jasmine2-atom-matchers", "^1.0.0");
	}

	if (all || options.jasmineJson) {
		installDep("jasmine2-json", "^1.0.1");
	}

	if (all || options.jasminePass) {
		installDep("jasmine-pass", "^1.0.0");
	}

	if (all || options.jasminePromises) {
		// this is needed for jasmine-promises
		// https://github.com/matthewjh/jasmine-promises/issues/8
		global.jasmineRequire = {};
		installDep("jasmine-promises", "^0.4.1");
	}

	if (all || options.jasmineShouldFail) {
		installDep("jasmine-should-fail", "^1.0.1");
	}

	if (all || options.jasmineTagged) {
		installDep("jasmine2-tagged", "^1.0.0");
	}

	if (all || options.jasmineFocused) {
		installDep("jasmine2-focused", "^1.0.2");
	}

	if (all || options.mockClock) {
		require("./clock");
	}

	if (all || options.mockLocalStorage) {
		installDep("jasmine-local-storage", "^1.0.0");
	}

	if (all || options.pathwatcher) {
		installDep("pathwatcher", "^7.0.0");
		require("./pathwatcher");
	}

	if (all || options.profile) {
		require("./profile");
	}

	if (all || options.set) {
		require("./set");
	}

	if (all || options.unspy) {
		// TODO: use https://github.com/jasmine/jasmine/pull/1289 when it is merged
		installDep("jasmine-unspy", "^1.0.0");
	}

	if (all || options.ci) {
		require("./ci");
	}
};
