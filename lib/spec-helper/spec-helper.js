"use babel";
// converted from https://github.com/atom/atom/blob/master/spec/spec-helper.coffee

export default function (options) {
	if (options === false) {
		return;
	}
	const all = (options === true);

	if (all || options.atom) {
		require("./atom");
	}

	if (all || options.attachToDom) {
		require("./attach-to-dom");
	}

	if (all || options.customMatchers) {
		try {
			require("jasmine2-atom-matchers");
		} catch (ex) {
			throw new Error("The optional dependency 'jasmine2-atom-matchers' is not installed");
		}
	}

	if (all || options.jasmineFocused) {
		try {
			require("jasmine2-focused");
		} catch (ex) {
			throw new Error("The optional dependency 'jasmine2-focused' is not installed");
		}
	}

	if (all || options.jasmineJson) {
		try {
			require("jasmine2-json");
		} catch (ex) {
			throw new Error("The optional dependency 'jasmine2-json' is not installed");
		}
	}

	if (all || options.jasminePass) {
		try {
			require("jasmine-pass");
		} catch (ex) {
			throw new Error("The optional dependency 'jasmine-pass' is not installed");
		}
	}

	if (all || options.jasminePromises) {
		try {
			// this is needed for jasmine-promises
			// https://github.com/matthewjh/jasmine-promises/issues/8
			global.jasmineRequire = {};
			require("jasmine-promises");
		} catch (ex) {
			throw new Error("The optional dependency 'jasmine-promises' is not installed");
		}
	}

	if (all || options.jasmineShouldFail) {
		try {
			require("jasmine-should-fail");
		} catch (ex) {
			throw new Error("The optional dependency 'jasmine-should-fail' is not installed");
		}
	}

	if (all || options.jasmineTagged) {
		try {
			require("jasmine2-tagged");
		} catch (ex) {
			throw new Error("The optional dependency 'jasmine2-tagged' is not installed");
		}
	}

	if (all || options.mockClock) {
		require("./clock");
	}

	if (all || options.mockLocalStorage) {
		try {
			require("jasmine-local-storage");
		} catch (ex) {
			throw new Error("The optional dependency 'jasmine-local-storage' is not installed");
		}
	}

	if (all || options.pathwatcher) {
		require("./pathwatcher");
	}

	if (all || options.profile) {
		require("./profile");
	}

	if (all || options.set) {
		require("./set");
	}

	if (all || options.unspy) {
		try {
			// TODO: use https://github.com/jasmine/jasmine/pull/1289 when it is merged
			require("jasmine-unspy");
		} catch (ex) {
			throw new Error("The optional dependency 'jasmine-unspy' is not installed");
		}
	}

	if (all || options.ci) {
		require("./ci");
	}
};
