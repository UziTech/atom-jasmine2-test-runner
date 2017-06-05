"use babel";
// converted from https://github.com/atom/atom/blob/master/spec/atom-reporter.coffee

import path from "path";
import process from "process";
import _ from "underscore-plus";
import grim from "grim";
import listen from "./delegated-listener";
import ipcHelpers from "./ipc-helpers";

export default class AtomReporter {

	constructor(options) {
		this.startedAt = null;
		this.runningSpecCount = 0;
		this.completeSpecCount = 0;
		this.passedCount = 0;
		this.failedCount = 0;
		this.skippedCount = 0;
		this.totalSpecCount = 0;
		this.deprecationCount = 0;
		this.timeoutId = 0;

		this.title = options.title;
		document.title = options.title;
		// Allow document.title to be assigned in specs without screwing up spec window title
		let documentTitle = null;
		Object.defineProperty(document, "title", {
			get() { return documentTitle; },
			set(title) { documentTitle = title; },
			configurable: true
		});

		this.showEditor = options.showEditor;
		this.legacyTestsAvailable = options.legacyTestsAvailable;

		document.querySelector("html").style.overflow = "auto";
		document.body.style.overflow = "auto";

		const jasmineStyle = document.createElement("style");
		jasmineStyle.textContent = atom.themes.loadStylesheet(atom.themes.resolveStylesheet(require.resolve("./css/jasmine.less")));
		document.head.appendChild(jasmineStyle);

		this.tabs = document.createElement("div");
		this.tabs.classList.add("spec-reporter-tabs");
		this.tabs.innerHTML = `
<span id="j2-tab" class="tab hidden">Jasmine 2 Tests</span>
<span id="j1-tab" class="tab hidden">Jasmine 1 Tests</span>
<span id="minimize-tab" class="tab hidden">Show Editor</span>
`;

		this.element = document.createElement("div");
		this.element.classList.add("j2-spec-reporter-container");
		this.element.innerHTML = `
<div class="spec-reporter">
  <div class="padded pull-right">
    <button outlet="reloadButton" class="btn btn-small reload-button">Reload Specs</button>
  </div>
  <div outlet="coreArea" class="symbol-area">
    <div outlet="coreHeader" class="symbol-header"></div>
    <ul outlet="coreSummary"class="symbol-summary list-unstyled"></ul>
  </div>
  <div outlet="bundledArea" class="symbol-area">
    <div outlet="bundledHeader" class="symbol-header"></div>
    <ul outlet="bundledSummary"class="symbol-summary list-unstyled"></ul>
  </div>
  <div outlet="userArea" class="symbol-area">
    <div outlet="userHeader" class="symbol-header"></div>
    <ul outlet="userSummary"class="symbol-summary list-unstyled"></ul>
  </div>
  <div outlet="status" class="status alert alert-info">
    <div outlet="time" class="time"></div>
    <div outlet="specCount" class="spec-count"></div>
    <div outlet="message" class="message"></div>
  </div>
  <div outlet="results" class="j2-results"></div>
  <div outlet="deprecations" class="status alert alert-warning" style="display: none">
    <span outlet="deprecationStatus">0 deprecations</span>
    <div class="deprecation-toggle"></div>
  </div>
  <div outlet="deprecationList" class="deprecation-list"></div>
</div>
`;

		for (let element of Array.from(this.element.querySelectorAll("[outlet]"))) {
			this[element.getAttribute("outlet")] = element;
		}
	}

	jasmineStarted(suiteInfo) {
		this.handleEvents();
		this.startedAt = Date.now();
		this.totalSpecCount = suiteInfo.totalSpecsDefined;
		this.addSpecs();
		document.body.appendChild(this.tabs);
		document.body.appendChild(this.element);
		if (this.totalSpecCount > 0) {
			document.querySelector("#j2-tab").classList.add("active");
			document.querySelector("#j2-tab").classList.remove("hidden");
		}
		if (this.legacyTestsAvailable) {
			document.querySelector("#j1-tab").classList.add("not-available");
			document.querySelector("#j1-tab").classList.remove("hidden");
		}
		if (this.showEditor) {
			document.querySelector("#minimize-tab").classList.remove("hidden");
		}
	}

