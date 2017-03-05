"use babel";

Set.prototype.jasmineToString = function () {
	let result = "Set {";
	let first = true;
	this.forEach(function (element) {
		if (!first) { result += ", "; }
		return result += element.toString();
	});
	first = false;
	return result + "}";
};

Set.prototype.isEqual = function (other) {
	return (
		other instanceof Set &&
		this.size === other.size &&
		Array.from(this).every(item => other.has(item))
	);
};
