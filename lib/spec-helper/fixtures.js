"use babel";
/* globals atom, beforeEach, spyOn */

import path from "path";
import FindParentDir from "find-parent-dir";

const { testPaths } = atom.getLoadSettings();

// TODO: ? not sure what this does yets
// const fixturePackagesPath = path.resolve(__dirname, "./fixtures/packages");
// atom.packages.packageDirPaths.unshift(fixturePackagesPath);

let specDirectory, specPackageName, specPackagePath, specProjectPath;
if (specPackagePath = FindParentDir.sync(testPaths[0], "package.json")) {
	specPackageName = require(path.join(specPackagePath, "package.json")).name;
}

if (specDirectory = FindParentDir.sync(testPaths[0], "fixtures")) {
	specProjectPath = path.join(specDirectory, "fixtures");
} else {
	// TODO: should I load fixtures?
	// specProjectPath = path.join(__dirname, "fixtures");
}


beforeEach(function () {
	atom.project.setPaths([specProjectPath]);

	const resolvePackagePath = atom.packages.resolvePackagePath;
	spyOn(atom.packages, "resolvePackagePath").and.callFake(function (packageName) {
		if (specPackageName && (packageName === specPackageName)) {
			return resolvePackagePath(specPackagePath);
		}
		return resolvePackagePath(packageName);

	});
});