	jasmineDone(suiteInfo) {
		this.updateSpecCounts();
		if (this.failedCount === 0) {
			this.status.classList.add("alert-success");
			this.status.classList.remove("alert-info");
		}

		this.message.textContent = this.failedCount + (this.failedCount === 1 ? " failure" : " failures");
		if (this.legacyTestsAvailable) {
			document.querySelector("#j2-tab").classList.remove("active");
			document.querySelector("#j1-tab").classList.add("active");
			document.querySelector("#j1-tab").classList.remove("not-available");
		}
	}

	suiteDone(suite) {}

	specDone(spec) {
		spec = this.getSpec(spec);
		this.completeSpecCount++;
		spec.endedAt = Date.now();
		this.specComplete(spec);
		this.updateStatusView(spec);
	}

	specStarted(spec) {
		this.runningSpecCount++;
	}

	handleEvents() {
		listen(document, "click", ".spec-toggle", event => {
			let specFailures = event.currentTarget.parentElement.querySelector(".spec-failures");

			if (specFailures.style.display === "none") {
				specFailures.style.display = "";
				event.currentTarget.classList.remove("folded");
			} else {
				specFailures.style.display = "none";
				event.currentTarget.classList.add("folded");
			}

			event.preventDefault();
		});

		listen(document, "click", ".deprecation-list", event => {
			let deprecationList = event.currentTarget.parentElement.querySelector(".deprecation-list");

			if (deprecationList.style.display === "none") {
				deprecationList.style.display = "";
				event.currentTarget.classList.remove("folded");
			} else {
				deprecationList.style.display = "none";
				event.currentTarget.classList.add("folded");
			}

			event.preventDefault();
		});

		listen(document, "click", ".stack-trace", event => event.currentTarget.classList.toggle("expanded"));

		listen(document, "click", ".tab", event => {
			if (event.currentTarget.classList.contains("active") || event.currentTarget.classList.contains("hidden") || event.currentTarget.classList.contains("not-available")) {
				return;
			}

			this.j1Container = this.j1Container || document.querySelector(".spec-reporter-container");
			switch (event.currentTarget.id) {
				case "j2-tab":
					this.element.classList.remove("not-active");
					if (this.j1Container) {
						this.j1Container.classList.add("not-active");
					}
					document.body.classList.remove("minimize-specs");
					break;
				case "j1-tab":
					if (this.j1Container) {
						this.j1Container.classList.remove("not-active");
					}
					this.element.classList.add("not-active");
					document.body.classList.remove("minimize-specs");
					break;
				case "minimize-tab":
					document.body.classList.add("minimize-specs");
					break;
				default:
					// do nothing
			}
			document.querySelector(".tab.active").classList.remove("active");
			event.currentTarget.classList.add("active");
		});

		this.reloadButton.addEventListener("click", () => ipcHelpers.call("window-method", "reload"));
	}

	updateSpecCounts() {
		let specCount;
		if (this.skippedCount) {
			specCount = `${this.completeSpecCount - this.skippedCount}/${this.totalSpecCount - this.skippedCount} (${this.skippedCount} skipped)`;
		} else {
			specCount = `${this.completeSpecCount}/${this.totalSpecCount}`;
		}
		this.specCount.textContent = specCount;
	}

	updateStatusView(spec) {
		if (this.failedCount > 0) {
			this.status.classList.add("alert-danger");
			this.status.classList.remove("alert-info");
		}

		this.updateSpecCounts();

		let rootSuite = spec.suite;
		while (rootSuite.parentSuite.parentSuite) { rootSuite = rootSuite.parentSuite; }
		this.message.textContent = rootSuite.description;

		let time = `${Math.round((spec.endedAt - this.startedAt) / 10)}`;
		if (time.length < 3) { time = `0${time}`; }
		this.time.textContent = `${time.slice(0, -2)}.${time.slice(-2)}s`;
	}

