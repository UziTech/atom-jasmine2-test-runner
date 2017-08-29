"use babel";
/** @jsx etch.dom */

import etch from "etch";

import TimerView from "./timer-view";
import ResultsView from "./results-view";

const defaultProps = {
	title: "",
	specs: {},
	startedAt: null,
	endedAt: null,
	currentSpec: null
};

export default class J2ReporterView {
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

	onReloadClick() {
		require("electron").ipcRenderer.send("window-method", "reload");
	}

	onSymbolClick(spec) {
		return function () {
			const failure = document.querySelector(`#spec-failure-${spec.id}`);
			if (failure) {
				failure.scrollIntoView();
			}
		};
	}

	renderSymbol(spec) {
		let status = "pending";
		if (spec.endedAt) {
			switch (spec.result.status) {
				case "failed":
					status = "failed";
					break;
				case "passed":
					status = "passed";
					break;
				case "pending":
				case "disabled":
				default:
					status = "skipped";
			}
		}

		return (
			<li title={spec.title} className={`spec-summary ${status}`} on={{click: this.onSymbolClick(spec)}}></li>
		);
	}

	render() {
		let completeSpecCount = 0;
		let skippedCount = 0;
		let failedCount = 0;
		let totalSpecCount = 0;
		let failureCount = 0;

		let resultSpecs = [];
		let specSymbols = [];

		for (let id in this.props.specs) {
			let spec = this.props.specs[id];

			totalSpecCount++;

			if (spec.startedAt) {
				if (spec.endedAt) {
					completeSpecCount++;
					const addToResults = false;
					switch (spec.result.status) {
						case "failed":
							failureCount++;
							resultSpecs.push(spec);
							break;
						case "passed":
							if (spec.shouldFail) {
								resultSpecs.push(spec);
							}
							break;
						case "pending":
						case "disabled":
						default:
							skippedCount++;
					}
				}
			}

			specSymbols.push(this.renderSymbol(spec));
		}

		const results = resultSpecs.reduce((prev, spec) => {
			let children = prev;

			for (let suite of spec.suites) {
				if (!children[suite.id]) {
					children[suite.id] = {
						id: suite.id,
						description: suite.description,
						children: {},
					};
				}
				children = children[suite.id].children;
			}
			children[spec.id] = spec;

			return prev;
		}, {});

		let statusMessage = " ";
		if (this.props.endedAt) {
			statusMessage = failureCount + (failureCount === 1 ? " failure" : " failures");
		} else if (this.props.currentSpec) {
			if (this.props.currentSpec.suites.length > 0) {
				statusMessage = this.props.currentSpec.suites[0].description;
			} else {
				statusMessage = this.props.currentSpec.description.replace(/^it /, "");
			}
		}

		let statusClass = "alert-info";
		if (failureCount > 0) {
			statusClass = "alert-danger";
		} else if (this.props.endedAt) {
			statusClass = "alert-success";
		}

		return (
			<div className="j2-spec-reporter-container">
				<div className="spec-reporter">
					<div className="padded pull-right">
						<button className="btn btn-small reload-button" on={{click: this.onReloadClick}}>Reload Specs</button>
					</div>
					<div className="symbol-area">
						<div className="symbol-header">
							{this.props.title} Specs
						</div>
						<ul className="symbol-summary list-unstyled">
							{specSymbols}
						</ul>
					</div>
					<div className={`status alert ${statusClass}`}>
						<TimerView startedAt={this.props.startedAt} endedAt={this.props.endedAt} />
						<div className="spec-count">
							{
								skippedCount > 0 ?
								`${completeSpecCount - skippedCount}/${totalSpecCount - skippedCount} (${skippedCount} skipped)` :
								`${completeSpecCount}/${totalSpecCount}`
							}
						</div>
						<div className="message">
							{statusMessage}
						</div>
					</div>
					<ResultsView results={results} />
				</div>
			</div>
		);
	}
}
