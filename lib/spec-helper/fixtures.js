"use babel";
/* globals atom, beforeEach, spyOn */

import path from "path";
import FindParentDir from "find-parent-dir";

const { testPaths } = atom.getLoadSettings();

let specDirectory, specPackageName, specPackagePath, specProjectPath;
if (specPackagePath = FindParentDir.sync(testPaths[0], "package.json")) {
	specPackageName = require(path.join(specPackagePath, "package.json")).name;
}

if (specDirectory = FindParentDir.sync(testPaths[0], "fixtures")) {
	specProjectPath = path.join(specDirectory, "fixtures");
}


beforeEach(function () {
	// set project paths to the packages fixtures directory
	if (specProjectPath) {
		atom.project.setPaths([specProjectPath]);
	}

	// resolve the package name to this package instead of the installed one
	const resolvePackagePath = atom.packages.resolvePackagePath;
	spyOn(atom.packages, "resolvePackagePath").and.callFake(function (packageName) {
		if (specPackageName && (packageName === specPackageName)) {
			return resolvePackagePath(specPackagePath);
		}
		return resolvePackagePath(packageName);

	});
});
