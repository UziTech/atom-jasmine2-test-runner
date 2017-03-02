"use babel";
/** @jsx etch.dom */

import etch from "etch";

export default class Dot {
	constructor(props) {
		this.props = props;
		etch.initialize(this);
	}

	update(props) {
		this.props = props;
		etch.update(this);
	}

	render() {
		return (
			<li className={`dot ${this.props.test.status}`} title={this.props.test.fullName}>{"\u2b24"}</li>
		);
	}
}
