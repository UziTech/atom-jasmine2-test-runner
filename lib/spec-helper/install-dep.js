"use babel";

import { exec } from "child_process";

function execAsync(command, options) {
	return new Promise((resolve, reject) => {
		exec(command, options, function (err, stdout, stderr) {
			if (err) {
				return reject(err);
			}
			resolve(stdout);
		});
	});
};

export default async function (pkg, version = "*") {
	try {
		require(pkg);
	} catch (ex) {

		let installingEl = null;
		if (window.headless) {
			console.log(`Installing ${pkg}@${version}`);
		} else {
			installingEl = document.createElement("div");
			installingEl.style = "background-color:#fff; display:flex; height:100%; flex-direction:column; justify-content:center; align-items:center;";
			installingEl.innerHTML = `<span style="font-size:20px; font-weight:bold; margin-bottom:15px; color:#333;">Installing ${pkg}@${version}</span><progress></progress>`;

			document.body.appendChild(installingEl);
		}
		const commands = [
			`npm install --save-dev ${pkg}@${version}`,
			`apm rebuild ${pkg}`,
		];
		for (const command of commands) {
			// console.log(`> ${command}`);
			await execAsync(command, { cwd: __dirname });
		}

		try {
			require(pkg);

			if (installingEl) {
				installingEl.remove();
			}
		} catch (ex2) {
			console.error(`Error Installing ${pkg}@${version}`);
			if (installingEl) {
				installingEl.innerHTML = `<span style="font-size:20px; font-weight:bold; margin-bottom:15px; color:#c33;">Error Installing ${pkg}@${version}</span>`;
			}

			throw ex2;
		}
	}
};
