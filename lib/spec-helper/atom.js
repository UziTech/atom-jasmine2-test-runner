/* globals atom */

beforeEach(function () {
	// prevent specs from modifying Atom's menus
	spyOn(atom.menu, "sendToBrowserProcess");

	// reset config before each spec
	atom.config.set("core.destroyEmptyPanes", false);
	atom.config.set("editor.fontFamily", "Courier");
	atom.config.set("editor.fontSize", 16);
	atom.config.set("editor.autoIndent", false);
});

afterEach(function () {
	atom.reset();
});
