/** @babel */
/** @jsx etch.dom */

import etch from "etch";

import TimerView from "./timer-view";
import ResultsView from "./results-view";

const defaultProps = {
	title: "",
	specs: {},
	startedAt: null,
	endedAt: null,
	currentSpec: null,
	topSuite: null,
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
		atom.reload();
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

	getResults(children) {
		let results = [];

		for (const child of children) {

			if (!child.children && (!child.endedAt || child.result.status === "pending")) {
				// spec has not finished running
				continue;
			}

			let result = {
				id: child.id,
				specDirectory: child.specDirectory,
				description: child.description,
				deprecationWarnings: child.result.deprecationWarnings || [],
				failedExpectations: child.result.failedExpectations || [],
				passedExpectations: child.result.passedExpectations || [],
				shouldFail: child.shouldFail,
				status: child.result.status,
			};
			if (child.children) {
				result.children = this.getResults(child.children);
			}

			const showReasons = [
				result.deprecationWarnings.length > 0,
				result.failedExpectations.length > 0,
				result.children && result.children.length > 0,
				result.shouldFail && result.passedExpectations.length > 0,
			];

			let shouldShow = showReasons.reduce(function (show, reason) {
				return show || reason;
			}, false);

			if (shouldShow) {
				results.push(result);
			}
		}

		return results;
	}

	render() {
		let completeSpecCount = 0;
		let skippedCount = 0;
		let failedCount = 0;
		let totalSpecCount = 0;
		let failureCount = 0;

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
							break;
						case "passed":
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

		const results = this.getResults([this.props.topSuite]);

		let statusMessage = " ";
		if (this.props.endedAt) {
			const s = (failureCount === 1 ? "" : "s");
			statusMessage = failureCount + " failure" + s;
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
