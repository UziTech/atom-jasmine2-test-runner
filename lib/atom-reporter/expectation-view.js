"use babel";
/** @jsx etch.dom */

import path from "path";
import etch from "etch";

const defaultProps = {
	expectation: {},
	expanded: false,
	specDirectory: "",
};

export default class SpecResultView {
	constructor(props) {
		this.props = Object.assign({}, defaultProps, props);

		etch.initialize(this);
	}

	update(props) {
		this.props = Object.assign({}, this.props, props);

		return etch.update(this);
	}

	destroy() {
		return etch.destroy(this);
	}

	onClick() {
		this.update({
			expanded: !this.props.expanded
		});
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
				line = line.replace("file:///", "").replace(/\//g, "\\");
			}
			line = line.replace(`${this.props.specDirectory}${path.sep}`, "");

			return line.trim();
		});

		return lines.join("\n");
	}

	render() {
		let stackTrace = this.formatStackTrace(this.props.expectation.message, this.props.expectation.stack);

		return (
			<div className="expectation">
				<div className="result-message fail">{this.props.expectation.message}</div>
				{ stackTrace &&
					<pre className={`j2-stack-trace padded ${this.props.expanded ? "expanded" : ""}`} on={{click: this.onClick}}>{stackTrace}</pre>
				}
			</div>
		);
	}
}
