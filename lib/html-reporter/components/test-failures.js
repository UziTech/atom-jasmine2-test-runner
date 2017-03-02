"use babel";
/** @jsx etch.dom */

import etch from "etch";

import Collapser from "./collapser";

export default class TestFailures {
	constructor(props) {
		this.props = props;

		this.renderFailedTest = this.renderFailedTest.bind(this);
		this.renderFailedExpectation = this.renderFailedExpectation.bind(this);

		etch.initialize(this);
	}

	update(props) {
		this.props = props;
		etch.update(this);
	}

	render() {
		return (
			<div className='failures-container'>
				{this.props.tests.filter(test => test.status === "failed").map(this.renderFailedTest)}
			</div>
		);
	}

	renderFailedTest(test) {
		return (
			<Collapser className='test' header={< div className = 'title' > {
				test.fullName
			} < /div>}>
				{test.failedExpectations.map(this.renderFailedExpectation)}
			</Collapser>
		);
	}

	renderFailedExpectation(expectation) {
		const stack = expectation.stack.split("\n");
		return (
			<div>
				<div className='assertion-failure'>{expectation.message}</div>
				<div className='stack'>
					{stack.map(cs => <div>{cs}</div>)}
				</div>
			</div>
		);
	}
}
