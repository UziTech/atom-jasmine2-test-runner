/** @babel */
/** @jsx etch.dom */

import etch from "etch";

import ResultsView from "./results-view";

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
		return (
			<div id={`suite-view-${this.props.suite.id}`} className="suite" >
				<div class="description">{this.props.suite.description}</div>
				<ResultsView results={this.props.suite.children} />
			</div>
		);
	}
}
