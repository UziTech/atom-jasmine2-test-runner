"use babel";
/** @jsx etch.dom */

import etch from "etch";

import SuiteResultView from "./suite-result-view";
import SpecResultView from "./spec-result-view";

const defaultProps = {
	results: {},
};

export default class ResultsView {
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
			<div className="j2-results">
				{
					Object.values(this.props.results).map(result =>
						result.children ?
						<SuiteResultView suite={result} /> :
						<SpecResultView spec={result} />
					)
				}
			</div>
		);
	}

}
