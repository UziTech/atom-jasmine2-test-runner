"use babel";

import Grim from "grim";
import glob from "glob";
import path from "path";

const defaults = {
	htmlTitle: "",
	globalAtom: true,
	glob: "**/*-spec.js",
};

export default function createRunner(options = {}, callback) {
	options = Object.assign({}, defaults, options);

	return ({ testPaths, buildAtomEnvironment, buildDefaultApplicationDelegate, logFile, headless }) => {
		function runTests(testPaths, resolve) {
			const fs = require("fs");
			const util = require("util");
			const tmp = require("tmp");


			const tmpDir = tmp.dirSync().name;

			const remote = require("electron").remote;

			const Jasmine = require("jasmine");
			const jasmine = new Jasmine();
			console.debug(jasmine);
			window.jasmine = jasmine.jasmine;

			const applicationDelegate = buildDefaultApplicationDelegate();

			// TODO: Some day, we should expose this via the module system
			// so that test authors can just `require 'atom/test'`
			global.buildAtomEnvironment = function (params = {}) {
				let defaultParams = {
					applicationDelegate,
					window,
					document,
					enablePersistence: false,
					configDirPath: tmpDir
				};
				return buildAtomEnvironment(Object.assign(defaultParams, params));
			};

			if (options.globalAtom) {
				global.atom = global.buildAtomEnvironment();
			}

			const specFiles = testPaths.reduce((files, testPath) => {
				let p = testPath;
				if (fs.statSync(testPath).isDirectory()) {
					p = glob.sync(path.join(testPath, options.glob));
				}
				files = files.concat(p);
				return files;
			}, []);

			jasmine.addSpecFiles(specFiles);

			if (headless) {
				console.debug = console.log = function (...args) {
					const formatted = util.format(...args);
					process.stdout.write(formatted + "\n");
				};

				Object.defineProperties(process, {
					stdout: { value: remote.process.stdout },
					stderr: { value: remote.process.stderr }
				});

			} else {
				const AtomHtmlReporter = require("./html-reporter/html-reporter");

				process.on("uncaughtException", console.error.bind(console));
				jasmine.addReporter(new AtomHtmlReporter(jasmine, {
					title: options.htmlTitle,
					rerun: _ => { runTests(testPaths, resolve); },
					onComplete: resolve
				}));
			}


			if (callback) callback(jasmine);
			Grim.clearDeprecations();

			jasmine.execute();
		}

		return new Promise(resolve => {
			try {
				runTests(testPaths, resolve);
			} catch (ex) {
				debugger;
				console.error(ex.stack);
				resolve(1);
			}
		});
	};
}
