"use babel";

import Grim from "grim";
import glob from "glob";
import path from "path";
import _ from "underscore-plus";

const defaults = {
	reporter: null,
	colors: true,
	htmlTitle: "",
	suffix: "-spec.js",
	legacySuffix: "-spec-v1.js",
};

export default function createRunner(options = {}, callback) {
	options = Object.assign({}, defaults, options);

	return ({ testPaths, buildAtomEnvironment, buildDefaultApplicationDelegate, logFile, headless, legacyTestRunner }) => {

		let resolveWithResult;
		const promise = new Promise(resolve => { resolveWithResult = resolve; });

		try {
			const fs = require("fs");
			const util = require("util");

			const remote = require("electron").remote;

			const Jasmine = require("jasmine");
			const jasmine = new Jasmine();

			for (let key in jasmine) {
				window[key] = jasmine[key];
			}

			if (process.env.JANKY_SHA1 || process.env.CI) {
				 ["fdescribe", "fit"].forEach(function (methodName) {
					let focusMethod = window[methodName];
					return window[methodName] = function (description) {
						let error = new Error("Focused spec is running on CI");
						return focusMethod(description, function () { throw error; });
					};
				});
			}

			jasmine.showColors(options.colors);

			const applicationDelegate = buildDefaultApplicationDelegate();
			window.atom = buildAtomEnvironment({
				applicationDelegate,
				window,
				document,
				enablePersistence: false,
				configDirPath: process.env.ATOM_HOME
			});

			let legacyTestPaths = [];
			testPaths.forEach(testPath => {
				if (fs.statSync(testPath).isDirectory()) {
					jasmine.addSpecFiles(glob.sync(path.join(testPath, "**/*" + options.suffix)));
					// TODO: setSpecDirectory
					if (options.legacySuffix) {
						legacyTestPaths = legacyTestPaths.concat(glob.sync(path.join(testPath, "**/*" + options.legacySuffix)));
					}
				} else {
					if (testPath.endsWith(options.suffix)) {
						jasmine.addSpecFile(testPath);
						// TODO: setSpecDirectory
					} else if (options.legacySuffix && testPath.endsWith(options.legacySuffix)) {
						legacyTestPaths.push();
					}
				}
			});

			jasmine.onComplete(function (passed) {
				if (legacyTestPaths.length > 0) {
					Grim.clearDeprecations();
					console.log("\n\nStarting Legacy Tests");
					legacyTestRunner({ testPaths: legacyTestPaths, buildAtomEnvironment, buildDefaultApplicationDelegate, logFile, headless }).then(errorCode => {
						resolveWithResult(passed && !errorCode ? 0 : 1);
					});
				} else {
					resolveWithResult(passed ? 0 : 1);
				}
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

				if (options.reporter) {
					jasmine.env.clearReporters();
					jasmine.addReporter(options.reporter);
				}

			} else {
				// const AtomHtmlReporter = require("./html-reporter/html-reporter");
				const AtomReporter = require("./atom-reporter/atom-reporter");

				process.on("uncaughtException", console.error.bind(console));
				jasmine.env.clearReporters();
				jasmine.addReporter(new AtomReporter({
					legacyTestsAvailable: legacyTestPaths.length > 0,
					specDirectory: testPaths[0],
					title: options.htmlTitle || _.undasherize(_.uncamelcase(path.basename(path.dirname(testPaths[0]))))
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
