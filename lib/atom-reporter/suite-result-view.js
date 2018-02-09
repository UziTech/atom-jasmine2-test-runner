/** @babel */
/** @jsx etch.dom */

import etch from "etch";

/* eslint-disable no-unused-vars */
import ResultsView from "./results-view";
import DeprecationView from "./deprecation-view";
import ExpectationView from "./expectation-view";
/* eslint-enable no-unused-vars */

const defaultProps = {
	suite: {},
};

export default class SuiteResultView {
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

	render() {
		const shouldFail = this.props.suite.shouldFail && this.props.suite.failedExpectations.length === 0;

		let expectations = [];
		if (!shouldFail) {
			expectations = this.props.suite.failedExpectations;
		} else if (this.props.suite.shouldFail) {
			expectations = this.props.suite.passedExpectations;
		}

		let { description } = this.props.suite;
		if (description === "Jasmine__TopLevel__Suite") {
			description = "";
		}
		return (
			<div id={`suite-view-${this.props.suite.id}`} className={`suite ${shouldFail ? "should-fail" : ""}`}>
				<div class="description">{description}</div>
				{this.props.suite.deprecationWarnings.map(deprecation =>
					<DeprecationView deprecation={deprecation} />
				)}
				{expectations.map(expectation =>
					<ExpectationView expectation={expectation} specDirectory={this.props.suite.specDirectory} />
				)}
				<ResultsView results={this.props.suite.children} />
			</div>
		);
	}
}
