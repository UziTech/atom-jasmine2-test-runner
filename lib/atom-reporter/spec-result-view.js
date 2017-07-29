"use babel";

import path from "path";
import SuiteResultView from "./suite-result-view";

export default class SpecResultView {
	constructor(spec, shouldFail) {
		this.spec = spec;

		this.element = document.createElement("div");
		this.element.id = `spec-failure-${this.spec.id}`;
		this.element.classList.add("spec", `spec-view-${this.spec.id}`);
		this.element.classList.toggle("should-fail", shouldFail);

		this.toggle = document.createElement("div");
		this.toggle.className = "j2-spec-toggle";
		this.toggle.addEventListener("click", _ => {
			const hidden = this.specFailures.classList.toggle("hidden");
			this.toggle.classList.toggle("folded", hidden);
		});
		this.element.appendChild(this.toggle);

		this.description = document.createElement("div");
		this.description.className = "description";
		const description = this.spec.description.replace(/^it /, "");
		this.description.textContent = `it ${description}`;
		this.element.appendChild(this.description);

		this.specFailures = document.createElement("div");
		this.specFailures.className = "spec-failures";
		this.element.appendChild(this.specFailures);

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
			traceElement.className = "j2-stack-trace padded";
			traceElement.textContent = stackTrace;
			traceElement.addEventListener("click", event => event.target.classList.toggle("expanded"));
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
		let suiteViewElement = document.querySelector(`#suite-view-${this.spec.suite.id}`);
		if (!suiteViewElement) {
			let suiteView = new SuiteResultView(this.spec.suite);
			suiteView.attach();
			suiteViewElement = suiteView.element;
		}

		return suiteViewElement;
	}
}
