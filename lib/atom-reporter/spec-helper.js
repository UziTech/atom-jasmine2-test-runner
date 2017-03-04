"use babel";
/* globals atom, jasmine, beforeEach, afterEach, spyOn */
// converted from https://github.com/atom/atom/blob/master/spec/spec-helper.coffee

import "./jasmine-json";
import "./window";
import "./jasmine-jquery";
import path from "path";
import _ from "underscore-plus";
import fs from "fs-plus";
import Grim from "grim";

// TODO: pathwatcher fails to install
// import pathwatcher from "pathwatcher";
import FindParentDir from "find-parent-dir";

// TODO: how do i get ahold of these ?
// import TextEditor from "../src/text-editor";
// import TextEditorElement from "../src/text-editor-element";
// import TokenizedBuffer from "../src/tokenized-buffer";
// import clipboard from "../src/safe-clipboard";

// TODO: ? not sure what this is yets
const fixturePackagesPath = path.resolve(__dirname, "./fixtures/packages");
atom.packages.packageDirPaths.unshift(fixturePackagesPath);

document.querySelector("html").style.overflow = "auto";
document.body.style.overflow = "auto";

Set.prototype.jasmineToString = function () {
	let result = "Set {";
	let first = true;
	this.forEach(function (element) {
		if (!first) { result += ", "; }
		return result += element.toString();
	});
	first = false;
	return result + "}";
};

Set.prototype.isEqual = function (other) {
	return (
		other instanceof Set &&
		this.size === other.size &&
		Array.from(this).every(item => other.has(item))
	);
};

if (process.env.CI) {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
} else {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
}

if (process.env.JANKY_SHA1 || process.env.CI) {
	 ["fdescribe", "ffdescribe", "fffdescribe", "fit", "ffit", "fffit"].forEach(function (methodName) {
		const focusMethod = window[methodName];
		return window[methodName] = function (description) {
			return focusMethod(description, function () {
				throw new Error("Focused spec is running on CI");
			});
		};
	});
}

const { testPaths } = atom.getLoadSettings();

let specDirectory, specPackageName, specPackagePath, specProjectPath;
if (specPackagePath = FindParentDir.sync(testPaths[0], "package.json")) {
	specPackageName = require(path.join(specPackagePath, "package.json")).name;
}

if (specDirectory = FindParentDir.sync(testPaths[0], "fixtures")) {
	specProjectPath = path.join(specDirectory, "fixtures");
} else {
	// TODO: not too sure about this
	specProjectPath = path.join(__dirname, "fixtures");
}

beforeEach(function () {
	atom.project.setPaths([specProjectPath]);

	window.resetTimeouts();
	spyOn(_._, "now").and.callFake(() => window.now);
	spyOn(window, "setTimeout").and.callFake(window.fakeSetTimeout);
	spyOn(window, "clearTimeout").and.callFake(window.fakeClearTimeout);

	const resolvePackagePath = atom.packages.resolvePackagePath;
	const spy = spyOn(atom.packages, "resolvePackagePath").and.callFake(function (packageName) {
		if (specPackageName && (packageName === specPackageName)) {
			return resolvePackagePath(specPackagePath);
		}
		return resolvePackagePath(packageName);

	});

	// prevent specs from modifying Atom's menus
	spyOn(atom.menu, "sendToBrowserProcess");

	// reset config before each spec
	atom.config.set("core.destroyEmptyPanes", false);
	atom.config.set("editor.fontFamily", "Courier");
	atom.config.set("editor.fontSize", 16);
	atom.config.set("editor.autoIndent", false);
	atom.config.set("core.disabledPackages", ["package-that-throws-an-exception",
    "package-with-broken-package-json", "package-with-broken-keymap"]);
	window.advanceClock(1000);
	// TODO: i don't think we need to do this
	// window.setTimeout.reset();

	// TODO: not sure how to get ahold of these
	// // make editor display updates synchronous
	// TextEditorElement.prototype.setUpdatedSynchronously(true);
	//
	// spyOn(pathwatcher.File.prototype, "detectResurrectionAfterDelay").and.callFake(function () { return this.detectResurrection(); });
	// spyOn(TextEditor.prototype, "shouldPromptToSave").and.return(false);
	//
	// // make tokenization synchronous
	// TokenizedBuffer.prototype.chunkSize = Infinity;
	// spyOn(TokenizedBuffer.prototype, "tokenizeInBackground").and.callFake(function () { return this.tokenizeNextChunk(); });
	//
	// let clipboardContent = "initial clipboard content";
	// spyOn(clipboard, "writeText").and.callFake(text => clipboardContent = text);
	// spyOn(clipboard, "readText").and.callFake(() => clipboardContent);

	jasmine.addCustomEqualityTester(function (a, b) {
		// Use underscore's definition of equality for toEqual assertions
		const result = _.isEqual(a, b);
		if (result) {
			return true;
		}
		// return undefined to allow jasmines regular toEqual
	});

	addCustomMatchers();
});

afterEach(function () {
	ensureNoDeprecatedFunctionCalls();
	ensureNoDeprecatedStylesheets();
	atom.reset();
	if (!window.debugContent) { document.getElementById("jasmine2-content").innerHTML = ""; }
	warnIfLeakingPathSubscriptions();
});

var warnIfLeakingPathSubscriptions = function () {
	// TODO: pathwatcher not working
	// 	const watchedPaths = pathwatcher.getWatchedPaths();
	// 	if (watchedPaths.length > 0) {
	// 		console.error(`WARNING: Leaking subscriptions for paths: ${watchedPaths.join(", ")}`);
	// 	}
	// 	pathwatcher.closeAllWatchers();
};

