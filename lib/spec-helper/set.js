/** @babel */

Set.prototype.jasmineToString = function () {
	const arr = Array.from(this).map(el => el.toString());
	return `Set {${arr.join(", ")}}`;
};

Set.prototype.isEqual = function (other) {
	return (
		other instanceof Set &&
		this.size === other.size &&
		Array.from(this).every(item => other.has(item))
	);
};
