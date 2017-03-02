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

		let resolveWithResult;
		const promise = new Promise(resolve => { resolveWithResult = resolve; });

		try {
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

			testPaths.forEach(testPath => {
				if (fs.statSync(testPath).isDirectory()) {
					jasmine.addSpecFiles(glob.sync(path.join(testPath, options.glob)));
				} else {
					jasmine.addSpecFile(testPath);
				}
			});

			jasmine.onComplete(function (passed) {
				debugger;
				resolveWithResult(passed ? 0 : 1);
			});

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
				jasmine.addReporter(new AtomHtmlReporter({
					title: options.htmlTitle
				}));
			}


			if (callback) callback(jasmine);
			Grim.clearDeprecations();

			jasmine.execute();


		} catch (ex) {
			console.error(ex);
			resolveWithResult(1);
		}

		return promise;
	};
}
