/** @babel */
/** @jsx etch.dom */

import etch from "etch";

import ExpectationView from "./expectation-view";
import DeprecationView from "./deprecation-view";

const defaultProps = {
	spec: {},
	folded: false,
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

	onToggle() {
		this.update({
			folded: !this.props.folded
		});
	}

	render() {
		const shouldFail = this.props.spec.shouldFail && this.props.spec.result.status === "passed";
		const expectations = (
			shouldFail ?
			this.props.spec.result.passedExpectations :
			this.props.spec.result.failedExpectations
		);

		return (
			<div id={`spec-failure-${this.props.spec.id}`} className={`spec ${shouldFail ? "should-fail" : ""}`} >
				<div className={`j2-spec-toggle ${this.props.folded ? "icon-unfold" : "icon-fold"}`} on={{click: this.onToggle}}></div>
				<div className="description">it {this.props.spec.description.replace(/^it /, "")}</div>
				<div className={`spec-failures ${this.props.folded ? "hidden" : ""}`}>
					{this.props.spec.result.deprecationWarnings.map(deprecation =>
						<DeprecationView deprecation={deprecation} />
					)}
					{expectations.map(expectation =>
						<ExpectationView expectation={expectation} specDirectory={this.props.spec.specDirectory} />
					)}
				</div>
			</div>
		);
	}
}
