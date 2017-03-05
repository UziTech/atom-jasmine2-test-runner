"use babel";
/* globals atom, jasmine, afterEach */

import _ from "underscore-plus";
import Grim from "grim";

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
				const message = `${deprecation.originName} is deprecated. ${deprecation.message}`;
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

		const plural = deprecations.length > 1;
		const error = new Error(`Deprecated function${plural ? "s" : ""} ${deprecations.map(({originName}) => originName).join(", ")} ${plural ? "were" : "was"} called.`);
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
		throw new Error(`${title}\n${deprecation.message}`);
	}
};

let grimDeprecationsSnapshot = null;
let stylesDeprecationsSnapshot = null;
jasmine.snapshotDeprecations = function () {
	grimDeprecationsSnapshot = _.clone(Grim.deprecations);
	stylesDeprecationsSnapshot = _.clone(atom.styles.deprecationsBySourcePath);
};

jasmine.restoreDeprecationsSnapshot = function () {
	Grim.deprecations = grimDeprecationsSnapshot;
	atom.styles.deprecationsBySourcePath = stylesDeprecationsSnapshot;
};