	specTitle(spec) {
		let parentDescs = [];
		let s = spec.suite;
		while (s.parentSuite) {
			parentDescs.unshift(s.description);
			s = s.parentSuite;
		}

		let suiteString = "";
		let indent = "";
		for (let desc of Array.from(parentDescs)) {
			suiteString += indent + desc + "\n";
			indent += "  ";
		}

		return `${suiteString} ${indent} it ${spec.description}`;
	}

	getSpec(spec) {
		return this.specs[spec.id];
	}

	getSpecs(suite) {
		let specs = [];
		for (let child of suite.children) {
			if (child instanceof jasmine.Spec) {
				specs.push(child);
			} else {
				specs = specs.concat(this.getSpecs(child));
			}
		}
		return specs;
	}

	addSpecs() {

		this.specs = this.getSpecs(jasmine.getEnv().topSuite()).reduce((prev, spec) => {
			prev[spec.id] = spec;
			return prev;
		}, {});
		let coreSpecs = 0;
		let bundledPackageSpecs = 0;
		let userPackageSpecs = 0;

		for (let id in this.specs) {
			const spec = this.specs[id];
			let symbol = document.createElement("li");
			symbol.setAttribute("id", `spec-summary-${spec.id}`);
			symbol.setAttribute("title", this.specTitle(spec));
			symbol.className = "spec-summary pending";
			symbol.onclick = function () {
				const failure = document.querySelector(`#spec-failure-${spec.id}`);
				if (failure) {
					failure.scrollIntoView();
				}
			};
			switch (spec.specType) {
				case "core":
					coreSpecs++;
					this.coreSummary.appendChild(symbol);
					break;
				case "bundled":
					bundledPackageSpecs++;
					this.bundledSummary.appendChild(symbol);
					break;
				case "user":
					userPackageSpecs++;
					this.userSummary.appendChild(symbol);
					break;
				default:
					// do nothing
			}
		}

		if (coreSpecs > 0) {
			this.coreHeader.textContent = `Core Specs (${coreSpecs})`;
		} else {
			this.coreArea.style.display = "none";
		}
		if (bundledPackageSpecs > 0) {
			this.bundledHeader.textContent = `Bundled Package Specs (${bundledPackageSpecs})`;
		} else {
			this.bundledArea.style.display = "none";
		}
		if (userPackageSpecs > 0) {
			if ((coreSpecs === 0) && (bundledPackageSpecs === 0)) {
				return this.userHeader.textContent = `${this.title} Specs`;
			}
			this.userHeader.textContent = `User Package Specs (${userPackageSpecs})`;

		} else {
			this.userArea.style.display = "none";
		}

	}

	specComplete(spec) {
		let specSummaryElement = document.getElementById(`spec-summary-${spec.id}`);
		specSummaryElement.classList.remove("pending");

		switch (spec.result.status) {
			case "failed":
				specSummaryElement.classList.add("failed");
				new SpecResultView(spec, false).attach();
				this.failedCount++;
				break;
			case "passed":
				specSummaryElement.classList.add("passed");
				if (spec.shouldFail) {
					new SpecResultView(spec, true).attach();
				}
				this.passedCount++;
				break;
			case "pending":
			case "disabled":
			default:
				specSummaryElement.classList.add("skipped");
				this.skippedCount++;

		}
	}
}

class SuiteResultView {
	constructor(suite) {
		this.suite = suite;
		this.element = document.createElement("div");
		this.element.className = "suite";
		this.element.setAttribute("id", `suite-view-${this.suite.id}`);
		this.description = document.createElement("div");
		this.description.className = "description";
		this.description.textContent = this.suite.description;
		this.element.appendChild(this.description);
	}

	attach() {
		(this.parentSuiteView() || document.querySelector(".j2-results")).appendChild(this.element);
	}

