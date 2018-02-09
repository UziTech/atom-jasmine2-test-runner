/** @babel */
// converted from https://github.com/atom/atom/blob/master/spec/spec-helper.coffee

export default async function (options, setupView) {
	if (options === false) {
		return;
	}
	const all = (options === true);

	const installDep = require("./install-dep");

	const install = async function (pkg, version) {
		setupView.install(pkg, version);
		if (version) {
			await installDep(pkg, version);
		}

		require(pkg);
	};

	try {
		if (all || options.atom) {
			await install("./atom");
		}

		if (all || options.attachToDom) {
			await install("./attach-to-dom");
		}

		if (all || options.customMatchers) {
			await install("jasmine2-atom-matchers", "^1.1.0");
		}

		if (all || options.jasmineJson) {
			await install("jasmine2-json", "^1.1.0");
		}

		if (all || options.jasminePass) {
			await install("jasmine-pass", "^1.1.0");
		}

		if (all || options.jasmineShouldFail) {
			await install("jasmine-should-fail", "^1.1.6");
		}

		if (all || options.jasmineTagged) {
			await install("jasmine2-tagged", "^1.1.0");
		}

		if (all || options.jasmineFocused) {
			await install("jasmine2-focused", "^1.1.0");
		}

		if (all || options.mockClock) {
			await install("./clock");
		}

		if (all || options.mockLocalStorage) {
			await install("jasmine-local-storage", "^1.1.0");
		}

		if (all || options.pathwatcher) {
			await install("pathwatcher", "^8.0.1");
			await install("./pathwatcher");
		}

		if (all || options.profile) {
			await install("./profile");
		}

		if (all || options.set) {
			await install("./set");
		}

		if (all || options.unspy) {
			// TODO: use https://github.com/jasmine/jasmine/pull/1289 if it is merged
			await install("jasmine-unspy", "^1.1.0");
		}

		if (all || options.ci) {
			await install("./ci");
		}
	} catch (ex) {
		setupView.error(ex.toString());

		throw ex;
	}
};
