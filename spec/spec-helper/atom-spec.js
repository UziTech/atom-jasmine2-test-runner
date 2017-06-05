describe("atom", function () {
	it("should spy on atom.menu.sendToBrowserProcess", function () {
		expect(jasmine.isSpy(atom.menu.sendToBrowserProcess)).toBe(true);
	});

	it("should set default config", function () {
		expect(atom.config.get("core.destroyEmptyPanes")).toBe(false);
		expect(atom.config.get("editor.fontFamily")).toBe("Courier");
		expect(atom.config.get("editor.fontSize")).toBe(16);
		expect(atom.config.get("editor.autoIndent")).toBe(false);
	});
});