	parentSuiteView() {
		let suiteViewElement;
		if (!this.suite.parentSuite) { return; }

		if (this.suite.parentSuite.parentSuite && !(suiteViewElement = document.querySelector(`#suite-view-${this.suite.parentSuite.id}`))) {
			let suiteView = new SuiteResultView(this.suite.parentSuite);
			suiteView.attach();
			suiteViewElement = suiteView.element;
		}

		return suiteViewElement;
	}
}

class SpecResultView {
	constructor(spec, shouldFail) {
		this.spec = spec;
		this.element = document.createElement("div");
		this.element.className = "spec";
		this.element.innerHTML = `\
<div class='spec-toggle'></div>
<div outlet='description' class='description'></div>
<div outlet='specFailures' class='spec-failures'></div>\
`;
		this.description = this.element.querySelector("[outlet=\"description\"]");
		this.specFailures = this.element.querySelector("[outlet=\"specFailures\"]");

		this.element.id = `spec-failure-${this.spec.id}`;
		this.element.classList.add(`spec-view-${this.spec.id}`);

		if (shouldFail) {
			this.element.classList.add("should-fail");
		}

		let { description } = this.spec;
		if (description.indexOf("it ") !== 0) { description = `it ${description}`; }
		this.description.textContent = description;

		if (shouldFail) {
			for (let result of this.spec.result.passedExpectations) {
				this.addResult(result);
			}
		} else {
			for (let result of this.spec.result.failedExpectations) {
				this.addResult(result);
			}
		}
	}

	addResult(result) {
		let stackTrace = this.formatStackTrace(result.message, result.stack);

		let resultElement = document.createElement("div");
		resultElement.className = "result-message fail";
		resultElement.textContent = result.message;
		this.specFailures.appendChild(resultElement);

		if (stackTrace) {
			let traceElement = document.createElement("pre");
			traceElement.className = "stack-trace padded";
			traceElement.textContent = stackTrace;
			this.specFailures.appendChild(traceElement);
		}
	}

	formatStackTrace(message, stackTrace) {
		if (message === null) { message = ""; }
		if (!stackTrace) { return stackTrace; }

		let jasminePattern = /^\s*at\s+.*\(?.*[/\\]jasmine-core.*[/\\]jasmine(-[^/\\]*)?\.js:\d+:\d+\)?\s*$/;
		let firstJasmineLinePattern = /^\s*at [/\\].*[/\\]jasmine-core.*[/\\]jasmine(-[^/\\]*)?\.js:\d+:\d+\)?\s*$/;
		let lines = [];
		for (let line of stackTrace.split("\n")) {
			if (!jasminePattern.test(line)) {
				lines.push(line);
			}
			if (firstJasmineLinePattern.test(line)) {
				break;
			}
		}

		// Remove first line of stack when it is the same as the error message
		if (lines[0] !== null) {
			let errorMatch = lines[0].match(/^Error: (.*)/);
			if (errorMatch && message.trim() === errorMatch[1]) {
				lines.shift();
			}
		}

		lines = lines.map(line => {
			// Remove prefix of lines matching: at .<anonymous> (path:1:2)
			line = line.replace(/at (?:(?:Object)?\.<anonymous>|<unknown>) \(([^)]+)\)/, "at $1");

			// Relativize locations to spec directory
			if (process.platform === "win32") {
				line = line.replace("file:///", "").replace(new RegExp(`${path.posix.sep}`, "g"), path.win32.sep);
			}
			line = line.replace(`${this.spec.specDirectory}${path.sep}`, "");

			return line.trim();
		});

		return lines.join("\n");
	}

	attach() {
		this.parentSuiteView().appendChild(this.element);
	}

	parentSuiteView() {
		let suiteViewElement;
		if (!(suiteViewElement = document.querySelector(`#suite-view-${this.spec.suite.id}`))) {
			let suiteView = new SuiteResultView(this.spec.suite);
			suiteView.attach();
			suiteViewElement = suiteView.element;
		}

		return suiteViewElement;
	}
}
