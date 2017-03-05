"use babel";
/* globals atom, jasmine, beforeEach, afterEach, spyOn */
// converted from https://github.com/atom/atom/blob/master/spec/spec-helper.coffee

import "./jasmine-json";
import "./profile";
import "./fixtures";
import "./matchers";
import "./jasmine-jquery";
import "./clock";

// TODO: pathwatcher fails to install
// import pathwatcher from "pathwatcher";

// TODO: how do i get ahold of these ?
// import TextEditor from "../src/text-editor";
// import TextEditorElement from "../src/text-editor-element";
// import TokenizedBuffer from "../src/tokenized-buffer";
// import clipboard from "../src/safe-clipboard";

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

beforeEach(function () {

	// prevent specs from modifying Atom's menus
	spyOn(atom.menu, "sendToBrowserProcess");

	// reset config before each spec
	atom.config.set("core.destroyEmptyPanes", false);
	atom.config.set("editor.fontFamily", "Courier");
	atom.config.set("editor.fontSize", 16);
	atom.config.set("editor.autoIndent", false);
	atom.config.set("core.disabledPackages", ["package-that-throws-an-exception",
    "package-with-broken-package-json", "package-with-broken-keymap"]);
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

});

afterEach(function () {
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
