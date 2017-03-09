"use babel";
/* globals atom */
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
		require("./jasmine-focused");
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

// TODO: pathwatcher fails to install
// import pathwatcher from "pathwatcher";

// TODO: how do i get ahold of these ?
// import TextEditor from "../src/text-editor";
// import TextEditorElement from "../src/text-editor-element";
// import TokenizedBuffer from "../src/tokenized-buffer";
// import clipboard from "../src/safe-clipboard";

// beforeEach(function () {

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

// });

// afterEach(function () {
// warnIfLeakingPathSubscriptions();
// });

// var warnIfLeakingPathSubscriptions = function () {
// TODO: pathwatcher not working
// 	const watchedPaths = pathwatcher.getWatchedPaths();
// 	if (watchedPaths.length > 0) {
// 		console.error(`WARNING: Leaking subscriptions for paths: ${watchedPaths.join(", ")}`);
// 	}
// 	pathwatcher.closeAllWatchers();
// };

// TODO: not sure this is possible in 2.x
// const { emitObject } = jasmine.StringPrettyPrinter.prototype;
// jasmine.StringPrettyPrinter.prototype.emitObject = function (obj) {
// 	if (obj.inspect) {
// 		return this.append(obj.inspect());
// 	}
// 	return emitObject.call(this, obj);
// };
