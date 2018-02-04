/** @babel */
/** @jsx etch.dom */

import etch from "etch";

const defaultProps = {
	time: 0,
	startedAt: null,
	endedAt: null,
};

export default class TimerView {
	constructor(props) {

		this.props = Object.assign({}, defaultProps, props);

		this.tick = this.tick.bind(this);

		etch.initialize(this);

		if (this.props.startedAt && !this.props.endedAt) {
			requestAnimationFrame(this.tick);
		}
	}

	update(props) {
		this.props = Object.assign({}, this.props, props);

		const update = etch.update(this);

		if (this.props.startedAt && !this.props.endedAt) {
			requestAnimationFrame(this.tick);
		}

		return update;
	}

	destroy() {
		return etch.destroy(this);
	}

	tick() {
		this.update({
			time: ((this.props.endedAt || Date.now()) - this.props.startedAt) / 1000
		});
	}

	render() {
		return (
			<div className="time">
				{this.props.time.toFixed(2)}s
			</div>
		);
	}

}
