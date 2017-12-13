"use babel";
/** @jsx etch.dom */

import { shell } from "electron";
import path from "path";
import etch from "etch";

const defaultProps = {
	message: "",
	stack: false,
	expanded: false,
	specDirectory: "",
};

export default class StackTraceView {
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

	handleFileLinkClick(e) {
		e.preventDefault();
		const href = e.target.getAttribute("href");
		shell.openExternal(href);
	}

	render() {
		if (!this.props.stack) { return null; }

		const message = this.props.message || "";

		let jasminePattern = /^\s*at\s+.*\(?.*[/\\]jasmine-core.*[/\\]jasmine(-[^/\\]*)?\.js:\d+:\d+\)?\s*$/;
		let firstJasmineLinePattern = /^\s*at [/\\].*[/\\]jasmine-core.*[/\\]jasmine(-[^/\\]*)?\.js:\d+:\d+\)?\s*$/;
		let lines = [];
		for (let line of this.props.stack.split("\n")) {
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
			if (errorMatch && this.props.message.trim() === errorMatch[1]) {
				lines.shift();
			}
		}

		lines = lines.map(line => {
			// trim whitespace and add new line for pre
			line = line.trim()+"\n";

			// Remove prefix of lines matching: at .<anonymous> (path:1:2)
			line = line.replace(/at (?:(?:Object|UserContext)?\.<anonymous>|<unknown>) \(([^)]+)\)/, "at $1");

			// Relativize locations to spec directory
			if (process.platform === "win32") {
				line = line.replace("file:///", "").replace(/\//g, "\\");
			}

			// replace location with atm:// link to open error location
			if (this.props.specDirectory) {
				const specDirectory = `${this.props.specDirectory}${path.sep}`.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
				const match = line.match(new RegExp(`(${specDirectory}(.*?)):(\\d+)(:(\\d+))?`, "i"));
				if (match) {
					const lineSegments = line.split(match[0]);

					// we assume lineSegments.length === 2
					line = (
						<span>
							{lineSegments[0]}
							<a href={`atom://core/open/file?filename=${encodeURIComponent(match[1])}&line=${match[3]}${match[4] ? `&col=${match[5]}` : ""}`} on={{ click: this.handleFileLinkClick }} title="Open in Atom">{`${match[2]}:${match[3]}${match[4]}`} <i className="icon-link-external"></i></a>
							{lineSegments[1]}
						</span>
					);
				}
				else {
					line = (
						<span>{line}</span>
					);
				}
			} else {
				line = (
					<span>{line}</span>
				);
			}

			return line;
		});

		return (
			<pre className={ `j2-stack-trace padded ${this.props.expanded ? "expanded" : ""}`} on={{ click: this.onClick }}>{ lines }</pre>
		);
	}

}
