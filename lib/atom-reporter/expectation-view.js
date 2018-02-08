/** @babel */
/** @jsx etch.dom */

import etch from "etch";

/* eslint-disable no-unused-vars */
import StackTraceView from "./stack-trace-view";
/* eslint-enable no-unused-vars */

const defaultProps = {
	expectation: {},
	specDirectory: "",
};

export default class ExpectationView {
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
		return (
			<div className="expectation">
				<div className="result-message fail">{this.props.expectation.message}</div>
				<StackTraceView message={this.props.expectation.message} stack={this.props.expectation.stack} specDirectory={this.props.specDirectory} />
			</div>
		);
	}
}
