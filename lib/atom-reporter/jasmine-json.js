"use babel";
/* globals jasmine, beforeEach */

let failures = {};

function addFailure(path, actual, expected) {
	path = path.join(".") || "<root>";
	return failures[path] = `
    ${path}:
actual:   ${actual}
expected: ${expected}
`;
}

function unorderedEqual(one, two) {
	return (
		one.length === two.length &&
		one.every(i => two.includes(i))
	);
}

function appendToPath(path, value) {
	return path.concat([value]);
}

function compare(path, actual, expected) {
	if (actual === expected) { return; }

	if (actual === null || expected === null) {
		addFailure(path, JSON.stringify(actual), JSON.stringify(expected));
	} else if (typeof actual === "undefined" || typeof expected === "undefined") {
		addFailure(path, JSON.stringify(actual), JSON.stringify(expected));
	} else if (actual.constructor.name !== expected.constructor.name) {
		addFailure(path, JSON.stringify(actual), JSON.stringify(expected));
	} else {
		switch (actual.constructor.name) {

			case "Array":
				if (actual.length !== expected.length) {
					addFailure(path, `has length ${actual.length} ${JSON.stringify(actual)}`, `has length ${expected.length} ${JSON.stringify(expected)}`);
				} else {
					for (let i of actual) {
						compare(appendToPath(path, i), actual[i], expected[i]);
					}
				}
				return;

			case "Object":
				let actualKeys = Object.keys(actual);
				let expectedKeys = Object.keys(expected);
				if (!unorderedEqual(actualKeys, expectedKeys)) {
					addFailure(path, `has keys ${JSON.stringify(actualKeys.sort())}`, `has keys ${JSON.stringify(expectedKeys.sort())}`);
				} else {
					for (let i of actualKeys) {
						const key = actualKeys[i];
						compare(appendToPath(path, key), actual[key], expected[key]);
					}
				}
				return;

			case "Number":
				if (isNaN(actual) && isNaN(expected)) {
					return;
				}
				// fall through
			case "String":
			case "Boolean":
			default:
				if (actual !== expected) {
					addFailure(path, JSON.stringify(actual), JSON.stringify(expected));
				}
				return;
		}
	}
}

beforeEach(function () {
	jasmine.addMatchers({
		toEqualJson(util, customEqualityTesters) {
			return {
				compare: function (actual, expected) {
					let result = {};

					compare([], actual, expected);
					const failedPaths = Object.keys(failures);
					result.pass = (failedPaths.length > 0);

					if (result.pass) {
						const messages = failedPaths.map(path => failures[path]);
						result.message = `JSON is not equal:\n${messages.join("\n")}`;
					} else {
						result.message = `${actual} is equal to ${expected}`;
					}
					return result;
				}
			};
		}
	});
});
