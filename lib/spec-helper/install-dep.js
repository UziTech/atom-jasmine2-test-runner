/** @babel */

import { exec } from "child_process";
import semver from "semver";

function execAsync(command, options) {
	return new Promise((resolve, reject) => {
		exec(command, options, function (err, stdout) {
			if (err) {
				return reject(err);
			}
			resolve(stdout);
		});
	});
};

async function install(pkg, v) {
	const version = v || "*";

	const commands = [
		`npm install --save-dev ${pkg}@${version}`,
		`apm rebuild ${pkg}`,
	];

	for (const command of commands) {
		// console.log(`> ${command}`);
		await execAsync(command, { cwd: __dirname });
	}
}

export default async function (pkg, version = null) {
	let shouldInstall = false;

	try {
		const pkgPath = require.resolve(`${pkg}/package.json`);
		const pkgVersion = require(pkgPath).version;
		shouldInstall = !semver.satisfies(pkgVersion, version);
	} catch (ex) {
		shouldInstall = true;
	}

	if (shouldInstall) {
		await install(pkg, version);
	}
};
