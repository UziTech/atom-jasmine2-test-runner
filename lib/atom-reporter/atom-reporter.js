/** @babel */
// converted from https://github.com/atom/atom/blob/master/spec/atom-reporter.coffee

/* eslint-disable no-unused-vars */
import SpecResultView from "./spec-result-view";
import TabsView from "./tabs-view";
import J2ReporterView from "./j2-reporter-view";
/* eslint-enable no-unused-vars */

export default class AtomReporter {

	constructor(options) {
		this.specs = {};
		this.j1TestsAvailable = options.legacyTestsAvailable;
		this.j2TestsAvailable = false;
		this.topSuite = jasmine.getEnv().topSuite();

		this.tabs = new TabsView({
			minimizeHidden: !options.showEditor,
			j1TestsHidden: !this.j1TestsAvailable,
			j2TestsHidden: !this.j2TestsAvailable,
		});

		this.j2Reporter = new J2ReporterView({
			title: options.title,
			topSuite: this.topSuite,
		});

		this.buildComponent(options.title);
	}

	buildComponent(title) {
		// Allow document.title to be assigned in specs without screwing up spec window title
		let documentTitle = document.title;
		document.title = title;
		Object.defineProperty(document, "title", {
			get() {
				return documentTitle;
			},
			set(newTitle) {
				documentTitle = newTitle;
			},
			configurable: true
		});

		document.querySelector("html").style.overflow = "auto";
		document.body.style.overflow = "auto";

		const jasmineStyle = document.createElement("style");
		jasmineStyle.textContent = atom.themes.loadStylesheet(atom.themes.resolveStylesheet(require.resolve("./css/jasmine.less")));
		document.head.appendChild(jasmineStyle);

		document.body.appendChild(this.tabs.element);
		document.body.appendChild(this.j2Reporter.element);
	}

	specSuites(spec) {
		const suites = [];

		let { suite } = spec;
		while (suite.parentSuite) {
			suites.unshift({
				id: suite.id,
				description: suite.description,
			});
			suite = suite.parentSuite;
		}

		return suites;
	}

	specTitle(spec) {
		const parentDescriptions = [];
		let { suite } = spec;
		while (suite.parentSuite) {
			parentDescriptions.unshift(suite.description);
			suite = suite.parentSuite;
		}

		let suiteString = "";
		let indent = "";
		for (const description of parentDescriptions) {
			suiteString += `${indent + description}\n`;
			indent += "  ";
		}

		return `${suiteString}${indent}it ${spec.description}`;
	}

	getSpecs(suite, specs = {}) {
		for (const child of suite.children) {
			if (child.children) {
				// eslint-disable-next-line no-param-reassign
				specs = this.getSpecs(child, specs);
			} else {
				child.suites = this.specSuites(child);
				child.title = this.specTitle(child);
				specs[child.id] = child;
			}
		}
		return specs;
	}

	jasmineStarted(suiteInfo) {
		this.j2TestsAvailable = suiteInfo.totalSpecsDefined > 0;
		if (this.j2TestsAvailable) {
			this.specs = this.getSpecs(this.topSuite);

			this.j2Reporter.update({
				specs: this.specs,
				startedAt: Date.now()
			});
			this.tabs.update({
				active: "j2-tab",
				j2TestsHidden: false,
			});
		}
	}

	// eslint-disable-next-line no-unused-vars
	jasmineDone(suiteInfo) {
		if (this.j2TestsAvailable) {
			this.j2Reporter.update({
				endedAt: Date.now(),
				currentSpec: null,
			});
		}
		if (this.j1TestsAvailable) {
			this.tabs.update({
				active: "j1-tab",
				j1TestsAvailable: true,
			});
		}
	}

	// suiteStarted(suite) {}

	// suiteDone(suite) {}

	specStarted(spec) {
		this.specs[spec.id].startedAt = Date.now();
		this.j2Reporter.update({
			specs: this.specs,
			currentSpec: this.specs[spec.id],
		});
	}

	specDone(spec) {
		this.specs[spec.id].endedAt = Date.now();
		this.j2Reporter.update({
			specs: this.specs,
		});
	}
}
