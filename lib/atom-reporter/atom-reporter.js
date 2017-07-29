"use babel";
// converted from https://github.com/atom/atom/blob/master/spec/atom-reporter.coffee

import SpecResultView from "./spec-result-view";

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

		this.tick = this.tick.bind(this);

		document.querySelector("html").style.overflow = "auto";
		document.body.style.overflow = "auto";

		const jasmineStyle = document.createElement("style");
		jasmineStyle.textContent = atom.themes.loadStylesheet(atom.themes.resolveStylesheet(require.resolve("./css/jasmine.less")));
		document.head.appendChild(jasmineStyle);

		this.tabs = document.createElement("div");
		this.tabs.classList.add("spec-reporter-tabs");
		this.tabs.innerHTML = `
<span outlet="j2Tab" id="j2-tab" class="tab hidden">Jasmine 2 Tests</span>
<span outlet="j1Tab" id="j1-tab" class="tab hidden">Jasmine 1 Tests</span>
<span outlet="minimizeTab" id="minimize-tab" class="tab hidden">Show Editor</span>
`;

		for (let element of Array.from(this.tabs.querySelectorAll("[outlet]"))) {
			this[element.getAttribute("outlet")] = element;
		}

		this.j2Tab = this.tabs.querySelector("#j2-tab");
		this.j1Tab = this.tabs.querySelector("#j1-tab");
		this.minimizeTab = this.tabs.querySelector("#minimize-tab");

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
</div>
`;

		for (let element of Array.from(this.element.querySelectorAll("[outlet]"))) {
			this[element.getAttribute("outlet")] = element;
		}

		this.tabs.addEventListener("click", event => {
			if (event.target.classList.contains("active") || event.target.classList.contains("hidden") || event.target.classList.contains("not-available")) {
				return;
			}

			this.j1Container = this.j1Container || document.querySelector(".spec-reporter-container");
			switch (event.target.id) {
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
			event.target.classList.add("active");
		});

		this.reloadButton.addEventListener("click", () => require("electron").ipcRenderer.send("window-method", "reload"));
	}

	tick() {
		let time = ((this.endedAt || Date.now()) - this.startedAt) / 1000;
		this.time.textContent = `${time.toFixed(2)}s`;

		if (!this.endedAt) {
			requestAnimationFrame(this.tick);
		}
	}

	jasmineStarted(suiteInfo) {
		this.startedAt = Date.now();
		this.totalSpecCount = suiteInfo.totalSpecsDefined;
		this.addSpecs();
		document.body.appendChild(this.tabs);
		document.body.appendChild(this.element);
		if (this.totalSpecCount > 0) {
			this.j2Tab.classList.add("active");
			this.j2Tab.classList.remove("hidden");
		}
		if (this.legacyTestsAvailable) {
			this.j1Tab.classList.add("not-available");
			this.j1Tab.classList.remove("hidden");
		}
		if (this.showEditor) {
			this.minimizeTab.classList.remove("hidden");
		}
		this.tick();
	}

	jasmineDone(suiteInfo) {
		this.endedAt = Date.now();
		this.updateSpecCounts();
		if (this.failedCount === 0) {
			this.status.classList.add("alert-success");
			this.status.classList.remove("alert-info");
		}

		this.message.textContent = this.failedCount + (this.failedCount === 1 ? " failure" : " failures");
		if (this.legacyTestsAvailable) {
			this.j2Tab.classList.remove("active");
			this.j1Tab.classList.add("active");
			this.j1Tab.classList.remove("not-available");
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
