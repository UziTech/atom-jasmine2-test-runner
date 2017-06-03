"use babel";

import { execSync } from "child_process";

export default function (pkg, version = "*") {
	try {
		require(pkg);
	} catch (ex) {
		// const command = `apm install ${pkg}@${version}`
		execSync(`npm install --no-save ${pkg}@${version} && apm rebuild ${pkg}`, { cwd: __dirname });
		require(pkg);
	}
};
