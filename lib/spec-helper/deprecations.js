/** @babel */

import _ from "underscore-plus";
import Grim from "grim";
const env = jasmine.getEnv();

afterEach(function () {
	ensureNoDeprecatedFunctionCalls();
	ensureNoDeprecatedStylesheets();
});


const { testPaths } = atom.getLoadSettings();
const specDirectory = testPaths[0];

function ensureNoDeprecatedFunctionCalls() {
	const deprecations = _.clone(Grim.getDeprecations());
	Grim.clearDeprecations();
	if (deprecations.length > 0) {
		const originalPrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = function (error, stack) {
			let output = [];
			for (let deprecation of deprecations) {
				let message;
				if (deprecation.message) {
					message = deprecation.message;
				} else if (/^(Object)?\.<anonymous>|<unknown>$/.test(deprecation.originName)) {
					message = "A deprecated function was called.";
				} else {
					message = `${deprecation.originName} is deprecated.`;
				}
				env.deprecated(message);
				output.push(message);
				for (stack of deprecation.getStacks()) {
					output.push(_.multiplyString("-", message.length));
					for (let { functionName, location } of stack) {
						output.push(`at ${functionName} (${location})`);
					}
				}
				output.push("");
			}
			return output.join("\n");
		};

		const functionNames = deprecations.map(({ originName }) => originName);
		const plural = deprecations.length > 1;
		const error = new Error(`Deprecated function${plural ? "s" : ""} ${functionNames.join(", ")} ${plural ? "were" : "was"} called.`);
		error.stack;
		Error.prepareStackTrace = originalPrepareStackTrace;
		throw error;
	}
};

function ensureNoDeprecatedStylesheets() {
	const deprecations = _.clone(atom.styles.getDeprecations());
	atom.styles.clearDeprecations();
	for (let sourcePath in deprecations) {
		const deprecation = deprecations[sourcePath];
		const title =
			sourcePath !== "undefined" ?
			`Deprecated stylesheet at '${sourcePath}':` :
			"Deprecated stylesheet:";
		env.deprecated(deprecation.message);
		throw new Error(`${title}\n${deprecation.message}`);
	}
};

function clone2Levels(object) {
	return _.mapObject(object, function (key, value) {
		return [key, _.clone(value)];
	});
}

let grimDeprecationsSnapshot = null;
let stylesDeprecationsSnapshot = null;
jasmine.snapshotDeprecations = function () {
	grimDeprecationsSnapshot = clone2Levels(Grim.deprecations);
	stylesDeprecationsSnapshot = clone2Levels(atom.styles.deprecationsBySourcePath);
};

jasmine.restoreDeprecationsSnapshot = function () {
	Grim.deprecations = grimDeprecationsSnapshot;
	atom.styles.deprecationsBySourcePath = stylesDeprecationsSnapshot;
};
