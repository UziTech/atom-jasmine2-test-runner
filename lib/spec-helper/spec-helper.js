"use babel";
// converted from https://github.com/atom/atom/blob/master/spec/spec-helper.coffee

export default async function (options) {
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
		await installDep("jasmine2-atom-matchers", "^1.0.0");
	}

	if (all || options.jasmineJson) {
		await installDep("jasmine2-json", "^1.0.1");
	}

	if (all || options.jasminePass) {
		await installDep("jasmine-pass", "^1.0.0");
	}

	if (all || options.jasmineShouldFail) {
		await installDep("jasmine-should-fail", "^1.0.1");
	}

	if (all || options.jasmineTagged) {
		await installDep("jasmine2-tagged", "^1.0.0");
	}

	if (all || options.jasmineFocused) {
		await installDep("jasmine2-focused", "^1.0.2");
	}

	if (all || options.mockClock) {
		require("./clock");
	}

	if (all || options.mockLocalStorage) {
		await installDep("jasmine-local-storage", "^1.0.0");
	}

	if (all || options.pathwatcher) {
		await installDep("pathwatcher", "^7.0.0");
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
		await installDep("jasmine-unspy", "^1.0.0");
	}

	if (all || options.ci) {
		require("./ci");
	}
};
