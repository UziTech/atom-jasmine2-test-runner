/** @babel */
/** @jsx etch.dom */

import etch from "etch";

/* eslint-disable no-unused-vars */
import ExpectationView from "./expectation-view";
import DeprecationView from "./deprecation-view";
/* eslint-enable no-unused-vars */

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
		const shouldFail = this.props.spec.shouldFail && this.props.spec.failedExpectations.length === 0;

		let expectations = [];
		if (!shouldFail) {
			expectations = this.props.spec.result.failedExpectations;
		} else if (this.props.spec.shouldFail) {
			expectations = this.props.spec.result.passedExpectations;
		}

		return (
			<div id={`spec-failure-${this.props.spec.id}`} className={`spec ${shouldFail ? "should-fail" : ""}`} >
				<div className={`j2-spec-toggle ${this.props.folded ? "icon-unfold" : "icon-fold"}`} on={{ click: this.onToggle }}></div>
				<div className="description">it {this.props.spec.description.replace(/^it /, "")}</div>
				<div className={`spec-failures ${this.props.folded ? "hidden" : ""}`}>
					{this.props.spec.deprecationWarnings.map(deprecation =>
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
