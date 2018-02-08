/** @babel */
/** @jsx etch.dom */

import etch from "etch";

const defaultProps = {
	message: "",
	error: "",
	headless: false,
};

const divStyle = {
	backgroundColor: "#fff",
	display: "flex",
	height: "100%",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
};

export default class SetupView {
	constructor(props) {
		this.props = Object.assign({}, defaultProps, props);

		etch.initialize(this);

		if (!this.props.headless) {
			document.body.appendChild(this.element);
		}
	}

	update(props) {
		this.props = Object.assign({}, this.props, props);

		return etch.update(this);
	}

	destroy() {
		return etch.destroy(this);
	}

	onReloadClick() {
		atom.reload();
	}

	install(pkg, version) {
		let message = `Installing ${pkg}`;
		if (version) {
			message = `${message}@${version}`;
		}
		if (this.props.headless) {
			console.log(message);
		}
		return this.update({ message });
	}

	error(error, message = this.props.message) {
		return this.update({
			message: `Error ${message}`,
			error
		});
	}

	render() {
		return (
			<div className="setup" style={divStyle}>
				<h1 className={`padded ${this.props.error ? "text-error" : "text-info"}`}>
					{this.props.message}
				</h1>
				<div className="padded">
					{
						this.props.error ?
							<pre><code>{this.props.error}</code></pre> :
							<progress />
					}
				</div>
				<div className={`padded ${this.props.error ? "" : "hide"}`}>
					<button className="btn btn-lg btn-error reload-button" on={{ click: this.onReloadClick }}>Reload Specs</button>
				</div>
			</div>
		);
	}
}
