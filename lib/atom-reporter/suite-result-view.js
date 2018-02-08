/** @babel */
/** @jsx etch.dom */

import etch from "etch";

import ResultsView from "./results-view";
import DeprecationView from "./deprecation-view";
import ExpectationView from "./expectation-view";

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
		let description = this.props.suite.description;
		if (description === "Jasmine__TopLevel__Suite") {
			description = "";
		}
		return (
			<div id={`suite-view-${this.props.suite.id}`} className={`suite ${this.props.suite.shouldFail ? "should-fail" : ""}`}>
				<div class="description">{description}</div>
				{this.props.suite.deprecationWarnings.map(deprecation =>
					<DeprecationView deprecation={deprecation} />
				)}
				{this.props.suite.failedExpectations.map(expectation =>
					<ExpectationView expectation={expectation} specDirectory={this.props.suite.specDirectory} />
				)}
				<ResultsView results={this.props.suite.children} />
			</div>
		);
	}
}
