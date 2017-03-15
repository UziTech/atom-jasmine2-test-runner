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

	if (all || options.ci) {
		require("./ci");
	}

	if (all || options.customMatchers) {
		require("./matchers");
	}

	if (all || options.jasmineFocused) {
		require("jasmine2-focused");
	}

	if (all || options.jasmineJquery) {
		require("./jasmine-jquery");
	}

	if (all || options.jasmineJson) {
		require("./jasmine-json");
	}

	if (all || options.jasminePass) {
		require("./jasmine-pass");
	}

	if (all || options.jasmineShouldFail) {
		require("./jasmine-should-fail");
	}

	if (all || options.jasmineTagged) {
		require("./jasmine-tagged");
	}

	if (all || options.mockClock) {
		require("./clock");
	}

	if (all || options.mockLocalStorage) {
		require("./local-storage");
	}

	// TODO: pathwatcher is not working
	// if (all || options.pathwatcher) {
	// 	require("./pathwatcher");
	// }

	if (all || options.profile) {
		require("./profile");
	}

	if (all || options.set) {
		require("./set");
	}

	if (all || options.unspy) {
		require("./unspy");
	}
};

// TODO: not sure this is possible in 2.x
// const { emitObject } = jasmine.StringPrettyPrinter.prototype;
// jasmine.StringPrettyPrinter.prototype.emitObject = function (obj) {
// 	if (obj.inspect) {
// 		return this.append(obj.inspect());
// 	}
// 	return emitObject.call(this, obj);
// };