var ensureNoDeprecatedFunctionCalls = function () {
	const deprecations = _.clone(Grim.getDeprecations());
	Grim.clearDeprecations();
	if (deprecations.length > 0) {
		const originalPrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = function (error, stack) {
			let output = [];
			for (let deprecation of Array.from(deprecations)) {
				output.push(`${deprecation.originName} is deprecated. ${deprecation.message}`);
				output.push(_.multiplyString("-", output[output.length - 1].length));
				for (stack of Array.from(deprecation.getStacks())) {
					for (let { functionName, location } of Array.from(stack)) {
						output.push(`${functionName} -- ${location}`);
					}
				}
				output.push("");
			}
			return output.join("\n");
		};

		const error = new Error(`Deprecated function(s) ${deprecations.map(({originName}) => originName).join(", ")} were called.`);
		error.stack;
		Error.prepareStackTrace = originalPrepareStackTrace;
		throw error;
	}
};

var ensureNoDeprecatedStylesheets = function () {
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

// TODO: not sure this is possible in 2.x
// const { emitObject } = jasmine.StringPrettyPrinter.prototype;
// jasmine.StringPrettyPrinter.prototype.emitObject = function (obj) {
// 	if (obj.inspect) {
// 		return this.append(obj.inspect());
// 	}
// 	return emitObject.call(this, obj);
// };

// TODO: this is not going to work
// jasmine.unspy = function (object, methodName) {
// 	if (!object[methodName].hasOwnProperty("originalValue")) { throw new Error("Not a spy"); }
// 	object[methodName] = object[methodName].originalValue;
// };

jasmine.attachToDOM = function (element) {
	const jasmineContent = document.querySelector("#jasmine2-content");
	if (!jasmineContent.contains(element)) {
		return jasmineContent.appendChild(element);
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

window.__realSetTimeout = window.setTimeout;
window.__realClearTimeout = window.clearTimeout;
window.__real__Now = _._.now;
jasmine.useRealClock = function () {
	window.setTimeout = window.__realSetTimeout;
	window.clearTimeout = window.__realClearTimeout;
	_._.now = window.__real__Now;
	if (window.__realSetInterval) {
		window.setInterval = window.__realSetInterval;
	}
	if (window.__realClearInterval) {
		window.clearInterval = window.__realClearInterval;
	}
};

// The clock is halfway mocked now in a sad and terrible way... only setTimeout
// and clearTimeout are included. This method will also include setInterval. We
// would do this everywhere if didn't cause us to break a bunch of package tests.
jasmine.useMockClock = function () {
	window.__realSetInterval = spyOn(window, "setInterval").and.callFake(window.fakeSetInterval);
	window.__realClearInterval = spyOn(window, "clearInterval").and.callFake(window.fakeClearInterval);
};

function addCustomMatchers() {
	jasmine.addMatchers({
		toBeInstanceOf() {
			return {
				compare: function (actual, expected) {
					let result = {};
					result.passed = actual instanceof expected;
					const beOrNotBe = (result.passed ? "not be" : "be");
					result.message = `Expected ${jasmine.pp(actual)} to ${beOrNotBe} instance of ${expected.name} class`;
					return result;
				}
			};
		},

		toHaveLength() {
			return {
				compare: function (actual, expected) {
					let result = {};
					if (!actual) {
						result.message = `Expected object ${actual} has no length method`;
						result.pass = false;
					} else {
						result.pass = (actual.length === expected);
						const haveOrNotHave = (result.pass ? "not have" : "have");
						result.message = `Expected object with length ${actual.length} to ${haveOrNotHave} length ${expected}`;
					}
					return result;
				}
			};
		},

		toExistOnDisk() {
			return {
				compare: function (actual) {
					let result = {};
					result.pass = fs.existsSync(actual);
					const toOrNotTo = (result.pass ? "not to" : "to");
					result.message = `Expected path '${actual}' ${toOrNotTo} exist.`;
					return result;
				}
			};
		},

		toHaveFocus() {
			return {
				compare: function (actual) {
					let result = {};
					const element = (actual.jquery ? actual.get(0) : actual);
					result.pass = (element === document.activeElement) || element.contains(document.activeElement);
					const toOrNotTo = (result.pass ? "not to" : "to");
					if (!document.hasFocus()) {
						console.error("Specs will fail because the Dev Tools have focus. To fix this close the Dev Tools or click the spec runner.");
					}
					result.message = `Expected element '${actual}' or its descendants ${toOrNotTo} have focus.`;
					return result;
				}
			};
		},

		toShow() {
			return {
				compare: function (actual) {
					let result = {};
					const element = (actual.jquery ? actual.get(0) : actual);
					result.pass = ["block", "inline-block", "static", "fixed"].includes(element.style.display);
					const toOrNotTo = (result.pass ? "not to" : "to");
					result.message = `Expected element '${element}' or its descendants ${toOrNotTo} show.`;
					return result;
				}
			};
		},

		toEqualPath(util, customEqualityTesters) {
			return {
				compare: function (actual, expected) {
					let result = {};
					const actualPath = path.normalize(actual);
					const expectedPath = path.normalize(expected);
					result.pass = actualPath === expectedPath;
					const beOrNotBe = (result.passed ? "not be" : "be");
					result.message = `Expected path '${actualPath}' to ${beOrNotBe} equal to '${expectedPath}'.`;
					return result;
				}
			};
		}
	});
}

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

export function mockLocalStorage() {
	let items = {};
	spyOn(global.localStorage, "setItem").and.callFake(function (key, item) {
		items[key] = item.toString();
	});
	spyOn(global.localStorage, "getItem").and.callFake(function (key) {
		return (items[key] ? items[key] : null)
	});
	spyOn(global.localStorage, "removeItem").and.callFake(function (key) {
		delete items[key];
	});
}
