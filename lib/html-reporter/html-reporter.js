"use babel";

const defaultOptions = {
	resolve: _ => {},
};

import Grim from "grim";

import AtomHtmlReporterComponent from "./components/atom-html-reporter-component";

function calculateLabel(test) {
	console.debug("calculateLabel(test)", test);
	if (test.parent && test.parent.title) {
		return calculateLabel(test.parent);
	}
	return test.title;

}

module.exports = class AtomHtmlReporter {
	constructor(jasmine, options) {
		this.options = Object.assign({}, defaultOptions, options);
		this.restart = this.restart.bind(this);
		this.rerunTests = options.rerun;
		this.resolve = options.resolve;

		this.jasmine = jasmine;
		this.label = "";
		this.status = "waiting";
		this.startTime = null;
		this.endTime = null;
		this.tests = [];
		this.currentSuiteTitle = "";
		this.currentTestTitle = "";
		this.deprecations = [];
		this.stats = {
			testsToRun: 0,
			testsSkipped: 0,
			testsRan: 0,
			testsFailed: 0
		};

		this.render();
	}

	restart() {
		this.jasmine.abort(); // TODO:
		this.component.destroy();
		if (typeof this.rerunTests === "function") {
			this.rerunTests();
		}
	}

	jasmineStarted(suiteInfo) {
		this.startTime = performance.now();
		this.stats.testsToRun = suiteInfo.totalSpecsDefined;
		this.render();
	}

	suiteStarted(suite) {
		this.label = suite.fullName;
		this.currentSuiteTitle = suite.fullName;
		this.render();
	}

	specStarted(spec) {
		this.currentTestTitle = spec.fullName;
		this.render();
	}

	specDone(spec) {
		switch (spec.status) {
			case "passed":
				this.stats.testsRan++;
				break;
			case "pending":
				this.stats.testsSkipped++;
				break;
			case "failed":
				this.stats.testsRan++;
				this.stats.testsFailed++;
				break;
			default:
				throw new Error("unknown status: " + spec.status);
		}
		this.deprecations = Grim.getDeprecations();
		this.tests.push(spec);
		this.currentTestTitle = "";
		this.render();
	}

	suiteDone(suite) {
		this.currentSuiteTitle = "";
		this.render();
	}

	jasmineDone() {
		this.endTime = performance.now();
		this.currentSuiteTitle = "";
		this.currentTestTitle = "";
		this.deprecations = Grim.getDeprecations();
		const passed = this.stats.testsFailed === 0;
		if (passed) {
			this.status = "passed";
			this.label = `${this.stats.testsRan} passed`;
		} else {
			this.status = "failed";
			const noun = this.stats.testsFailed === 1 ? "failure" : "failures";
			this.label = `${this.stats.testsFailed} ${noun}`;
		}
		this.render();
		this.resolve(0);
	}

	render() {
		const props = {
			title: this.options.title || "Atom Test Runner",
			suiteTitle: this.currentSuiteTitle,
			testTitle: this.currentTestTitle,
			tests: this.tests,
			label: this.label,
			status: this.status,
			startTime: this.startTime,
			endTime: this.endTime,
			testsToRun: this.stats.testsToRun,
			testsSkipped: this.stats.testsSkipped,
			testsRan: this.stats.testsRan,
			deprecations: this.deprecations,

			restart: this.restart
		};

		if (!this.component) {
			this.component = this.buildComponent(props);
		} else {
			this.component.update(props);
		}
	}

	buildComponent(props) {
		this.prepareDocument(props);

		const container = document.createElement("div");
		container.setAttribute("id", "atom-mocha-test-runner");
		document.body.appendChild(container);
		const component = new AtomHtmlReporterComponent(props);
		container.appendChild(component.element);
		return component;
	}

	prepareDocument(props) {
		document.title = props.title;

		// Allow document.title to be assigned in specs without screwing up spec window title
		let documentTitle = null;
		Object.defineProperty(document, "title", {
			get() { return documentTitle; },
			set(title) { documentTitle = title; },
			configurable: true
		});

		const atomStylesTag = document.querySelector("atom-styles");
		if (atomStylesTag) atomStylesTag.remove();

		this.addElement(document.head, "link", {
			"rel": "stylesheet",
			"type": "text/css",
			"href": "file://" + require.resolve("./style.css")
		});
	}

	addElement(parent, type, props, html) {
		const el = document.createElement(type);
		for (let propName of Object.keys(props)) {
			el.setAttribute(propName, props[propName]);
		}
		if (html) {
			el.innerHTML = html;
		}
		parent.appendChild(el);
	}
};
