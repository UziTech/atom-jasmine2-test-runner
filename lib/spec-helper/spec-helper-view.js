"use babel";
/** @jsx etch.dom */

import etch from "etch";

const defaultProps = {
	message: "",
	error: "",
	headless: false,
};

export default class SpecHelperView {
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

	error(error) {
		return this.update({
			message: `Error ${this.props.message}`,
			error
		});
	}

	render() {

		const divStyle = {
			backgroundColor: "#fff",
			display: "flex",
			height: "100%",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
		};

		const messageStyle = {
			fontSize: "20px",
			fontWeight: "bold",
			marginBottom: "15px",
			color: "#333",
		};

		const errorStyle = Object.assign({}, messageStyle, {
			color: "#c33",
		});

		const spanStyle = (this.props.error ? errorStyle : messageStyle);

		let detail = "";
		if (this.props.error) {
			detail = (<pre>{this.props.error}</pre>);
		} else {
			detail = (<progress />);
		}

		return (
			<div className="installing" style={divStyle}>
				<span style={spanStyle}>
					{this.props.message}
				</span>
				{detail}
			</div>
		);
	}
}
