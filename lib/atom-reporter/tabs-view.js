/** @babel */
/** @jsx etch.dom */

import etch from "etch";

const defaultProps = {
	active: "j2-tab",
	minimizeHidden: true,
	j1TestsHidden: true,
	j1TestsAvailable: false,
	j2TestsHidden: true,
};

export default class TabsView {
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

	onClick(event) {
		if (event.target.classList.contains("active") || event.target.classList.contains("hidden") || event.target.classList.contains("not-available")) {
			return;
		}

		this.update({
			active: event.target.id
		});
	}

	render() {

		const j2Classes = [
			"tab",
			(this.props.j2TestsHidden ? "hidden" : ""),
			(this.props.active === "j2-tab" ? "active" : "not-active")
		];
		const j1Classes = [
			"tab",
			(this.props.j1TestsHidden ? "hidden" : ""),
			(this.props.active === "j1-tab" ? "active" : "not-active"),
			(this.props.j1TestsAvailable ? "" : "not-available"),
		];
		const minimizeClasses = [
			"tab",
			(this.props.minimizeHidden ? "hidden" : ""),
		];

		this.props.j1Container = this.props.j1Container || document.querySelector(".spec-reporter-container");
		switch (this.props.active) {
		case "j2-tab":
			if (this.props.j1Container) {
				this.props.j1Container.classList.add("not-active");
			}
			document.body.classList.remove("minimize-specs");
			break;
		case "j1-tab":
			if (this.props.j1Container) {
				this.props.j1Container.classList.remove("not-active");
			}
			document.body.classList.remove("minimize-specs");
			break;
		case "minimize-tab":
			document.body.classList.add("minimize-specs");
			break;
		default:
				// do nothing
		}

		return (
			<div className="spec-reporter-tabs">
				<span id="j2-tab" className={j2Classes.join(" ")} on={{ click: this.onClick }}>Jasmine 2 Tests</span>
				<span id="j1-tab" className={j1Classes.join(" ")} on={{ click: this.onClick }}>Jasmine 1 Tests</span>
				<span id="minimize-tab" className={minimizeClasses.join(" ")} on={{ click: this.onClick }}>Show Editor</span>
			</div>
		);
	}

}
