"use babel";

import Grim from "grim";
import glob from "glob";
import path from "path";
import fs from "fs";
import util from "util";
import { remote } from "electron";
import _ from "underscore-plus";
import Jasmine from "jasmine";
import TimeReporter from "./time-reporter/time-reporter";
import AtomReporter from "./atom-reporter/atom-reporter";

function setSpecProperties(suite, specDirectory) {
	for (let child of suite.children) {
		if (child instanceof jasmine.Spec) {
			if (!child.specType) {
				child.suite = suite;
				child.specDirectory = specDirectory;
				child.specType = "user";
			}
		} else {
			setSpecProperties(child, specDirectory);
		}
	}
}

function isFocused(suite) {
	for (let child of suite.children) {
		if (child.priority > 0 || (child instanceof jasmine.Suite && isFocused(child))) {
			return true;
		}
	}
	return false;
}

const defaults = {
	reporter: null,
	timeReporter: false,
	specHelper: false,
	showColors: true,
	htmlTitle: "",
	suffix: "-spec",
	legacySuffix: "-spec-v1",
	showEditor: false,
};

export default function createRunner(options = {}, callback) {
	options = Object.assign({}, defaults, options);
	if (/\.(js|coffee)$/.test(options.suffix)) {
		options.fileGlob = "**/*" + options.suffix;
		options.fileRegexp = new RegExp(options.suffix);
	} else {
		options.fileGlob = "**/*" + options.suffix + "\.+(js|coffee)";
		options.fileRegexp = new RegExp(options.suffix + "\.(js|coffee)");
	}
	if (/\.(js|coffee)$/.test(options.legacySuffix)) {
		options.fileLegacyGlob = "**/*" + options.legacySuffix;
		options.fileLegacyRegexp = new RegExp(options.legacySuffix);
	} else {
		options.fileLegacyGlob = "**/*" + options.legacySuffix + "\.+(js|coffee)";
		options.fileLegacyRegexp = new RegExp(options.legacySuffix + "\.(js|coffee)");
	}

	return ({ testPaths, buildAtomEnvironment, buildDefaultApplicationDelegate, logFile, headless, legacyTestRunner }) => {

		let resolveWithResult;
		const promise = new Promise(resolve => { resolveWithResult = resolve; });

		try {
			const jasmine = new Jasmine();

			for (let key in jasmine) {
				window[key] = jasmine[key];
			}

			window.headless = headless;

			const applicationDelegate = buildDefaultApplicationDelegate();
			window.atom = buildAtomEnvironment({
				applicationDelegate,
				window,
				document,
				enablePersistence: false,
				configDirPath: process.env.ATOM_HOME
			});

			require("./spec-helper/spec-helper")(options.specHelper);
			require("./spec-helper/deprecations");
			require("./spec-helper/fixtures");

			let legacyTestPaths = [];
			testPaths.forEach(testPath => {
				if (fs.statSync(testPath).isDirectory()) {
					jasmine.addSpecFiles(glob.sync(path.join(testPath, options.fileGlob)));
					jasmine.loadSpecs();
					setSpecProperties(jasmine.env.topSuite(), path.resolve(testPath));
					if (options.legacySuffix) {
						legacyTestPaths = legacyTestPaths.concat(glob.sync(path.join(testPath, options.fileLegacyGlob)));
					}
				} else {
					if (options.fileRegexp.test(testPath)) {
						jasmine.addSpecFile(testPath);
						jasmine.loadSpecs();
						setSpecProperties(jasmine.env.topSuite(), path.resolve(path.dirname(testPath)));
					} else if (options.legacySuffix && options.fileLegacyRegexp.test(testPath)) {
						legacyTestPaths.push();
					}
				}
			});

			const focused = isFocused(jasmine.env.topSuite());

			jasmine.showColors(options.showColors);

			jasmine.onComplete(function (passed) {
				if (!focused && legacyTestPaths.length > 0) {
					Grim.clearDeprecations();
					if (headless) {
						console.log("\n\nStarting Legacy Tests");
					}
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
				process.on("uncaughtException", console.error.bind(console));
				jasmine.env.clearReporters();
				if (options.timeReporter) {
					jasmine.addReporter(new TimeReporter());
				}
				jasmine.addReporter(new AtomReporter({
					legacyTestsAvailable: !focused && legacyTestPaths.length > 0,
					title: options.htmlTitle || _.undasherize(_.uncamelcase(path.basename(path.dirname(testPaths[0])))),
					showEditor: options.showEditor
				}));
			}


			if (typeof callback === "function") {
				callback();
			}
			Grim.clearDeprecations();

			jasmine.execute();

		} catch (ex) {
			resolveWithResult(1);
			throw ex;
		}

		return promise;
	};
}
