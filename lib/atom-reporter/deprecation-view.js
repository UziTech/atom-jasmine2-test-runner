/** @babel */
/** @jsx etch.dom */

import etch from "etch";

const defaultProps = {
	deprecation: {},
};

export default class DeprecationView {
	constructor(props) {
		this.props = { ...defaultProps, ...props };

		etch.initialize(this);
	}

	update(props) {
		this.props = { ...this.props, ...props };

		return etch.update(this);
	}

	destroy() {
		return etch.destroy(this);
	}

	render() {
		return (
			<div className="deprecation">
				<div className="result-message">{this.props.deprecation.message}</div>
			</div>
		);
	}
}
