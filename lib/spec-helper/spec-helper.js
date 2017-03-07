"use babel";
/* globals atom */
// converted from https://github.com/atom/atom/blob/master/spec/spec-helper.coffee

import "jasmine-jquery";
import "./jasmine-json";
import "./jasmine-focused";
import "./jasmine-tagged";
import "./profile";
import "./matchers";
import "./clock";
import "./unspy";
import "./attach-to-dom";
import "./ci";
import "./set";

// TODO: pathwatcher fails to install
// import pathwatcher from "pathwatcher";

// TODO: how do i get ahold of these ?
// import TextEditor from "../src/text-editor";
// import TextEditorElement from "../src/text-editor-element";
// import TokenizedBuffer from "../src/tokenized-buffer";
// import clipboard from "../src/safe-clipboard";

document.querySelector("html").style.overflow = "auto";
document.body.style.overflow = "auto";

beforeEach(function () {

	// prevent specs from modifying Atom's menus
	spyOn(atom.menu, "sendToBrowserProcess");

	// reset config before each spec
	atom.config.set("core.destroyEmptyPanes", false);
	atom.config.set("editor.fontFamily", "Courier");
	atom.config.set("editor.fontSize", 16);
	atom.config.set("editor.autoIndent", false);
	// atom.config.set("core.disabledPackages", ["package-that-throws-an-exception",
	//   "package-with-broken-package-json", "package-with-broken-keymap"]);

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
