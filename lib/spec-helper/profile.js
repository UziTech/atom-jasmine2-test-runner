// converted from https://github.com/atom/atom/blob/master/src/window.js

// Public: Measure how long a function takes to run.
//
// description - A {String} description that will be logged to the console when
//               the function completes.
// fn - A {Function} to measure the duration of.
//
// Returns the value returned by the given function.
window.measure = function (description, fn) {
	const start = Date.now();
	const value = fn();
	const result = Date.now() - start;
	console.log(description, result);
	return value;
};

// Public: Create a dev tools profile for a function.
//
// description - A {String} description that will be available in the Profiles
//               tab of the dev tools.
// fn - A {Function} to profile.
//
// Returns the value returned by the given function.
window.profile = function (description, fn) {
	window.measure(description, function () {
		console.profile(description);
		const value = fn();
		console.profileEnd(description);
		return value;
	});
};
