"use babel";

function formatStack(expectResult) {
	let stack = expectResult.stack.split("\n");
	stack = stack.filter(line => !/at Spec\.addExpectationResult .*jasmine-should-fail/.test(line));
	expectResult.stack = stack.join("\n");
}

function addShouldFailExpectationResult(spec, addExpectationResult) {
	return function (passed, data, isError) {
		addExpectationResult.call(spec, !passed, data, passed);
		spec.result.failedExpectations.forEach(expectResult => { formatStack(expectResult); });
		spec.result.passedExpectations.forEach(expectResult => { formatStack(expectResult); });
	};
}

window.zdescribe = function (description, specDefinitions) {
	let suite;
	if (jasmine.version) {
		suite = describe(description, specDefinitions);
		suite.children.forEach(spec => {
			if (!spec.shouldFail) {
				spec.shouldFail = true;
				spec.addExpectationResult = addShouldFailExpectationResult(spec, spec.addExpectationResult);
			}
		});
	} else if (process.env.JANKY_SHA1 || process.env.CI || window.headless) {
		suite = describe(description, function () {});
	} else {
		suite = describe(description, specDefinitions);
	}

	return suite;
};

window.zit = function (description, specDefinition) {
	let spec;
	if (jasmine.version) {
		spec = it(description, specDefinition);
		spec.shouldFail = true;
		spec.addExpectationResult = addShouldFailExpectationResult(spec, spec.addExpectationResult);
	} else if (process.env.JANKY_SHA1 || process.env.CI || window.headless) {
		spec = it(description, function () {});
	} else {
		spec = it(description, specDefinition);
	}
	return spec;
};
