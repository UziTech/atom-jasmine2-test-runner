/* globals atom */

// TODO: how do i get ahold of these ?
// import TextEditor from "../src/text-editor";
// import TextEditorElement from "../src/text-editor-element";
// import TokenizedBuffer from "../src/tokenized-buffer";
// import clipboard from "../src/safe-clipboard";

beforeEach(function () {
	// prevent specs from modifying Atom's menus
	spyOn(atom.menu, "sendToBrowserProcess");

	// reset config before each spec
	atom.config.set("core.destroyEmptyPanes", false);
	atom.config.set("editor.fontFamily", "Courier");
	atom.config.set("editor.fontSize", 16);
	atom.config.set("editor.autoIndent", false);

	// TODO: not sure how to get ahold of these
	// // make editor display updates synchronous
	// TextEditorElement.prototype.setUpdatedSynchronously(true);
	//
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
});
