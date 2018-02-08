/** @babel */

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
import SetupView from "./setup-view";

function setSpecProperties(suite, specDirectory) {
	suite.specDirectory = specDirectory;
	for (let child of suite.children) {
		if (child.children) {
			setSpecProperties(child, specDirectory);
		} else {
			if (!child.specType) {
				child.suite = suite;
				child.specDirectory = specDirectory;
				child.specType = "user";
			}
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
	testPaths: null,
	random: false,
	seed: null,
};

export default function createRunner(options = {}, configFunc) {
	if (typeof options === "function") {
		configFunc = options;
		options = defaults;
	} else {
		options = Object.assign({}, defaults, options);
		if (typeof configFunc !== "function") {
			configFunc = function () {};
		}
	}
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

	return async ({ testPaths, buildAtomEnvironment, buildDefaultApplicationDelegate, logFile, headless, legacyTestRunner }) => {
		let resolveWithResult;
		const promise = new Promise(resolve => { resolveWithResult = resolve; });
		const setupView = new SetupView({headless});

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

			if (headless) {
				console.debug = console.log = function (...args) {
					const formatted = util.format(...args);
					process.stdout.write(formatted + "\n");
				};

				console.error = function (...args) {
					const formatted = util.format(...args);
					process.stderr.write(formatted + "\n");
				};

				Object.defineProperties(process, {
					stdout: { value: remote.process.stdout },
					stderr: { value: remote.process.stderr }
				});
			}

			await require("./spec-helper/spec-helper")(options.specHelper, setupView);
			require("./spec-helper/deprecations");
			require("./spec-helper/fixtures");
			require("./spec-helper/yield");
			require("./spec-helper/reset-atom");

			await configFunc();

			let legacyTestPaths = [];
			let paths = [];
			const root = path.resolve(path.dirname(testPaths[0]));
			if (!headless && options.testPaths !== null) {
				if (!Array.isArray(options.testPaths)) {
					options.testPaths = [options.testPaths];
				}
				paths = options.testPaths.map(p => {
					const fullPath = path.resolve(root, p);
					try {
						fs.statSync(fullPath);
					} catch (err) {
						if (err.code === "ENOENT"){
							err.message = `ENOENT: no such file or directory '${fullPath}' from testPaths`;
							setupView.error(err.toString(), "in testPaths");
						}
						throw err;
					}
					return fullPath;
				});
			} else {
				paths = testPaths;
			}
			paths.forEach(testPath => {
				if (fs.statSync(testPath).isDirectory()) {
					const files = glob.sync(path.join(testPath, options.fileGlob)).filter(f => !f.includes("node_modules"));
					jasmine.addSpecFiles(files);
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
						legacyTestPaths.push(testPath);
					}
				}
			});

			// only works if specHelper.jasmineFocused is enabled
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

			setupView.destroy();

			if (headless) {
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
					title: options.htmlTitle || _.undasherize(_.uncamelcase(path.basename(root))),
					showEditor: options.showEditor
				}));
			}

			Grim.clearDeprecations();

			jasmine.randomizeTests(options.random);
			if (options.seed !== null) {
				jasmine.seed(options.seed);
			}

			jasmine.execute();

		} catch (ex) {
			console.error(ex);
			setupView.error(ex.toString(), "loading tests");
			resolveWithResult(1);
		}

		return promise;
	};
}
